import React from 'react';
import {
  X,
  MessageCircle,
  Send,
  Clock,
  Briefcase,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { saveDocToCloud } from '../../services/firestoreService.js';

export default function ChatView({
  currentUser,
  users,
  role,
  messages,
  setMessages,
  initialActiveChat,
  activeChatContext,
  projects,
  serviceOrders,
  setActiveChatContext,
  isChatOpen,
  onClose,
  sendNotification,
  setActiveTab
}) {
  const [activeChat, setActiveChat] = React.useState(initialActiveChat || null);
  const [messageText, setMessageText] = React.useState('');
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (initialActiveChat) {
      setActiveChat(initialActiveChat);
    }
  }, [initialActiveChat]);

  // Helper untuk menghitung sisa waktu pengerjaan / deadline lamaran
  const getRemainingTime = (project, applicant) => {
    if (!project) return null;
    if (project.status === 'Selesai') {
      return { text: 'Proyek Selesai', isExpired: false, badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
    if (project.status === 'Menunggu Review') {
      return { text: 'Menunggu Review UMKM', isExpired: false, badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' };
    }

    const deadlineStr = (project.deadline || '').toString().trim();
    if (!deadlineStr || deadlineStr.toLowerCase() === 'selesai') {
      return { text: 'Sesuai kesepakatan', isExpired: false, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    }

    // Ambil durasi hari jika formatnya "3 Hari", "7 Hari", dsb.
    const dayMatch = deadlineStr.match(/(\d+)\s*(hari|day|h)/i);
    const numDays = dayMatch ? parseInt(dayMatch[1], 10) : (deadlineStr.match(/^\d+$/) ? parseInt(deadlineStr, 10) : null);

    // Tanggal patokan awal
    let startDate = null;
    if (applicant && applicant.date) {
      if (applicant.date.includes('/')) {
        const parts = applicant.date.split('/');
        if (parts.length === 3) {
          startDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        }
      } else {
        startDate = new Date(applicant.date);
      }
    }
    if (!startDate || isNaN(startDate.getTime())) {
      if (project.createdAt) {
        startDate = new Date(project.createdAt);
      } else if (project.date && project.date.includes('/')) {
        const parts = project.date.split('/');
        if (parts.length === 3) {
          startDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        }
      }
    }
    if (!startDate || isNaN(startDate.getTime())) {
      startDate = new Date();
    }

    if (numDays !== null && !isNaN(numDays)) {
      const deadlineTimestamp = startDate.getTime() + (numDays * 24 * 60 * 60 * 1000);
      const now = Date.now();
      const diffMs = deadlineTimestamp - now;

      if (diffMs > 0) {
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const remDays = Math.floor(totalHours / 24);
        const remHours = totalHours % 24;

        let formatted = '';
        if (remDays > 0) {
          formatted = `Sisa ${remDays} hari ${remHours > 0 ? `${remHours} jam` : ''}`;
        } else {
          formatted = `Sisa ${Math.max(1, totalHours)} jam lagi`;
        }

        return {
          text: formatted,
          isExpired: false,
          badgeClass: remDays <= 1 
            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
        };
      } else {
        return {
          text: `Batas Waktu Berakhir (${deadlineStr})`,
          isExpired: true,
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
        };
      }
    }

    return {
      text: `Batas Waktu: ${deadlineStr}`,
      isExpired: false,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
    };
  };

  const getPartnerId = (chatId) => {
    if (!chatId) return null;
    if (chatId.includes('::')) {
      const parts = chatId.split('::');
      return parts[1] === currentUser?.id ? parts[2] : parts[1];
    }
    if (Array.isArray(users)) {
      const otherUsers = [...users]
        .filter(u => u && u.id && u.id !== currentUser?.id)
        .sort((a, b) => (b.id?.length || 0) - (a.id?.length || 0));
      const matched = otherUsers.find(u => chatId.includes(u.id));
      if (matched) return matched.id;
    }
    const parts = chatId.split('_');
    if (parts.length >= 3) {
      return parts[1] === currentUser?.id ? parts[2] : parts[1];
    }
    return null;
  };

  const getProjectId = (chatId) => {
    if (!chatId) return null;
    if (chatId.includes('::')) {
      const parts = chatId.split('::');
      return parts[3] && parts[3] !== 'general' && parts[3] !== 'none' ? parts[3] : null;
    }
    if (Array.isArray(projects)) {
      const sortedProjects = [...projects]
        .filter(p => p && p.id)
        .sort((a, b) => b.id.length - a.id.length);
      const matched = sortedProjects.find(p => chatId.includes(p.id));
      if (matched) return matched.id;
    }
    const parts = chatId.split('_');
    return parts[3] || null;
  };

  const safeMessages = Array.isArray(messages) ? messages : [];

  // ==========================================
  // DISCOVERY SALURAN PERCAKAPAN (CHANNELS)
  // Menemukan percakapan dari:
  // 1. Proyek & Lamaran aktif
  // 2. Pesanan katalog jasa (serviceOrders)
  // 3. Riwayat pesan messages
  // ==========================================
  const channelMap = new Map();

  // 1. Proyek & Lamaran yang melibatkan currentUser
  if (Array.isArray(projects)) {
    projects.forEach(project => {
      if (!project) return;

      // Jika role UMKM: temukan semua pelamar mahasiswa
      if (currentUser?.role === 'umkm' && (project.umkmId === currentUser.id || !project.umkmId)) {
        (project.applicants || []).forEach(applicant => {
          if (!applicant || !applicant.studentId) return;
          const chatId = `chat::${applicant.studentId}::${currentUser.id}::${project.id}`;
          const partner = Array.isArray(users) ? users.find(u => u.id === applicant.studentId) : null;
          channelMap.set(chatId, {
            chatId,
            partnerId: applicant.studentId,
            partnerName: applicant.studentName || partner?.name || 'Mahasiswa Pelamar',
            partnerRole: 'student',
            partnerUniv: partner?.univ || 'Mahasiswa Terdaftar',
            projectId: project.id,
            project,
            applicant,
            type: 'project'
          });
        });
      }

      // Jika role Mahasiswa: temukan proyek yang pernah dilamar
      if (currentUser?.role === 'student') {
        const myApp = (project.applicants || []).find(a => a.studentId === currentUser.id);
        if (myApp) {
          const umkmId = project.umkmId || 'umkm_partner';
          const chatId = `chat::${currentUser.id}::${umkmId}::${project.id}`;
          const partner = Array.isArray(users) ? users.find(u => u.id === umkmId) : null;
          channelMap.set(chatId, {
            chatId,
            partnerId: umkmId,
            partnerName: project.umkmName || partner?.name || 'Mitra UMKM',
            partnerRole: 'umkm',
            projectId: project.id,
            project,
            applicant: myApp,
            type: 'project'
          });
        }
      }
    });
  }

  // 2. Dari serviceOrders (pesanan jasa katalog)
  if (Array.isArray(serviceOrders)) {
    serviceOrders.forEach(order => {
      if (!order) return;
      const isStudent = order.studentId === currentUser?.id || order.providerId === currentUser?.id;
      const isUmkm = order.umkmId === currentUser?.id;
      if (isStudent || isUmkm) {
        const studentId = order.studentId || order.providerId;
        const umkmId = order.umkmId;
        const chatId = `chat::${studentId}::${umkmId}::order_${order.id}`;
        const partnerId = currentUser?.id === studentId ? umkmId : studentId;
        const partnerName = currentUser?.id === studentId ? (order.umkmName || 'Mitra UMKM') : (order.providerName || order.studentName || 'Penyedia Jasa');
        const partnerRole = currentUser?.id === studentId ? 'umkm' : 'student';

        channelMap.set(chatId, {
          chatId,
          partnerId,
          partnerName,
          partnerRole,
          orderId: order.id,
          order,
          type: 'service_order'
        });
      }
    });
  }

  // 3. Dari pesan yang tersimpan di messages
  safeMessages.forEach(m => {
    if (m && m.chatId && (m.chatId.includes(currentUser?.id) || m.senderId === currentUser?.id)) {
      if (!channelMap.has(m.chatId)) {
        const pId = getPartnerId(m.chatId);
        const projId = getProjectId(m.chatId);
        const partner = pId && Array.isArray(users) ? users.find(u => u.id === pId) : null;
        const project = projId && Array.isArray(projects) ? projects.find(p => p.id === projId) : null;

        channelMap.set(m.chatId, {
          chatId: m.chatId,
          partnerId: pId,
          partnerName: partner?.name || (project ? (role === 'student' ? project.umkmName : 'Mahasiswa') : 'Mitra Diskusi'),
          partnerRole: role === 'student' ? 'umkm' : 'student',
          projectId: projId,
          project: project || null,
          type: projId?.startsWith('order_') ? 'service_order' : 'project'
        });
      }
    }
  });

  // Jika ada activeChat yang dibuka langsung
  if (activeChat && !channelMap.has(activeChat)) {
    const pId = getPartnerId(activeChat);
    const projId = getProjectId(activeChat);
    const partner = pId && Array.isArray(users) ? users.find(u => u.id === pId) : null;
    const project = projId && Array.isArray(projects) ? projects.find(p => p.id === projId) : null;

    channelMap.set(activeChat, {
      chatId: activeChat,
      partnerId: pId,
      partnerName: partner?.name || (project ? (role === 'student' ? project.umkmName : 'Mahasiswa') : 'Mitra Diskusi'),
      partnerRole: role === 'student' ? 'umkm' : 'student',
      projectId: projId,
      project: project || null,
      type: 'general'
    });
  }

  // Urutkan daftar percakapan berdasarkan waktu pesan terakhir
  const chatList = Array.from(channelMap.keys()).sort((a, b) => {
    const msgsA = safeMessages.filter(m => m.chatId === a);
    const msgsB = safeMessages.filter(m => m.chatId === b);
    const lastA = msgsA[msgsA.length - 1];
    const lastB = msgsB[msgsB.length - 1];

    if (!lastA && !lastB) return 0;
    if (!lastA) return 1;
    if (!lastB) return -1;
    return (lastB.createdAt || lastB.id).localeCompare(lastA.createdAt || lastA.id);
  });

  // Jika di desktop dan belum memilih chat, auto-select chat pertama jika ada
  React.useEffect(() => {
    if (!activeChat && chatList.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 768) {
      setActiveChat(chatList[0]);
      const ch = channelMap.get(chatList[0]);
      if (ch?.projectId) {
        setActiveChatContext(ch.projectId);
      }
    }
  }, [chatList.length, activeChat]);

  if (!isChatOpen) return null;

  // Detail percakapan aktif yang terpilih
  const currentChannel = activeChat ? channelMap.get(activeChat) : null;
  const activeProjectId = activeChatContext || (currentChannel?.projectId) || (activeChat ? getProjectId(activeChat) : null);
  const activeProject = currentChannel?.project || (activeProjectId && Array.isArray(projects) ? projects.find(p => p.id === activeProjectId) : null);
  const activeOrder = currentChannel?.order || (activeProjectId && activeProjectId.startsWith('order_') && Array.isArray(serviceOrders) ? serviceOrders.find(o => `order_${o.id}` === activeProjectId) : null);

  const partnerId = currentChannel?.partnerId || (activeChat ? getPartnerId(activeChat) : null);
  let activePartner = partnerId && Array.isArray(users) ? users.find(u => u.id === partnerId) : null;

  if (!activePartner) {
    if (currentChannel?.partnerName) {
      activePartner = {
        id: partnerId || 'partner',
        name: currentChannel.partnerName,
        role: currentChannel.partnerRole || (role === 'student' ? 'umkm' : 'student')
      };
    } else if (activeProject) {
      activePartner = {
        id: role === 'student' ? activeProject.umkmId : (partnerId || 'student'),
        name: role === 'student' ? (activeProject.umkmName || 'Mitra UMKM') : 'Mahasiswa Pelamar',
        role: role === 'student' ? 'umkm' : 'student'
      };
    } else {
      activePartner = {
        id: partnerId || 'partner',
        name: role === 'student' ? 'Mitra UMKM' : 'Mahasiswa',
        role: role === 'student' ? 'umkm' : 'student'
      };
    }
  }

  // Dapatkan pelamar dari activeProject
  const activeApplicant = currentChannel?.applicant || (activeProject?.applicants?.find(a => 
    role === 'student' ? a.studentId === currentUser?.id : (partnerId ? a.studentId === partnerId : a.studentId !== currentUser?.id)
  ));

  const remainingInfo = activeProject ? getRemainingTime(activeProject, activeApplicant) : null;
  const activeMessages = safeMessages.filter(m => m.chatId === activeChat);

  const handleSendMessage = (textParam) => {
    const textToSend = (typeof textParam === 'string' ? textParam : messageText).trim();
    if (!textToSend || !activeChat) return;

    const projectId = getProjectId(activeChat) || activeChatContext;
    const targetPartnerId = getPartnerId(activeChat);

    const newMsg = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      chatId: activeChat,
      senderId: currentUser.id,
      senderName: currentUser.name || '',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      projectId: projectId || null,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => {
      if (prev.some(m => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
    setMessageText('');

    // Simpan ke Cloud Firestore agar realtime
    saveDocToCloud('messages', newMsg.id, newMsg);

    if (sendNotification && targetPartnerId) {
      sendNotification({
        userId: targetPartnerId,
        role: role === 'student' ? 'umkm' : 'student',
        type: 'chat_message',
        title: `Pesan baru dari ${currentUser.name || 'Mitra'} 💬`,
        message: textToSend.length > 60 ? textToSend.substring(0, 57) + '...' : textToSend,
        actionType: 'open_chat',
        contextId: activeChat
      });
    }
  };

  return (
    <div className={`fixed z-[150] bg-white shadow-2xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
      isFullscreen 
        ? 'inset-0 w-full h-[100dvh] rounded-none' 
        : 'bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[460px] lg:w-[780px] h-[82vh] md:h-[620px] md:max-h-[85vh] rounded-t-3xl md:rounded-3xl border-t md:border border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.15)]'
    }`}>
      {/* ========================================================= */}
      {/* KOLOM KIRI: DAFTAR PERCAKAPAN & PROYEK                    */}
      {/* ========================================================= */}
      <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-5/12 border-r border-slate-200 flex-col bg-slate-50`}>
        {/* Header List Percakapan */}
        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <MessageCircle size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">Pesan & Diskusi</h2>
              <p className="text-[10px] text-slate-500 font-bold">{chatList.length} Percakapan Aktif</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isFullscreen ? (
              <button 
                type="button" 
                onClick={() => setIsFullscreen(false)} 
                title="Kecilkan jendela"
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1"
              >
                <span className="text-xs font-bold hidden md:inline">Kecilkan</span>
                <span className="text-sm font-bold md:hidden">↓</span>
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setIsFullscreen(true)} 
                title="Perbesar layar penuh"
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <span className="text-xs font-bold hidden md:inline">Perbesar</span>
                <span className="text-xs font-bold md:hidden">⤢</span>
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose} 
              className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Konten Daftar Obrolan */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {chatList.map(chatId => {
            const ch = channelMap.get(chatId);
            const proj = ch?.project;
            const applicant = ch?.applicant;
            const order = ch?.order;
            const rem = proj ? getRemainingTime(proj, applicant) : null;

            const channelMsgs = safeMessages.filter(m => m.chatId === chatId);
            const lastMsg = channelMsgs[channelMsgs.length - 1];

            const isSelected = activeChat === chatId;

            return (
              <div 
                key={chatId}
                onClick={() => {
                  setActiveChat(chatId);
                  if (ch?.projectId) setActiveChatContext(ch.projectId);
                }}
                className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected 
                    ? 'bg-blue-50/80 border-l-4 border-l-blue-600' 
                    : 'bg-white hover:bg-slate-100/80 border-l-4 border-l-transparent'
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                  ch?.partnerRole === 'umkm' 
                    ? 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'
                }`}>
                  {(ch?.partnerName || 'M').charAt(0).toUpperCase()}
                </div>

                {/* Konten Ringkas */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-slate-900 text-sm truncate pr-1">
                      {ch?.partnerName || 'Mitra'}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {lastMsg ? lastMsg.timestamp : (applicant?.date || 'Hari ini')}
                    </span>
                  </div>

                  {/* Judul Proyek / Jasa */}
                  {proj ? (
                    <p className="text-[11px] font-extrabold text-blue-700 truncate mb-1">
                      💼 {proj.title}
                    </p>
                  ) : order ? (
                    <p className="text-[11px] font-extrabold text-emerald-700 truncate mb-1">
                      🛍️ Pesanan: {order.serviceTitle}
                    </p>
                  ) : null}

                  {/* Badge Sisa Waktu & Status Proyek */}
                  {rem && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${rem.badgeClass}`}>
                        <Clock size={10} />
                        {rem.text}
                      </span>
                      {applicant?.status && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          applicant.status === 'Diterima' ? 'bg-emerald-100 text-emerald-800' :
                          applicant.status === 'Ditolak' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {applicant.status}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Cuplikan Pesan Terakhir atau Proposal */}
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {lastMsg ? (
                      lastMsg.text
                    ) : applicant?.proposal ? (
                      `Proposal: "${applicant.proposal}"`
                    ) : (
                      'Klik untuk mulai diskusi proyek...'
                    )}
                  </p>
                </div>

                <ChevronRight size={14} className="text-slate-300 shrink-0 self-center" />
              </div>
            );
          })}

          {chatList.length === 0 && (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Belum ada percakapan aktif</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Ruang obrolan akan otomatis dibuat ketika Anda melamar proyek atau menerima pelamar.
                </p>
              </div>
              {role === 'student' && setActiveTab && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('cari');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Briefcase size={13} /> Cari Lowongan Proyek &rarr;
                </button>
              )}
              {role === 'umkm' && setActiveTab && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('post');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <Briefcase size={13} /> Posting Lowongan Proyek &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* KOLOM KANAN: RUANG CHAT AKTIF                             */}
      {/* ========================================================= */}
      <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-7/12 flex-col bg-slate-50 relative`}>
        {activeChat ? (
          <>
            {/* Topbar Obrolan */}
            <div className="p-3.5 border-b border-slate-200 bg-white flex justify-between items-center shadow-xs z-20 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <button 
                  type="button" 
                  className="md:hidden p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1" 
                  onClick={() => setActiveChat(null)}
                >
                  <ArrowLeft size={18} />
                  <span className="text-xs font-bold">Kembali</span>
                </button>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  activePartner?.role === 'umkm' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {(activePartner?.name || 'M').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 text-sm truncate leading-tight">
                    {activePartner?.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">
                      {activePartner?.role === 'umkm' ? 'Mitra UMKM' : 'Mahasiswa'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-emerald-600 font-bold">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {isFullscreen ? (
                  <button type="button" onClick={() => setIsFullscreen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <span className="text-xs font-bold hidden md:inline">Kecilkan</span>
                    <span className="text-sm font-bold md:hidden">↓</span>
                  </button>
                ) : (
                  <button type="button" onClick={() => setIsFullscreen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <span className="text-xs font-bold hidden md:inline">Perbesar</span>
                    <span className="text-xs font-bold md:hidden">⤢</span>
                  </button>
                )}
                <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Banner Konteks Proyek & SISA WAKTU */}
            {activeProject && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/80 p-3 flex items-center justify-between gap-3 shadow-xs z-10 shrink-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded-md">
                      Konteks Proyek
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 truncate">
                      {activeProject.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mt-1">
                    <span className="font-bold text-emerald-700">
                      Rp {Number(activeProject.budget || 0).toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold capitalize text-slate-600">
                      Status: {activeApplicant?.status || activeProject.status}
                    </span>
                    {remainingInfo && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${remainingInfo.badgeClass}`}>
                          <Clock size={12} />
                          {remainingInfo.text}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Banner Konteks Pesanan Jasa (Jika ada) */}
            {activeOrder && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 p-3 flex items-center justify-between gap-3 shadow-xs z-10 shrink-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-md">
                    Pesanan Jasa Katalog
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate mt-1">
                    {activeOrder.serviceTitle}
                  </p>
                  <p className="text-xs text-emerald-700 font-bold">
                    Rp {Number(activeOrder.price || 0).toLocaleString('id-ID')} • Status: {activeOrder.status}
                  </p>
                </div>
              </div>
            )}

            {/* Area Daftar Pesan */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Kartu Ringkasan Lamaran & Waktu (Selalu ditampilkan sebagai kartu pembuka) */}
              {activeProject && (
                <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Briefcase size={14} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">Detail Lamaran & Kesepakatan</h4>
                        <p className="text-[10px] text-slate-500">Informasi resmi proyek GigSkill</p>
                      </div>
                    </div>
                    {remainingInfo && (
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border ${remainingInfo.badgeClass}`}>
                        <Clock size={12} />
                        {remainingInfo.text}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Honor Mahasiswa</span>
                      <span className="font-extrabold text-emerald-700">Rp {Number(activeProject.budget || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Status Lamaran</span>
                      <span className="font-bold text-blue-700">{activeApplicant?.status || activeProject.status}</span>
                    </div>
                  </div>

                  {activeApplicant?.proposal && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Proposal Pelamar:</span>
                      <p className="italic">"{activeApplicant.proposal}"</p>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 text-center">
                    💡 Gunakan ruang chat ini untuk berdiskusi, mengirim link draft, atau menyepakati detail pekerjaan.
                  </p>
                </div>
              )}

              {/* Render Pesan-Pesan */}
              {activeMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-xs text-sm ${
                    msg.senderId === currentUser.id 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.senderName && msg.senderId !== currentUser.id && (
                      <p className="text-[10px] font-bold text-blue-600 mb-1">{msg.senderName}</p>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                    <p className={`text-[10px] mt-1.5 text-right font-medium ${
                      msg.senderId === currentUser.id ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {/* Saran Cepat jika belum ada pesan yang dikirim manual */}
              {activeMessages.length === 0 && (
                <div className="pt-2 text-center space-y-2">
                  <p className="text-xs text-slate-400 font-medium">Kirim sapaan pembuka:</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {role === 'student' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSendMessage('Halo kak! Saya siap mengerjakan proyek ini. Apakah ada panduan atau brief tambahan?')}
                          className="text-xs bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                        >
                          "Halo kak! Saya siap mulai pengerjaan..."
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendMessage('Halo, saya ingin menanyakan batas waktu dan referensi desainnya.')}
                          className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-xl transition-colors"
                        >
                          "Tanya batas waktu & referensi"
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSendMessage('Halo! Terima kasih sudah melamar. Kapan kira-kira pekerjaan ini bisa mulai dikerjakan?')}
                          className="text-xs bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-800 font-semibold px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                        >
                          "Halo! Kapan bisa mulai dikerjakan?"
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendMessage('Halo, silakan cek detail deskripsi proyek dan konfirmasi jika sudah jelas.')}
                          className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-xl transition-colors"
                        >
                          "Konfirmasi pemahaman brief"
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input Pengiriman Pesan */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }} 
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Ketik pesan untuk mitra..." 
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!messageText.trim()}
                  className="bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-xs shrink-0 flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <MessageCircle size={28} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-600">Pilih percakapan di sebelah kiri</p>
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Klik salah satu proyek atau pelamar untuk melihat ruang obrolan, batas waktu pengerjaan, dan riwayat pesan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
