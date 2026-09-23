import React from 'react';
import {
  LogOut,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  User,
  Upload,
  Link,
  FileText,
  AlertTriangle,
  ExternalLink,
  Eye,
  Check,
  X,
  CreditCard,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  Camera,
  Key
} from 'lucide-react';
import NotificationBell from '../common/NotificationBell.jsx';

export default function AdminDashboard({
  currentUser,
  onLogout,
  showToast,
  users,
  setUsers,
  setCurrentUser,
  projects,
  setProjects,
  transactions,
  setTransactions,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  sendNotification
}) {
  const [activeTab, setActiveTab] = React.useState('verifikasi');
  const [keuanganSubTab, setKeuanganSubTab] = React.useState('pending'); // 'pending' | 'history'

  // Modal State for Approving WD with proof
  const [approvingTx, setApprovingTx] = React.useState(null);
  const [proofMode, setProofMode] = React.useState('upload'); // 'upload' | 'link'
  const [proofLink, setProofLink] = React.useState('');
  const [proofFileUrl, setProofFileUrl] = React.useState('');
  const [proofFileName, setProofFileName] = React.useState('');
  const [proofRef, setProofRef] = React.useState('');
  const [adminNote, setAdminNote] = React.useState('');

  // Modal State for Rejecting WD
  const [rejectingTx, setRejectingTx] = React.useState(null);
  const [rejectReason, setRejectReason] = React.useState('');
  const [selectedPresetReason, setSelectedPresetReason] = React.useState('');

  // Modal State for Rejecting User Verification (Mahasiswa / UMKM)
  const [rejectingUser, setRejectingUser] = React.useState(null);
  const [rejectUserReason, setRejectUserReason] = React.useState('');
  const [selectedPresetUserReason, setSelectedPresetUserReason] = React.useState('');

  // Modal State for Viewing Proof
  const [viewingProofTx, setViewingProofTx] = React.useState(null);

  // Modal State for Viewing User Verification Document (Photo or Cloud Link)
  const [previewDocModal, setPreviewDocModal] = React.useState(null);
  const [verifikasiFilter, setVerifikasiFilter] = React.useState('pending'); // 'pending' | 'all'
  const [verifikasiStatusFilter, setVerifikasiStatusFilter] = React.useState('all'); // 'all' | 'pending' | 'verified' | 'rejected' | 'no_doc'

  // Perlu Peninjauan: hanya pengguna yang BELUM diverifikasi, SUDAH unggah berkas, dan BELUM berstatus ditolak
  const pendingStudents = users.filter(u => u.role === 'student' && !u.verified && (u.verificationDoc || u.ktmUrl) && u.verificationStatus !== 'Rejected');
  const pendingUMKMs = users.filter(u => u.role === 'umkm' && !u.verified && u.verificationDoc && u.verificationStatus !== 'Rejected');
  const allStudents = users.filter(u => u.role === 'student');
  const allUMKMs = users.filter(u => u.role === 'umkm');
  const pendingTransactions = transactions.filter(t => t.status === 'Menunggu');
  const finishedTransactions = transactions.filter(t => t.status !== 'Menunggu');
  const bandingProjects = projects.filter(p => p.status === 'Banding Berlangsung');

  const getFilteredUsers = (role) => {
    const baseList = role === 'student' ? allStudents : allUMKMs;
    if (verifikasiFilter === 'pending') {
      return baseList.filter(u => !u.verified && (u.verificationDoc || (role === 'student' && u.ktmUrl)) && u.verificationStatus !== 'Rejected');
    }
    if (verifikasiStatusFilter === 'pending') {
      return baseList.filter(u => !u.verified && (u.verificationDoc || (role === 'student' && u.ktmUrl)) && u.verificationStatus !== 'Rejected');
    }
    if (verifikasiStatusFilter === 'verified') {
      return baseList.filter(u => u.verified);
    }
    if (verifikasiStatusFilter === 'rejected') {
      return baseList.filter(u => !u.verified && u.verificationStatus === 'Rejected');
    }
    if (verifikasiStatusFilter === 'no_doc') {
      return baseList.filter(u => !u.verified && !u.verificationDoc && !(role === 'student' && u.ktmUrl) && u.verificationStatus !== 'Rejected');
    }
    return baseList;
  };

  const presetUMKMReasons = [
    'Foto dokumen legalitas (NIB/SIUP/SKU) buram atau tidak terbaca dengan jelas.',
    'Tautan Google Drive memerlukan izin akses (harus diset "Anyone with link can view").',
    'Nama usaha pada dokumen tidak cocok dengan profil akun UMKM.',
    'Foto lokasi fisik / toko usaha belum dilampirkan atau tidak valid.',
    'Masa berlaku dokumen legalitas telah kadaluarsa.'
  ];

  const presetStudentReasons = [
    'Foto KTM buram atau nama / NIM tidak terbaca jelas.',
    'Tautan Google Drive berkas tidak dapat dibuka / memerlukan izin akses.',
    'KTM sudah tidak aktif atau masa berlaku habis.'
  ];

  const generateDemoReceipt = (recipientName, accountDetails, amount, refNo) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#f8fafc" rx="20"/>
      <rect x="20" y="20" width="560" height="360" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="16"/>
      <circle cx="300" cy="70" r="28" fill="#dcfce7"/>
      <path d="M290 70 l8 8 l16 -16" stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="300" y="125" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">TRANSFER PENARIKAN BERHASIL</text>
      <text x="300" y="150" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">PT GIGSKILL INDONESIA KREATIF - ESCROW SYSTEM</text>
      <line x1="60" y1="175" x2="540" y2="175" stroke="#e2e8f0" stroke-dasharray="6,6"/>
      <text x="60" y="210" font-family="sans-serif" font-size="13" fill="#64748b">Nominal Transfer:</text>
      <text x="540" y="210" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a" text-anchor="end">Rp ${Number(amount).toLocaleString('id-ID')}</text>
      <text x="60" y="245" font-family="sans-serif" font-size="13" fill="#64748b">Penerima Transfer:</text>
      <text x="540" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="end">${recipientName}</text>
      <text x="60" y="280" font-family="sans-serif" font-size="13" fill="#64748b">Rekening Tujuan:</text>
      <text x="540" y="280" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155" text-anchor="end">${accountDetails}</text>
      <text x="60" y="315" font-family="sans-serif" font-size="13" fill="#64748b">No. Referensi Transfer:</text>
      <text x="540" y="315" font-family="sans-serif" font-size="13" font-mono="true" font-weight="bold" fill="#2563eb" text-anchor="end">${refNo}</text>
      <rect x="60" y="340" width="480" height="25" fill="#f1f5f9" rx="6"/>
      <text x="300" y="357" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="middle">Transfer resmi diverifikasi oleh Admin Keuangan GigSkill</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const handleVerifyUser = (userId, isApproved, rejectReasonText = '') => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { 
          ...u, 
          verified: isApproved, 
          verificationStatus: isApproved ? 'Approved' : 'Rejected',
          verificationRejectReason: !isApproved ? (rejectReasonText || 'Dokumen belum memenuhi persyaratan verifikasi.') : undefined,
          verifiedAt: isApproved ? new Date().toLocaleDateString('id-ID') : undefined
        };
      }
      return u;
    }));
    if (setCurrentUser) {
      setCurrentUser(curr => {
        if (curr && curr.id === userId) {
          return {
            ...curr,
            verified: isApproved,
            verificationStatus: isApproved ? 'Approved' : 'Rejected',
            verificationRejectReason: !isApproved ? (rejectReasonText || 'Dokumen belum memenuhi persyaratan verifikasi.') : undefined,
            verifiedAt: isApproved ? new Date().toLocaleDateString('id-ID') : undefined
          };
        }
        return curr;
      });
    }
    // Sinkronisasi status terverifikasi pada project yang dibuat oleh UMKM
    if (setProjects) {
      setProjects(prev => prev.map(p => {
        if (p.umkmId === userId) {
          return { ...p, verified: isApproved };
        }
        return p;
      }));
    }

    if (sendNotification && targetUser) {
      if (isApproved) {
        sendNotification({
          userId,
          role: targetUser.role,
          type: 'verification_approved',
          title: 'Verifikasi Akun Disetujui! ✅',
          message: `Selamat! Berkas ${targetUser.role === 'student' ? 'KTM Mahasiswa' : 'Legalitas Usaha UMKM'} Anda telah diverifikasi resmi oleh Admin GigSkill. Lencana terverifikasi kini aktif.`,
          actionType: 'open_profile'
        });
      } else {
        sendNotification({
          userId,
          role: targetUser.role,
          type: 'verification_rejected',
          title: 'Verifikasi Akun Ditolak ⚠️',
          message: `Pengajuan verifikasi dokumen Anda ditolak. Catatan Admin: "${rejectReasonText || 'Dokumen belum memenuhi persyaratan verifikasi.'}". Silakan perbaiki dan ajukan ulang berkas Anda.`,
          actionType: 'open_profile'
        });
      }
    }

    showToast(isApproved ? 'Verifikasi akun disetujui & lencana resmi diberikan.' : 'Pengajuan verifikasi ditolak dengan catatan.');
  };

  // Open approve modal for WD or direct approve for topup
  const handleInitiateApprove = (tx) => {
    if (tx.type === 'withdraw') {
      const generatedRef = 'TRX-WD-' + Date.now().toString().slice(-6);
      setApprovingTx(tx);
      setProofMode('upload');
      setProofLink('');
      setProofFileUrl('');
      setProofFileName('');
      setProofRef(generatedRef);
      setAdminNote(`Dana sebesar Rp ${Number(tx.amount).toLocaleString('id-ID')} telah berhasil ditransfer ke ${tx.accountDetails}.`);
    } else {
      // For Top Up, direct approve
      setTransactions(prev => prev.map(t => {
        if (t.id === tx.id) return { ...t, status: 'Disetujui', approvedAt: new Date().toLocaleDateString('id-ID') };
        return t;
      }));
      setUsers(prev => prev.map(u => {
        if (u.id === tx.userId) {
          return { ...u, balance: (u.balance || 0) + Number(tx.amount) };
        }
        return u;
      }));
      if (setCurrentUser) {
        setCurrentUser(curr => {
          if (curr && curr.id === tx.userId) {
            return { ...curr, balance: (curr.balance || 0) + Number(tx.amount) };
          }
          return curr;
        });
      }

      if (sendNotification) {
        sendNotification({
          userId: tx.userId,
          role: tx.userRole,
          type: 'topup_success',
          title: 'Top Up Saldo Berhasil Masuk! 💳',
          message: `Saldo sebesar Rp ${Number(tx.amount).toLocaleString('id-ID')} telah disetujui Admin dan berhasil ditambahkan ke dompet Anda.`,
          actionType: 'open_wallet',
          contextId: tx.id
        });
      }

      showToast('Top Up disetujui & saldo berhasil ditambahkan ke akun.');
    }
  };

  // Submit approved WD with proof
  const handleConfirmApproveWD = (e) => {
    e.preventDefault();
    if (!approvingTx) return;

    let finalProofUrl = '';
    if (proofMode === 'upload') {
      finalProofUrl = proofFileUrl || generateDemoReceipt(approvingTx.userName, approvingTx.accountDetails, approvingTx.amount, proofRef);
    } else {
      let trimmed = proofLink.trim();
      if (trimmed && !/^https?:\/\//i.test(trimmed)) {
        trimmed = 'https://' + trimmed;
      }
      finalProofUrl = trimmed || generateDemoReceipt(approvingTx.userName, approvingTx.accountDetails, approvingTx.amount, proofRef);
    }

    const updatedTx = {
      ...approvingTx,
      status: 'Disetujui',
      approvedAt: new Date().toLocaleDateString('id-ID'),
      proofType: proofMode,
      proofUrl: finalProofUrl,
      proofRef: proofRef || ('REF-WD-' + Date.now().toString().slice(-6)),
      adminNote: adminNote.trim() || 'Transfer berhasil diproses oleh Admin.'
    };

    setTransactions(prev => prev.map(t => t.id === approvingTx.id ? updatedTx : t));

    // Deduct user's balance only if it wasn't already deducted upon request
    if (!approvingTx.deductedAtRequest) {
      setUsers(prev => prev.map(u => {
        if (u.id === approvingTx.userId) {
          return { ...u, balance: Math.max(0, (u.balance || 0) - Number(approvingTx.amount)) };
        }
        return u;
      }));

      if (setCurrentUser) {
        setCurrentUser(curr => {
          if (curr && curr.id === approvingTx.userId) {
            return { ...curr, balance: Math.max(0, (curr.balance || 0) - Number(approvingTx.amount)) };
          }
          return curr;
        });
      }
    }

    if (sendNotification) {
      sendNotification({
        userId: approvingTx.userId,
        role: approvingTx.userRole,
        type: 'withdraw_approved',
        title: 'Penarikan Dana Berhasil Ditransfer! 💸',
        message: `Penarikan dana Rp ${Number(approvingTx.amount).toLocaleString('id-ID')} ke rekening ${approvingTx.accountDetails} telah disetujui. Ref: ${updatedTx.proofRef}.`,
        actionType: 'open_wallet',
        contextId: updatedTx.id
      });
    }

    setApprovingTx(null);
    showToast('Penarikan dana disetujui & bukti transfer berhasil dikirim!', 'success');
  };

  // Open reject modal
  const handleInitiateReject = (tx) => {
    setRejectingTx(tx);
    if (tx.type === 'withdraw') {
      setSelectedPresetReason('Nomor rekening / e-wallet tidak valid atau tidak terdaftar');
      setRejectReason('Nomor rekening / e-wallet tidak valid atau tidak terdaftar.');
    } else {
      setSelectedPresetReason('Bukti transfer dana tidak masuk ke mutasi rekening admin');
      setRejectReason('Bukti transfer dana tidak masuk ke mutasi rekening admin.');
    }
  };

  // Submit rejected WD or Top Up
  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectingTx) return;

    const finalReason = rejectReason.trim() || (
      rejectingTx.type === 'withdraw'
        ? 'Nomor rekening tidak valid atau transaksi gagal.'
        : 'Bukti transfer belum dapat divalidasi oleh Admin.'
    );

    setTransactions(prev => prev.map(t => {
      if (t.id === rejectingTx.id) {
        return {
          ...t,
          status: 'Ditolak',
          rejectedAt: new Date().toLocaleDateString('id-ID'),
          rejectReason: finalReason,
          refunded: !!rejectingTx.deductedAtRequest
        };
      }
      return t;
    }));

    // KEMBALIKAN SALDO MAHASISWA JIKA WD DITOLAK
    if (rejectingTx.type === 'withdraw' && rejectingTx.deductedAtRequest) {
      setUsers(prev => prev.map(u => {
        if (u.id === rejectingTx.userId) {
          return { ...u, balance: (u.balance || 0) + Number(rejectingTx.amount) };
        }
        return u;
      }));

      if (setCurrentUser) {
        setCurrentUser(curr => {
          if (curr && curr.id === rejectingTx.userId) {
            return { ...curr, balance: (curr.balance || 0) + Number(rejectingTx.amount) };
          }
          return curr;
        });
      }
    }

    if (sendNotification) {
      if (rejectingTx.type === 'withdraw') {
        sendNotification({
          userId: rejectingTx.userId,
          role: rejectingTx.userRole,
          type: 'withdraw_rejected',
          title: 'Penarikan Dana Ditolak ❌',
          message: `Pengajuan penarikan dana Rp ${Number(rejectingTx.amount).toLocaleString('id-ID')} ditolak. Alasan: "${finalReason}". Saldo telah dikembalikan ke dompet Anda.`,
          actionType: 'open_wallet',
          contextId: rejectingTx.id
        });
      } else {
        sendNotification({
          userId: rejectingTx.userId,
          role: rejectingTx.userRole,
          type: 'topup_rejected',
          title: 'Top Up Saldo Ditolak ❌',
          message: `Pengajuan top up saldo Rp ${Number(rejectingTx.amount).toLocaleString('id-ID')} ditolak Admin. Alasan: "${finalReason}". Silakan periksa kembali bukti transfer Anda.`,
          actionType: 'open_wallet',
          contextId: rejectingTx.id
        });
      }
    }

    const wasWithdraw = rejectingTx.type === 'withdraw';
    const amountVal = rejectingTx.amount;
    const roleName = rejectingTx.userRole === 'student' ? 'Mahasiswa' : 'UMKM';
    setRejectingTx(null);

    if (wasWithdraw) {
      showToast(`WD ditolak. Dana Rp ${Number(amountVal).toLocaleString('id-ID')} telah otomatis dikembalikan ke saldo pemohon (${roleName}).`, 'info');
    } else {
      showToast(`Top Up ditolak. Keterangan alasan penolakan telah dikirimkan ke pengguna (${roleName}).`, 'info');
    }
  };

  // Handle file select for proof
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setProofFileUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle set demo receipt
  const handleUseDemoReceipt = () => {
    if (!approvingTx) return;
    const demoUrl = generateDemoReceipt(approvingTx.userName, approvingTx.accountDetails, approvingTx.amount, proofRef);
    setProofFileUrl(demoUrl);
    setProofFileName('struk_transfer_demo_bca.svg');
    showToast('Struk transfer demo berhasil dimuat!');
  };

  const handleMediation = (projectId, winner) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        let paymentStatus = p.paymentStatus;
        if (winner === 'student' && p.paymentStatus !== 'Sudah Dibayar') {
          setUsers(usersList => usersList.map(u => {
            if (p.applicants.some(a => a.status === 'Diterima' && a.studentId === u.id)) {
              return { ...u, balance: (u.balance || 0) + Number(p.budget) };
            }
            if (u.id === p.umkmId) {
              return { ...u, balance: (u.balance || 0) - Number(p.budget) };
            }
            return u;
          }));
          paymentStatus = 'Sudah Dibayar';
        }
        return { 
          ...p, 
          status: winner === 'student' ? 'Selesai' : 'Sengketa Selesai',
          paymentStatus,
          banding: {
            ...p.banding,
            status: winner === 'student' ? 'Dimenangkan Mahasiswa' : 'Dimenangkan UMKM'
          }
        };
      }
      return p;
    }));
    showToast(`Mediasi selesai. ${winner === 'student' ? 'Mahasiswa' : 'UMKM'} memenangkan banding.`);
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-10 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-blue-600" />
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Admin GigSkill Dashboard</h2>
              <p className="text-xs text-slate-500 font-medium">Pusat Verifikasi, Transaksi Keuangan & Mediasi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <NotificationBell
              currentUser={currentUser || { id: 'u3', role: 'admin', name: 'Admin GigSkill' }}
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              onMarkAllAsRead={onMarkAllAsRead}
              onDeleteNotification={onDeleteNotification}
              onClearAll={onClearAll}
              onAction={(notif) => {
                if (notif.actionType === 'open_admin_verifikasi') {
                  setActiveTab('verifikasi');
                } else if (notif.actionType === 'open_admin_finance') {
                  setActiveTab('keuangan');
                } else if (notif.actionType === 'open_admin_moderasi') {
                  setActiveTab('moderasi');
                }
              }}
            />
            <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              <span className="hidden md:inline">Keluar Akun</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {[
            { key: 'verifikasi', label: 'Verifikasi Akun', count: pendingStudents.length + pendingUMKMs.length },
            { key: 'keuangan', label: 'Transaksi Keuangan', count: pendingTransactions.length },
            { key: 'moderasi', label: 'Mediasi / Banding', count: bandingProjects.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.key ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-red-100 text-red-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'verifikasi' && (
          <div className="space-y-6">
            {/* Filter Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Pusat Verifikasi Identitas & Legalitas</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tinjau berkas foto KTM mahasiswa dan dokumen legalitas UMKM (NIB/SIUP/Link Drive) yang diajukan.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setVerifikasiFilter('pending');
                    setVerifikasiStatusFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    verifikasiFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Perlu Peninjauan</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${verifikasiFilter === 'pending' ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-slate-200 text-slate-600'}`}>
                    {pendingStudents.length + pendingUMKMs.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setVerifikasiFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    verifikasiFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Semua Pengguna</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-600">
                    {allStudents.length + allUMKMs.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Sub-filter status saat melihat Semua Pengguna */}
            {verifikasiFilter === 'all' && (
              <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>
                {[
                  { id: 'all', label: 'Semua Status' },
                  { id: 'pending', label: 'Perlu Peninjauan' },
                  { id: 'verified', label: 'Terverifikasi' },
                  { id: 'rejected', label: 'Ditolak' },
                  { id: 'no_doc', label: 'Belum Ada Berkas' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setVerifikasiStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      verifikasiStatusFilter === f.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Kolom Verifikasi Mahasiswa */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="text-blue-600" size={20} />
                    <h3 className="text-lg font-extrabold text-slate-900">Mahasiswa (KTM)</h3>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                    {getFilteredUsers('student').length} Pengguna
                  </span>
                </div>

                {getFilteredUsers('student').length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ShieldCheck className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-sm font-bold text-slate-600">Tidak ada pengajuan verifikasi mahasiswa.</p>
                    <p className="text-xs text-slate-400 mt-1">Semua mahasiswa telah diproses atau belum mengajukan berkas.</p>
                  </div>
                ) : (
                  getFilteredUsers('student').map(u => (
                    <div key={u.id} className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl mb-4 hover:border-slate-300 transition-colors shadow-xs">
                      {/* Header User */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">{u.name}</span>
                              {u.isDummy && (
                                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">Demo</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              {u.univ} • Sem. {u.semester || '5'} {u.major ? `(${u.major})` : ''}
                            </p>
                          </div>
                        </div>
                        {u.verified ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                            <CheckCircle2 size={12} /> Terverifikasi
                          </span>
                        ) : u.verificationStatus === 'Rejected' ? (
                          <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                            <XCircle size={12} /> Ditolak
                          </span>
                        ) : u.verificationDoc || u.ktmUrl ? (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                            <Clock size={12} /> Menunggu Verifikasi
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full shrink-0">
                            Belum Ada Dokumen
                          </span>
                        )}
                      </div>

                      {/* Catatan Penolakan jika ada */}
                      {u.verificationStatus === 'Rejected' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
                          <p className="font-bold flex items-center gap-1 text-red-950">
                            <AlertTriangle size={13} className="text-red-600" /> Catatan Penolakan Admin:
                          </p>
                          <p className="text-red-700">{u.verificationRejectReason || 'Dokumen belum memenuhi persyaratan verifikasi.'}</p>
                        </div>
                      )}

                      {/* Detail Berkas Verifikasi */}
                      <div className="mt-3.5 pt-3 border-t border-slate-200/80">
                        {u.verificationDoc ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                {u.verificationDoc.type === 'photo' ? (
                                  <>
                                    <Camera size={13} className="text-blue-600" /> Foto KTM / Berkas
                                  </>
                                ) : (
                                  <>
                                    <Link size={13} className="text-blue-600" /> Tautan Berkas Cloud
                                  </>
                                )}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {u.verificationDoc.submittedAt ? `Diajukan: ${u.verificationDoc.submittedAt}` : 'Baru saja'}
                              </span>
                            </div>

                            {u.verificationDoc.notes && (
                              <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                                <span className="font-bold text-slate-500">Catatan / NIM:</span> {u.verificationDoc.notes}
                              </div>
                            )}

                            {u.verificationDoc.type === 'photo' ? (
                              <div>
                                <div 
                                  className="relative group rounded-xl overflow-hidden border border-slate-300 bg-slate-900/5 cursor-pointer"
                                  onClick={() => setPreviewDocModal({
                                    title: `KTM / Identitas - ${u.name}`,
                                    type: 'photo',
                                    value: u.verificationDoc.value,
                                    fileName: u.verificationDoc.fileName,
                                    notes: u.verificationDoc.notes,
                                    userName: u.name,
                                    userRole: 'Mahasiswa',
                                    userId: u.id,
                                    verified: u.verified,
                                    userObj: u
                                  })}
                                >
                                  <img 
                                    src={u.verificationDoc.value} 
                                    alt={`KTM ${u.name}`} 
                                    className="w-full h-32 object-cover transition-transform group-hover:scale-105 duration-200" 
                                  />
                                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <span className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-extrabold flex items-center gap-1 shadow-md">
                                      <Eye size={13} /> Perbesar Foto
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <button 
                                    type="button"
                                    onClick={() => setPreviewDocModal({
                                      title: `KTM / Identitas - ${u.name}`,
                                      type: 'photo',
                                      value: u.verificationDoc.value,
                                      fileName: u.verificationDoc.fileName,
                                      notes: u.verificationDoc.notes,
                                      userName: u.name,
                                      userRole: 'Mahasiswa',
                                      userId: u.id,
                                      verified: u.verified,
                                      userObj: u
                                    })}
                                    className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1"
                                  >
                                    <Eye size={12} /> Buka Foto Resolusi Penuh
                                  </button>
                                  <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                    {u.verificationDoc.fileName || 'KTM_Mahasiswa.jpg'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Link className="text-blue-600 shrink-0" size={15} />
                                  <span className="text-xs text-blue-900 font-medium truncate">{u.verificationDoc.value}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewDocModal({
                                      title: `Tautan KTM - ${u.name}`,
                                      type: 'link',
                                      value: u.verificationDoc.value,
                                      fileName: u.verificationDoc.fileName,
                                      notes: u.verificationDoc.notes,
                                      userName: u.name,
                                      userRole: 'Mahasiswa',
                                      userId: u.id,
                                      verified: u.verified,
                                      userObj: u
                                    })}
                                    className="px-2 py-1.5 bg-white border border-blue-200 hover:bg-blue-100/50 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                    title="Tinjau berkas"
                                  >
                                    <Eye size={12} /> Tinjau
                                  </button>
                                  <a 
                                    href={u.verificationDoc.value} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs transition-colors"
                                  >
                                    <ExternalLink size={12} /> Buka Tautan
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : u.ktmUrl ? (
                          <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                            <span>Berkas terlampir: <strong>{u.ktmUrl}</strong></span>
                            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-medium">Dokumen Awal</span>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Belum ada dokumen KTM yang diunggah oleh mahasiswa ini.</p>
                        )}
                      </div>

                      {/* Tombol Aksi Verifikasi */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200/80">
                        {u.verified ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 size={14} /> Terverifikasi Resmi
                            </span>
                            <button 
                              onClick={() => handleVerifyUser(u.id, false, 'Verifikasi dicabut oleh Admin.')} 
                              className="text-xs font-bold text-slate-400 hover:text-red-600 hover:underline transition-colors"
                            >
                              Cabut Verifikasi
                            </button>
                          </div>
                        ) : u.verificationStatus === 'Rejected' ? (
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                              <XCircle size={14} /> Status Ditolak
                            </span>
                            <button 
                              onClick={() => handleVerifyUser(u.id, true)} 
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <CheckCircle2 size={13} /> Tinjau Ulang & Setujui
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setRejectingUser(u);
                                setRejectUserReason('');
                                setSelectedPresetUserReason('');
                              }} 
                              className="flex-1 text-xs font-bold bg-white text-red-600 border border-red-200 py-2.5 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                            >
                              <X size={14} /> Tolak
                            </button>
                            <button 
                              onClick={() => handleVerifyUser(u.id, true)} 
                              className="flex-1 text-xs font-bold bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 size={14} /> Setujui Verifikasi
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Kolom Verifikasi UMKM */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-emerald-600" size={20} />
                    <h3 className="text-lg font-extrabold text-slate-900">Legalitas UMKM (NIB/SIUP)</h3>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
                    {getFilteredUsers('umkm').length} UMKM
                  </span>
                </div>

                {getFilteredUsers('umkm').length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ShieldCheck className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-sm font-bold text-slate-600">Tidak ada pengajuan verifikasi UMKM.</p>
                    <p className="text-xs text-slate-400 mt-1">Semua UMKM telah diproses atau belum mengajukan berkas.</p>
                  </div>
                ) : (
                  getFilteredUsers('umkm').map(u => (
                    <div key={u.id} className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl mb-4 hover:border-slate-300 transition-colors shadow-xs">
                      {/* Header UMKM */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">{u.name}</span>
                              {u.isDummy && (
                                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">Demo</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              {u.category} • {u.phone || u.email}
                            </p>
                          </div>
                        </div>
                        {u.verified ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                            <CheckCircle2 size={12} /> Terverifikasi
                          </span>
                        ) : u.verificationStatus === 'Rejected' ? (
                          <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                            <XCircle size={12} /> Ditolak
                          </span>
                        ) : u.verificationDoc ? (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                            <Clock size={12} /> Menunggu Verifikasi
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full shrink-0">
                            Belum Ada Dokumen
                          </span>
                        )}
                      </div>

                      {/* Catatan Penolakan jika ada */}
                      {u.verificationStatus === 'Rejected' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
                          <p className="font-bold flex items-center gap-1 text-red-950">
                            <AlertTriangle size={13} className="text-red-600" /> Catatan Penolakan Admin:
                          </p>
                          <p className="text-red-700">{u.verificationRejectReason || 'Dokumen belum memenuhi persyaratan verifikasi.'}</p>
                        </div>
                      )}

                      {/* Detail Berkas Verifikasi UMKM */}
                      <div className="mt-3.5 pt-3 border-t border-slate-200/80">
                        {u.verificationDoc ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                {u.verificationDoc.type === 'photo' ? (
                                  <>
                                    <Camera size={13} className="text-emerald-600" /> Foto NIB / Dokumen Tempat Usaha
                                  </>
                                ) : (
                                  <>
                                    <Link size={13} className="text-emerald-600" /> Tautan Legalitas Cloud (Drive)
                                  </>
                                )}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {u.verificationDoc.submittedAt ? `Diajukan: ${u.verificationDoc.submittedAt}` : 'Baru saja'}
                              </span>
                            </div>

                            {u.verificationDoc.notes && (
                              <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                                <span className="font-bold text-slate-500">Keterangan / NIB:</span> {u.verificationDoc.notes}
                              </div>
                            )}

                            {u.verificationDoc.type === 'photo' ? (
                              <div>
                                <div 
                                  className="relative group rounded-xl overflow-hidden border border-slate-300 bg-slate-900/5 cursor-pointer"
                                  onClick={() => setPreviewDocModal({
                                    title: `Dokumen Legalitas - ${u.name}`,
                                    type: 'photo',
                                    value: u.verificationDoc.value,
                                    fileName: u.verificationDoc.fileName,
                                    notes: u.verificationDoc.notes,
                                    userName: u.name,
                                    userRole: 'UMKM',
                                    userId: u.id,
                                    verified: u.verified,
                                    userObj: u
                                  })}
                                >
                                  <img 
                                    src={u.verificationDoc.value} 
                                    alt={`Legalitas ${u.name}`} 
                                    className="w-full h-32 object-cover transition-transform group-hover:scale-105 duration-200" 
                                  />
                                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <span className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-extrabold flex items-center gap-1 shadow-md">
                                      <Eye size={13} /> Perbesar Foto Berkas
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <button 
                                    type="button"
                                    onClick={() => setPreviewDocModal({
                                      title: `Dokumen Legalitas - ${u.name}`,
                                      type: 'photo',
                                      value: u.verificationDoc.value,
                                      fileName: u.verificationDoc.fileName,
                                      notes: u.verificationDoc.notes,
                                      userName: u.name,
                                      userRole: 'UMKM',
                                      userId: u.id,
                                      verified: u.verified,
                                      userObj: u
                                    })}
                                    className="text-[11px] text-emerald-600 hover:underline font-bold flex items-center gap-1"
                                  >
                                    <Eye size={12} /> Buka Foto Resolusi Penuh
                                  </button>
                                  <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                    {u.verificationDoc.fileName || 'NIB_Legalitas_Usaha.jpg'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Link className="text-emerald-600 shrink-0" size={15} />
                                  <span className="text-xs text-emerald-900 font-medium truncate">{u.verificationDoc.value}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewDocModal({
                                      title: `Dokumen Legalitas - ${u.name}`,
                                      type: 'link',
                                      value: u.verificationDoc.value,
                                      fileName: u.verificationDoc.fileName,
                                      notes: u.verificationDoc.notes,
                                      userName: u.name,
                                      userRole: 'UMKM',
                                      userId: u.id,
                                      verified: u.verified,
                                      userObj: u
                                    })}
                                    className="px-2 py-1.5 bg-white border border-emerald-200 hover:bg-emerald-100/50 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                    title="Tinjau berkas"
                                  >
                                    <Eye size={12} /> Tinjau
                                  </button>
                                  <a 
                                    href={u.verificationDoc.value} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs transition-colors"
                                  >
                                    <ExternalLink size={12} /> Buka Tautan
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Belum ada berkas NIB/SIUP yang diunggah oleh UMKM ini.</p>
                        )}
                      </div>

                      {/* Tombol Aksi Verifikasi */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200/80">
                        {u.verified ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 size={14} /> Terverifikasi Resmi
                            </span>
                            <button 
                              onClick={() => handleVerifyUser(u.id, false, 'Verifikasi dicabut oleh Admin.')} 
                              className="text-xs font-bold text-slate-400 hover:text-red-600 hover:underline transition-colors"
                            >
                              Cabut Verifikasi
                            </button>
                          </div>
                        ) : u.verificationStatus === 'Rejected' ? (
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                              <XCircle size={14} /> Status Ditolak
                            </span>
                            <button 
                              onClick={() => handleVerifyUser(u.id, true)} 
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <CheckCircle2 size={13} /> Tinjau Ulang & Setujui
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setRejectingUser(u);
                                setRejectUserReason('');
                                setSelectedPresetUserReason('');
                              }} 
                              className="flex-1 text-xs font-bold bg-white text-red-600 border border-red-200 py-2.5 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                            >
                              <X size={14} /> Tolak
                            </button>
                            <button 
                              onClick={() => handleVerifyUser(u.id, true)} 
                              className="flex-1 text-xs font-bold bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 size={14} /> Setujui Verifikasi
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keuangan' && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Manajemen Transaksi Keuangan</h3>
                  <p className="text-xs text-slate-500 mt-1">Verifikasi penarikan dana (WD) dan konfirmasi deposit / top up saldo untuk Mahasiswa maupun UMKM.</p>
                </div>
                
                {/* Sub Tab: Pending vs History */}
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setKeuanganSubTab('pending')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      keuanganSubTab === 'pending' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Perlu Konfirmasi</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${keuanganSubTab === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                      {pendingTransactions.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setKeuanganSubTab('history')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      keuanganSubTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Riwayat Transaksi</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-600">
                      {finishedTransactions.length}
                    </span>
                  </button>
                </div>
              </div>

              {keuanganSubTab === 'pending' && (
                <div>
                  {pendingTransactions.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <CheckCircle2 size={40} className="mx-auto text-green-500 mb-2" />
                      <p className="text-slate-700 font-bold">Semua Transaksi Bersih!</p>
                      <p className="text-xs text-slate-500 mt-1">Tidak ada permintaan top up atau penarikan dana yang tertunda.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTransactions.map(tx => (
                        <div key={tx.id} className="p-5 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-all">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-md flex items-center gap-1 ${
                                tx.type === 'withdraw' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {tx.type === 'withdraw' ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                                {tx.type === 'withdraw' ? 'Penarikan Dana (Withdraw)' : 'Top Up Saldo'}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">{tx.date}</span>
                            </div>
                            
                            <p className="font-extrabold text-slate-900 text-base">
                              {tx.userName} <span className="text-xs font-normal text-slate-500">({tx.userRole === 'student' ? 'Mahasiswa' : 'UMKM'})</span>
                            </p>

                            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
                              <CreditCard size={14} className="text-blue-600" />
                              <span className="font-bold">{tx.type === 'withdraw' ? 'Rekening Tujuan:' : 'Rekening Pengirim:'}</span>
                              <span>{tx.accountDetails}</span>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nominal</span>
                            <p className="font-extrabold text-blue-600 text-xl mb-3">
                              Rp {Number(tx.amount).toLocaleString('id-ID')}
                            </p>
                            <div className="flex gap-2 w-full md:w-auto">
                              <button
                                onClick={() => handleInitiateReject(tx)}
                                className="flex-1 md:flex-initial text-xs font-bold bg-white text-red-600 border border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                              >
                                <XCircle size={15} /> {tx.type === 'withdraw' ? 'Tolak WD' : 'Tolak Top Up'}
                              </button>
                              <button
                                onClick={() => handleInitiateApprove(tx)}
                                className="flex-1 md:flex-initial text-xs font-bold bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 size={15} />
                                {tx.type === 'withdraw' ? 'Setujui & Kirim Bukti' : 'Setujui Top Up'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {keuanganSubTab === 'history' && (
                <div>
                  {finishedTransactions.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      Belum ada riwayat transaksi yang disetujui atau ditolak.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {finishedTransactions.map(tx => (
                        <div key={tx.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                tx.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {tx.status}
                              </span>
                              <span className="text-xs font-bold text-slate-700">
                                {tx.type === 'withdraw'
                                  ? `Penarikan (${tx.userRole === 'student' ? 'Mahasiswa' : 'UMKM'})`
                                  : `Top Up (${tx.userRole === 'student' ? 'Mahasiswa' : 'UMKM'})`}
                              </span>
                              <span className="text-xs text-slate-400">• {tx.approvedAt || tx.rejectedAt || tx.date}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800">{tx.userName} - {tx.accountDetails}</p>
                            
                            {tx.status === 'Ditolak' && (
                              <p className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded border border-red-200/60 inline-block">
                                <span className="font-bold">Alasan Penolakan:</span> {tx.rejectReason || 'Rekening tidak valid.'}
                              </p>
                            )}

                            {tx.status === 'Disetujui' && tx.proofRef && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                Ref Bank: <span className="font-mono font-bold text-blue-600">{tx.proofRef}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 self-end md:self-auto">
                            <span className="font-extrabold text-slate-900 text-base">
                              Rp {Number(tx.amount).toLocaleString('id-ID')}
                            </span>
                            {tx.status === 'Disetujui' && tx.proofUrl && (
                              <button
                                onClick={() => setViewingProofTx(tx)}
                                className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                              >
                                <Eye size={13} /> Bukti Transfer
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'moderasi' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Mediasi Banding Sengketa</h3>
            {bandingProjects.length === 0 ? <p className="text-sm text-slate-500">Tidak ada kasus banding.</p> : bandingProjects.map(p => {
              const submittedAt = p.banding?.bandingSubmittedAt || 0;
              const deadline = submittedAt + (2 * 24 * 60 * 60 * 1000);
              const now = Date.now();
              const isExpired = now >= deadline;
              const remainingHours = Math.max(0, Math.floor((deadline - now) / (1000 * 60 * 60)));
              
              return (
              <div key={p.id} className="p-4 border border-purple-200 rounded-2xl mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-500">UMKM: {p.umkmName} | Mahasiswa: {p.applicants.find(a=>a.status === 'Diterima')?.studentName}</p>
                    <p className="text-xs font-bold mt-1 text-purple-700">Status: {isExpired ? 'Mediasi Admin Terbuka' : `Diskusi Banding (Sisa ${remainingHours} jam)`}</p>
                  </div>
                  <p className="font-bold text-green-700">Rp {Number(p.budget).toLocaleString('id-ID')}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-red-700 mb-1">Alasan Penolakan UMKM:</p>
                    <p className="text-sm text-red-600 italic">"{p.banding.reason}"</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-blue-700 mb-1">Tanggapan Mahasiswa:</p>
                    <p className="text-sm text-blue-600 italic">"{p.banding.studentResponse}"</p>
                  </div>
                </div>

                {/* Bukti Pekerjaan yang Dipermasalahkan */}
                {p.submission && (
                  <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                    <span className="font-bold text-slate-800 block">
                      {p.type === 'Offline' ? '📍 Bukti Pengerjaan Lapangan (Offline):' : '🌐 Bukti Hasil Kerja (Online):'}
                    </span>
                    {p.type === 'Offline' ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                            <Key size={12} className="text-emerald-600" />
                            PIN Mahasiswa: <span className="font-mono">{p.submission.pin}</span> (Kode UMKM: <span className="font-mono">{p.offlineVerificationCode || '-'}</span>)
                          </span>
                          {p.submission.workDuration && (
                            <span className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                              ⏱️ {p.submission.workDuration}
                            </span>
                          )}
                          {p.submission.picName && (
                            <span className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                              👤 PIC: {p.submission.picName}
                            </span>
                          )}
                        </div>
                        {p.submission.photos && p.submission.photos.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {p.submission.photos.map((url, idx) => (
                              <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 block hover:opacity-80">
                                <img src={url} alt={`Bukti ${idx+1}`} className="w-full h-full object-cover" />
                              </a>
                            ))}
                          </div>
                        )}
                        {p.submission.notes && (
                          <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200">
                            "{p.submission.notes}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <a href={p.submission.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline flex items-center gap-1">
                          <ExternalLink size={12} /> {p.submission.link}
                        </a>
                        {p.submission.notes && <p className="text-slate-600 italic mt-1">"{p.submission.notes}"</p>}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                   {!isExpired ? (
                     <p className="text-xs text-slate-500 italic">Admin dapat melakukan mediasi setelah 2 hari jika belum ada kesepakatan.</p>
                   ) : (
                     <>
                       <button onClick={() => handleMediation(p.id, 'umkm')} className="text-xs font-bold bg-white text-slate-600 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-100">Menangkan UMKM (Dana Kembali)</button>
                       <button onClick={() => handleMediation(p.id, 'student')} className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Menangkan Mahasiswa (Teruskan Pembayaran)</button>
                     </>
                   )}
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Modal Approve WD with Proof Form */}
      {approvingTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setApprovingTx(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-xs font-extrabold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  Konfirmasi Persetujuan WD
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">Kirim Bukti Transfer Penarikan</h3>
              </div>
              <button onClick={() => setApprovingTx(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>

            {/* Target Info Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-5 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Pemohon ({approvingTx.userRole === 'student' ? 'Mahasiswa' : 'UMKM'}):</span>
                <span className="font-bold text-slate-900">{approvingTx.userName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Rekening Tujuan:</span>
                <span className="font-bold text-blue-700">{approvingTx.accountDetails}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                <span className="text-slate-500">Nominal Penarikan:</span>
                <span className="font-extrabold text-green-600 text-lg">
                  Rp {Number(approvingTx.amount).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmApproveWD} className="space-y-4">
              {/* Proof Mode Switch */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Metode Pengiriman Bukti Transfer:</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setProofMode('upload')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      proofMode === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload size={14} /> Upload / Dummy Struk
                  </button>
                  <button
                    type="button"
                    onClick={() => setProofMode('link')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      proofMode === 'link' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link size={14} /> Link Tautan Bukti
                  </button>
                </div>
              </div>

              {proofMode === 'upload' ? (
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-blue-500 transition-colors bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="proof-upload-input"
                      className="hidden"
                    />
                    <label htmlFor="proof-upload-input" className="cursor-pointer block">
                      <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-blue-600 hover:underline">
                        {proofFileName ? `File Terpilih: ${proofFileName}` : 'Klik untuk unggah foto struk / tangkapan layar transfer'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Format: JPG, PNG, atau WebP</p>
                    </label>
                  </div>

                  {/* Button to instant generate dummy receipt */}
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Sparkles size={16} className="text-blue-600 shrink-0" />
                      <span>Tanpa file struk? Gunakan template struk demo otomatis.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleUseDemoReceipt}
                      className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 shrink-0 shadow-sm"
                    >
                      Gunakan Demo
                    </button>
                  </div>

                  {proofFileUrl && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <p className="text-[11px] font-bold text-slate-500 mb-1">Pratinjau Bukti Transfer:</p>
                      <img
                        src={proofFileUrl}
                        alt="Bukti Transfer"
                        className="w-full max-h-36 object-contain rounded-lg border border-slate-100 bg-slate-50"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL / Link Bukti Transfer Bank:</label>
                  <div className="relative">
                    <Link size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required={proofMode === 'link'}
                      value={proofLink}
                      onChange={e => setProofLink(e.target.value)}
                      placeholder="https://drive.google.com/... atau https://i.ibb.co/..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Masukkan tautan penyimpanan awan atau receipt perbankan.</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. Referensi Transfer:</label>
                  <input
                    type="text"
                    required
                    value={proofRef}
                    onChange={e => setProofRef(e.target.value)}
                    placeholder="TRX-BCA-98214"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Verifikasi:</label>
                  <input
                    type="text"
                    readOnly
                    value={new Date().toLocaleDateString('id-ID')}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Admin untuk Pemohon ({approvingTx.userRole === 'student' ? 'Mahasiswa' : 'UMKM'}):
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Catatan tambahan untuk pemohon transfer..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovingTx(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Kirim Bukti & Setujui WD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reject WD with Reason */}
      {rejectingTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setRejectingTx(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-xs font-extrabold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  Penolakan Transaksi
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {rejectingTx.type === 'withdraw' ? 'Tolak Permintaan Penarikan Dana' : 'Tolak Permintaan Top Up Saldo'}
                </h3>
              </div>
              <button onClick={() => setRejectingTx(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>

            <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 mb-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Pemohon:</span>
                <span className="font-bold text-slate-900">{rejectingTx.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{rejectingTx.type === 'withdraw' ? 'Rekening Tujuan:' : 'Rekening Pengirim:'}</span>
                <span className={`font-bold ${rejectingTx.type === 'withdraw' ? 'text-red-700' : 'text-slate-800'}`}>{rejectingTx.accountDetails}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nominal:</span>
                <span className="font-extrabold text-slate-900">Rp {Number(rejectingTx.amount).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Alasan Cepat:</label>
                <div className="space-y-2">
                  {(rejectingTx.type === 'withdraw' ? [
                    'Nomor rekening / e-wallet tidak valid atau tidak terdaftar',
                    'Nama pemilik rekening berbeda dengan profil pemohon',
                    'Transaksi gagal diproses oleh sistem perbankan',
                    'Nomor rekening tidak aktif atau ditutup pihak bank',
                    'Lainnya (Tulis alasan sendiri)'
                  ] : [
                    'Bukti transfer dana tidak masuk ke mutasi rekening admin',
                    'Nominal transfer pada rekening admin tidak sesuai',
                    'Nomor rekening atau nama pengirim tidak valid / mutasi nihil',
                    'Transfer belum diterima atau transaksi perbankan dibatalkan',
                    'Lainnya (Tulis alasan sendiri)'
                  ]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setSelectedPresetReason(preset);
                        if (preset.startsWith('Lainnya')) {
                          setRejectReason('');
                        } else {
                          setRejectReason(preset + '.');
                        }
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedPresetReason === preset
                          ? 'bg-red-50 border-red-300 text-red-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Lengkap Alasan Penolakan <span className="text-red-500">*</span>:
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder={
                    rejectingTx.type === 'withdraw'
                      ? 'Contoh: Nomor rekening BCA 8271... tidak ditemukan di sistem perbankan. Silakan periksa kembali.'
                      : 'Contoh: Bukti dana transfer belum terdeteksi masuk pada mutasi rekening bank admin GigSkill hari ini.'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                ></textarea>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                {rejectingTx.type === 'withdraw' ? (
                  <>
                    <span className="font-bold">Catatan Saldo:</span> Saldo pemohon ({rejectingTx.userRole === 'student' ? 'Mahasiswa' : 'UMKM'}) telah dikembalikan ke dompet aktif. Pemohon akan mendapatkan notifikasi keterangan alasan penolakan ini agar dapat mengajukan kembali dengan nomor rekening yang valid.
                  </>
                ) : (
                  <>
                    <span className="font-bold">Catatan Top Up:</span> Pengajuan top up saldo akan ditolak dan saldo tidak akan bertambah. Pengguna akan menerima notifikasi alasan penolakan ini dan dapat mengajukan ulang setelah melakukan transfer yang valid.
                  </>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingTx(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5"
                >
                  <XCircle size={16} /> {rejectingTx.type === 'withdraw' ? 'Konfirmasi Tolak WD' : 'Konfirmasi Tolak Top Up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Transfer Proof */}
      {viewingProofTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4" onClick={() => setViewingProofTx(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  Transfer Berhasil
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">Bukti Transfer Penarikan Dana</h3>
              </div>
              <button onClick={() => setViewingProofTx(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Penerima:</span>
                  <span className="font-bold text-slate-900">{viewingProofTx.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rekening Tujuan:</span>
                  <span className="font-bold text-slate-900">{viewingProofTx.accountDetails}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal:</span>
                  <span className="font-extrabold text-green-600">Rp {Number(viewingProofTx.amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Referensi:</span>
                  <span className="font-mono font-bold text-blue-600">{viewingProofTx.proofRef || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Disetujui:</span>
                  <span className="text-slate-700">{viewingProofTx.approvedAt || viewingProofTx.date}</span>
                </div>
              </div>

              {viewingProofTx.adminNote && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800">
                  <span className="font-bold">Catatan Admin:</span> {viewingProofTx.adminNote}
                </div>
              )}

              {viewingProofTx.proofUrl && (
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Lampiran Bukti Transfer:</p>
                  {viewingProofTx.proofUrl.startsWith('data:image') || viewingProofTx.proofUrl.match(/\.(jpeg|jpg|gif|png|svg|webp)/i) ? (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2">
                      <img
                        src={viewingProofTx.proofUrl}
                        alt="Struk Transfer"
                        className="w-full max-h-60 object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    <a
                      href={viewingProofTx.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-blue-600 font-bold text-xs flex items-center justify-between hover:bg-blue-50 transition-colors"
                    >
                      <span className="truncate mr-2">{viewingProofTx.proofUrl}</span>
                      <ExternalLink size={15} className="shrink-0" />
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={() => setViewingProofTx(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pratinjau Dokumen Verifikasi Pengguna (Foto / Link) */}
      {previewDocModal && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[160] flex items-center justify-center p-4 overflow-y-auto" 
          onClick={() => setPreviewDocModal(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-6" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    previewDocModal.userRole === 'Mahasiswa' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {previewDocModal.userRole}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Verifikasi Berkas Resmi</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{previewDocModal.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Diajukan oleh: <strong>{previewDocModal.userName}</strong></p>
              </div>
              <button 
                onClick={() => setPreviewDocModal(null)} 
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {previewDocModal.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-600">Catatan / Identitas Dokumen:</span>
                  <p className="mt-0.5 font-medium">{previewDocModal.notes}</p>
                </div>
              )}

              {previewDocModal.type === 'photo' ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 p-2 flex flex-col items-center">
                  <img 
                    src={previewDocModal.value} 
                    alt={previewDocModal.title} 
                    className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-xs" 
                  />
                  {previewDocModal.fileName && (
                    <div className="mt-2 text-center text-xs text-slate-500 font-medium">
                      Nama berkas: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[11px]">{previewDocModal.fileName}</code>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-slate-700">Tautan Dokumen Berkas Cloud (Google Drive):</p>
                  <a 
                    href={previewDocModal.value} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 bg-white border border-blue-200 rounded-xl text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center justify-between hover:bg-blue-50/50 transition-colors break-all"
                  >
                    <span>{previewDocModal.value}</span>
                    <ExternalLink size={16} className="shrink-0 ml-2 text-blue-600" />
                  </a>
                  <p className="text-[11px] text-slate-500">
                    Klik tautan di atas untuk memeriksa berkas pendukung pada tab baru browser Anda.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {!previewDocModal.verified ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const targetUser = previewDocModal.userObj || users.find(u => u.id === previewDocModal.userId);
                        setPreviewDocModal(null);
                        if (targetUser) {
                          setRejectingUser(targetUser);
                          setRejectUserReason('');
                          setSelectedPresetUserReason('');
                        }
                      }}
                      className="flex-1 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X size={15} /> Tolak Dokumen Ini
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleVerifyUser(previewDocModal.userId, true);
                        setPreviewDocModal(null);
                      }}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 size={15} /> Setujui & Beri Lencana Verifikasi
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPreviewDocModal(null)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Tutup Pratinjau
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}