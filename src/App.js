import React, { useState } from 'react';
import {
  Menu,
  Send,
  X,
  Search,
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle2,
  User,
  FileText,
  DollarSign,
  MessageCircle,
  Mail,
  Lock,
  Phone,
  Building,
  Store,
  LogOut,
  Plus,
  ChevronDown,
  XCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Star
} from 'lucide-react';

const initialUsers = [
  {
    id: 'u1',
    role: 'student',
    name: 'Joko Subianto',
    email: 'jokosubianto@student.com',
    password: '123',
    univ: 'Universitas Pamulang',
    semester: 5,
    bio: 'Mahasiswa desain grafis yang suka tantangan.',
    skills: ['Graphic Design', 'Figma', 'Adobe Illustrator'],
    rating: 4.8,
    portfolios: [{ title: 'Desain Logo Startup', link: '#' }, { title: 'Redesign UI/UX Web', link: '#' }],
    balance: 300000,
    verified: true,
    ktmUrl: 'mock-ktm.jpg'
  },
  {
    id: 'u2',
    role: 'umkm',
    name: 'Toko Kue Ibu Tin',
    email: 'toko@ibu.com',
    password: '123',
    phone: '08123456789',
    category: 'Kuliner',
    desc: 'Toko kue rumahan yang memproduksi kue kering dan basah.',
    rating: 4.9,
    projectCount: 5,
    balance: 5000000,
    verified: true
  },
  {
    id: 'u3',
    role: 'admin',
    name: 'Super Admin',
    email: 'admin@gigskill.com',
    password: '123'
  }
];

const initialProjects = [
  {
    id: 'p1',
    umkmId: 'u2',
    umkmName: 'Toko Kue Ibu Tin',
    title: 'Desain Logo & Banner Toko Kue',
    budget: '150000',
    deadline: '3 Hari',
    category: 'Desain',
    status: 'open',
    desc: 'Kami membutuhkan desain logo baru yang minimalis dan banner untuk ditaruh di depan toko fisik kami.',
    tags: ['Graphic Design', 'Illustrator'],
    verified: true,
    applicants: []
  },
  {
    id: 'p2',
    umkmId: 'u2',
    umkmName: 'Toko Kue Ibu Tin',
    title: 'Admin Instagram untuk 1 Minggu',
    budget: '250000',
    deadline: '7 Hari',
    category: 'Pemasaran',
    status: 'open',
    desc: 'Tugas meliputi upload feed 1x sehari, membalas DM/Komen, dan buat 3 reels sederhana.',
    tags: ['Social Media', 'Copywriting'],
    verified: true,
    applicants: []
  }
];

const initialMessages = [
  { id: 'm_1', chatId: 'chat_u1_u2_p1', senderId: 'u1', text: 'Halo kak, saya tertarik dengan project desain logo yang diposting. Boleh saya tanya-tanya?', timestamp: '10:00' },
  { id: 'm_2', chatId: 'chat_u1_u2_p1', senderId: 'u2', text: 'Halo Joko! Boleh, silakan, mau tanya apa?', timestamp: '10:05' }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [users, setUsers] = React.useState(() => {
    const saved = localStorage.getItem('gigskill_users');
    let parsedUsers = saved ? JSON.parse(saved) : initialUsers;
    const appVersion = localStorage.getItem('gigskill_app_version_v3');
    if (!appVersion) {
      parsedUsers = parsedUsers.map(u => {
        if (u.id === 'u1') return { ...u, balance: 300000 };
        if (u.id === 'u2') return { ...u, balance: 5000000 };
        return u;
      });
      localStorage.setItem('gigskill_app_version_v3', 'v3');
    }
    return parsedUsers;
  });
  const [projects, setProjects] = React.useState(() => {
    const saved = localStorage.getItem('gigskill_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });
  const [messages, setMessages] = React.useState(() => {
    const saved = localStorage.getItem('gigskill_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object' && parsed !== null) {
          let arr = [];
          Object.values(parsed).forEach(v => {
            if (Array.isArray(v)) arr = [...arr, ...v];
          });
          return arr;
        }
      } catch(e) {
        return initialMessages;
      }
    }
    return initialMessages;
  });
  const [transactions, setTransactions] = React.useState(() => {
    const saved = localStorage.getItem('gigskill_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [footerPopup, setFooterPopup] = React.useState(null);
  const [activeChatContext, setActiveChatContext] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem('gigskill_users', JSON.stringify(users));
  }, [users]);

  React.useEffect(() => {
    localStorage.setItem('gigskill_projects', JSON.stringify(projects));
  }, [projects]);

  React.useEffect(() => {
    localStorage.setItem('gigskill_messages', JSON.stringify(messages));
  }, [messages]);
  React.useEffect(() => {
    localStorage.setItem('gigskill_transactions', JSON.stringify(transactions));
  }, [transactions]);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type, exiting: false });
    setTimeout(() => {
      setToast(prev => prev.show ? { ...prev, exiting: true } : prev);
      setTimeout(() => setToast({ show: false, message: '', type: '', exiting: false }), 300);
    }, 3000);
  };
  
  const hideToast = () => {
    setToast(prev => ({ ...prev, exiting: true }));
    setTimeout(() => setToast({ show: false, message: '', type: '', exiting: false }), 300);
  };

  
  const onStartChat = (partnerId, projectId) => {
    if (projectId) {
      setActiveChatContext(projectId);
    } else {
      setActiveChatContext(null);
    }
  };

  const handleRegister = (userData) => {
    const newId = 'u_' + Date.now();

    const newUser = {
      ...userData,
      id: newId,
      ...(userData.role === 'student' ? { skills: [], portfolios: [] } : {})
    };

    setUsers([...users, newUser]);

    const roleName =
      userData.role === 'student' ? 'Mahasiswa' : 'UMKM';

    showToast(
      `Pendaftaran ${roleName} Berhasil! Silakan login.`,
      'success'
    );

    setTimeout(() => navigateTo('login'), 1500);
  };

  const handleLogin = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setCurrentUser(user);

      if (user.role === 'student') {
        navigateTo('studentDashboard');
      }

      if (user.role === 'umkm') {
        navigateTo('umkmDashboard');
      }

      if (user.role === 'admin') {
        navigateTo('adminDashboard');
      }

      showToast(`Selamat datang, ${user.name}!`, 'success');
    } else {
      showToast('Email atau password salah!', 'error');
    }
  };

  const handleQuickLogin = (role) => {
    const user = users.find((u) => u.role === role);

    if (user) {
      handleLogin(user.email, user.password);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('landing');
    showToast('Berhasil keluar dari akun', 'success');
  };

  const handlePostProject = (projectData) => {
    const newProject = {
      id: 'p_' + Date.now(),
      umkmId: currentUser.id,
      umkmName: currentUser.name,
      verified: true,
      applicants: [],
      ...projectData,
      tags: projectData.tags || ['New']
    };

    setProjects([newProject, ...projects]);

    showToast('Project berhasil diposting!', 'success');
  };

    const handleUpdateProfile = (userId, newProfileData) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...newProfileData } : u));
    setCurrentUser(prev => ({ ...prev, ...newProfileData }));
    showToast('Profil berhasil diperbarui!');
  };

  const handleUpdateApplicantStatus = (projectId, studentId, status) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: status === 'Diterima' ? 'Mahasiswa Terpilih' : p.status,
          applicants: p.applicants.map(a => a.studentId === studentId ? { ...a, status } : a)
        };
      }
      return p;
    }));
    showToast(`Pelamar ${status === 'Diterima' ? 'berhasil diterima' : 'ditolak'}.`, status === 'Diterima' ? 'success' : 'error');
  };

  
    const handleRequestTransaction = (type, amount, accountDetails) => {
    const newTx = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      type, // 'topup' or 'withdraw'
      amount: Number(amount),
      accountDetails,
      status: 'Menunggu',
      date: new Date().toLocaleDateString('id-ID')
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(`Permintaan ${type === 'topup' ? 'Top Up' : 'Withdraw'} berhasil dikirim ke Admin.`);
  };

  const handleReviewProject = (projectId, isAccepted, reason = '') => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.status === 'Menunggu Review') {
        if (isAccepted) {
          if (p.paymentStatus === 'Sudah Dibayar') return { ...p, status: 'Selesai' };
          setUsers(usersList => usersList.map(u => {
            if (u.id === p.umkmId) return { ...u, balance: (u.balance || 0) - Number(p.budget) };
            if (p.applicants.some(a => a.status === 'Diterima' && a.studentId === u.id)) {
               return { ...u, balance: (u.balance || 0) + Number(p.budget) };
            }
            return u;
          }));
          return { ...p, status: 'Selesai', paymentStatus: 'Sudah Dibayar' };
        } else {
          return { 
             ...p, 
             status: 'Menunggu Banding',
            banding: {
              reason,
              studentResponse: '',
              status: 'Menunggu Banding',
              date: null,
              bandingSubmittedAt: null
            }
          };
        }
      }
      return p;
    }));
    showToast(isAccepted ? 'Project diselesaikan & Saldo ditransfer!' : 'Project dikembalikan untuk Banding.');
  };

  const handleSubmitBanding = (projectId, studentResponse) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.banding) {
        return {
          ...p,
          status: 'Banding Berlangsung',
          banding: {
            ...p.banding,
            studentResponse,
            status: 'Banding Berlangsung',
            date: new Date().toISOString(),
            bandingSubmittedAt: Date.now()
          }
        };
      }
      return p;
    }));
    showToast('Banding berhasil dikirim! Batas waktu 2 hari dimulai.');
  };

  const handleCompleteProject = (projectId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.status === 'Mahasiswa Terpilih') {
        return { ...p, status: 'Menunggu Review' };
      }
      return p;
    }));
    showToast('Pekerjaan dikirim! Menunggu review UMKM.', 'success');
  };

  const handleApplyProject = (projectId, proposal) => {
    if (currentUser?.role !== 'student') return;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const isApplied = p.applicants.some(a => a.studentId === currentUser.id);
          if (isApplied) {
            showToast('Anda sudah melamar project ini sebelumnya.', 'error');
            return p;
          }

          return {
            ...p,
            applicants: [
              ...p.applicants,
              {
                studentId: currentUser.id,
                studentName: currentUser.name,
                proposal: proposal.trim() ? proposal : 'Halo, saya berminat untuk melamar project ini.',
                date: new Date().toLocaleDateString('id-ID'),
                status: 'Menunggu'
              }
            ]
          };
        }
        return p;
      })
    );
    showToast('Lamaran berhasil dikirim!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200]">
          <div
            onClick={hideToast}
            className={
              'cursor-pointer flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg border transition-all duration-300 transform ' +
              (toast.exiting ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0') + ' ' +
              (toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700')
            }
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <XCircle size={20} />
            )}

            <span className="font-bold text-sm">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      {!currentPage.includes('Dashboard') && (
        <Navbar
          navigateTo={navigateTo}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      )}

      <main className="flex-grow flex flex-col relative">
        {currentPage === 'landing' && (
          <LandingPage navigateTo={navigateTo} />
        )}

        {currentPage === 'login' && (
          <LoginPage
            handleLogin={handleLogin}
            handleQuickLogin={handleQuickLogin}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onRegister={handleRegister}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === 'studentDashboard' &&
          currentUser?.role === 'student' && (
            <StudentDashboard onLogout={handleLogout}
              currentUser={currentUser}
              users={users}
              projects={projects}
              onApply={handleApplyProject}
              messages={messages}
              setMessages={setMessages}
              onUpdateProfile={handleUpdateProfile}
              onCompleteProject={handleCompleteProject}
              onStartChat={onStartChat}
              onSubmitBanding={handleSubmitBanding}
              activeChatContext={activeChatContext}
              setActiveChatContext={setActiveChatContext}
              transactions={transactions}
              onRequestTransaction={handleRequestTransaction}
            />
          )}

        {currentPage === 'umkmDashboard' &&
          currentUser?.role === 'umkm' && (
            <UMKMDashboard onLogout={handleLogout}
              currentUser={currentUser}
              users={users}
              projects={projects}
              onPostProject={handlePostProject}
              onUpdateApplicantStatus={handleUpdateApplicantStatus}
              messages={messages}
              setMessages={setMessages}
              onUpdateProfile={handleUpdateProfile}
              onStartChat={onStartChat}
              onReviewProject={handleReviewProject}
              activeChatContext={activeChatContext}
              setActiveChatContext={setActiveChatContext}
              transactions={transactions}
              onRequestTransaction={handleRequestTransaction}
            />
          )}

        {currentPage === 'adminDashboard' &&
          currentUser?.role === 'admin' && (
            <AdminDashboard onLogout={handleLogout} showToast={showToast} users={users} setUsers={setUsers} projects={projects} setProjects={setProjects} transactions={transactions} setTransactions={setTransactions} />
          )}
      </main>

      
      {footerPopup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">
                {footerPopup === 'tentang' ? 'Tentang Kami' : footerPopup === 'panduan' ? 'Panduan Penggunaan' : 'Syarat & Ketentuan'}
              </h3>
              <button onClick={() => setFooterPopup(null)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <div className="text-slate-600 text-sm space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {footerPopup === 'tentang' && (
                <div>
                  <p className="mb-4">GigSkill adalah platform micro-credential inovatif yang dirancang khusus untuk menjembatani mahasiswa dengan UMKM (Usaha Mikro, Kecil, dan Menengah). Misi kami adalah memberdayakan mahasiswa dengan pengalaman nyata sambil membantu UMKM mendapatkan talenta kreatif.</p>
                  <h4 className="font-bold text-slate-800 mb-2">KELOMPOK 7</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>1. RIPKI MAULANA â€” 251010504293</li>
                    <li>2. MUHAMAD SOFIYAN â€” 251010502197</li>
                    <li>3. FARAH ZAFIRA ROSYADI â€” 251010502335</li>
                    <li>4. NAJMA NAURA TSABITA â€” 251010502277</li>
                  </ul>
                </div>
              )}
              {footerPopup === 'panduan' && (
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Untuk Mahasiswa:</strong> Lengkapi profil Anda, cari proyek yang sesuai dengan keahlian, kirimkan lamaran terbaik Anda. Setelah diterima, kerjakan proyek dengan penuh tanggung jawab.</li>
                  <li><strong>Untuk UMKM:</strong> Posting kebutuhan proyek Anda secara detail. Review pelamar yang masuk, pilih kandidat terbaik, dan berikan panduan. Setelah selesai, berikan review yang jujur.</li>
                </ul>
              )}
              {footerPopup === 'syarat' && (
                <div className="space-y-2">
                  <p>1. Pengguna wajib memberikan data yang valid.</p>
                  <p>2. Transaksi diselesaikan melalui sistem platform untuk menjamin keamanan.</p>
                  <p>3. Perselisihan antara Mahasiswa dan UMKM dapat dieskalasi ke tim Admin GigSkill dalam waktu 2 hari setelah proses Banding dimulai.</p>
                </div>
              )}
            </div>
            <button onClick={() => setFooterPopup(null)} className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Tutup</button>
          </div>
        </div>
      )}
      <Footer onOpenPopup={setFooterPopup} />

    </div>
  );
}

function Navbar({ navigateTo, currentUser, handleLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleIcon = () => {
    if (!currentUser) {
      return <User size={18} />;
    }

    if (currentUser.role === 'student') {
      return <GraduationCap size={18} />;
    }

    if (currentUser.role === 'umkm') {
      return <Store size={18} />;
    }

    if (currentUser.role === 'admin') {
      return <ShieldCheck size={18} />;
    }

    return <User size={18} />;
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => navigateTo(currentUser ? `${currentUser.role}Dashboard` : 'landing')}
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mr-3">
              <Briefcase
                size={21}
                className="text-white"
              />
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Gig<span className="text-blue-600">Skill</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {!currentUser ? (
              <>
                <button
                  onClick={() => navigateTo('landing')}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Beranda
                </button>

                <div className="h-4 w-px bg-slate-200"></div>

                <button
                  onClick={() => navigateTo('login')}
                  className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Masuk
                </button>

                <button
                  onClick={() => navigateTo('register')}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  Daftar Akun
                </button>
              </>
            ) : (
              <>
                <button 
                    onClick={() => navigateTo(`${currentUser.role}Dashboard`)}
                    className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors text-left"
                  >
                    <div
                      className={
                        'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ' +
                        (currentUser.role === 'umkm'
                          ? 'bg-green-500'
                          : currentUser.role === 'admin'
                          ? 'bg-purple-600'
                          : 'bg-blue-600')
                      }
                    >
                      {getRoleIcon()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 leading-none">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              className="text-slate-600 p-2 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 absolute w-full shadow-xl z-50">
          {!currentUser ? (
            <>
              <button
                onClick={() => {
                  navigateTo('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-50"
              >
                Masuk
              </button>

              <button
                onClick={() => {
                  navigateTo('register');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl font-bold text-white bg-blue-600"
              >
                Daftar Akun
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 py-3 px-4 rounded-xl font-bold text-red-600 bg-red-50"
            >
              <LogOut size={18} />
              <span>Keluar ({currentUser.name})</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

function LandingPage({ navigateTo }) {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 pt-20 pb-24 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/30 blur-3xl rounded-full pointer-events-none"></div>

        <div className="text-center max-w-4xl mx-auto z-10 relative">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-slate-200 shadow-sm px-4 py-2 rounded-full text-sm font-semibold mb-8 cursor-default">
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>

            <span className="text-slate-600">
              Project Beta Tester
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Hubungkan Talenta.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Bangun Pengalaman.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            GigSkill adalah platform micro-project yang
            dirancang untuk membantu mahasiswa membangun
            portofolio nyata, sekaligus membantu UMKM
            bertransformasi secara digital.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => navigateTo('register')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-1 flex items-center justify-center"
            >
              Mulai Sekarang
              <ArrowRight
                className="ml-2"
                size={20}
              />
            </button>

            <button
              onClick={() => navigateTo('login')}
              className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Masuk
            </button>
          </div>
        </div>

        <div className="mt-20 max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>

            <div className="ml-4 bg-white px-3 py-1 rounded-md text-xs font-medium text-slate-400">
              gigskill.web.id/dashboard
            </div>
          </div>

          <div className="p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80 pointer-events-none">
            <div className="col-span-1 space-y-4">
              <div className="h-32 bg-white rounded-2xl border border-slate-200 p-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full mb-3"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
              </div>

              <div className="h-48 bg-white rounded-2xl border border-slate-200"></div>
            </div>

            <div className="col-span-2 space-y-4">
              <div className="h-16 bg-white rounded-2xl border border-slate-200 flex items-center px-4">
                <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
              </div>

              <div className="h-24 bg-white rounded-2xl border border-slate-200"></div>

              <div className="h-24 bg-white rounded-2xl border border-slate-200"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RegisterPage({
  onRegister,
  navigateTo
}) {
  const [activeTab, setActiveTab] =
    useState('student');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    univ: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onRegister({
      role: activeTab,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      univ: formData.univ,
      phone: formData.phone
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Buat Akun Baru
          </h1>

          <p className="text-slate-500 font-medium">
            Pilih peran Anda untuk bergabung dengan
            ekosistem.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab('student')}
            className={
              'flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ' +
              (activeTab === 'student'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700')
            }
          >
            <GraduationCap size={18} />
            <span>Mahasiswa</span>
          </button>

          <button
            onClick={() => setActiveTab('umkm')}
            className={
              'flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ' +
              (activeTab === 'umkm'
                ? 'bg-white text-green-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700')
            }
          >
            <Store size={18} />
            <span>UMKM</span>
          </button>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          {activeTab === 'student' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Nama Lengkap Sesuai KTM
                </label>

                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value
                      })
                    }
                    placeholder="Cth: Budi Santoso"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Universitas
                </label>

                <div className="relative">
                  <Building
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <select
                    required
                    value={formData.univ}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        univ: e.target.value
                      })
                    }
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-slate-700 transition-all"
                  >
                    <option value="">
                      Pilih Kampus...
                    </option>
                    <option value="unpam">
                      Universitas Pamulang
                    </option>
                    <option value="ui">
                      Universitas Indonesia
                    </option>
                  </select>

                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Nama Usaha / Bisnis
                </label>

                <div className="relative">
                  <Store
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value
                      })
                    }
                    placeholder="Cth: Kopi Kenangan Senja"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Nomor WhatsApp Aktif
                </label>

                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value
                      })
                    }
                    placeholder="081234567890"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
              Email
            </label>

            <div className="relative mb-4">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
                placeholder="email@contoh.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all font-medium"
              />
            </div>

            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                }
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className={
              'w-full text-white py-4 rounded-2xl font-extrabold text-lg transition-all shadow-lg hover:-translate-y-0.5 mt-6 ' +
              (activeTab === 'student'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                : 'bg-green-600 hover:bg-green-700 shadow-green-600/30')
            }
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-600">
          Sudah memiliki akun?{' '}
          <button
            onClick={() => navigateTo('login')}
            className="text-blue-600 font-bold hover:underline"
          >
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginPage({
  handleLogin,
  handleQuickLogin,
  navigateTo
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Selamat Datang
          </h1>

          <p className="text-slate-500 font-medium">
            Silakan masuk menggunakan akun Anda.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 mb-8"
        >
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email Anda"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2"
          >
            Masuk
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">
              Atau Gunakan Demo Akun
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              handleQuickLogin('student')
            }
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <GraduationCap
              className="text-slate-400 group-hover:text-blue-600 mb-1"
              size={20}
            />

            <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">
              Mahasiswa
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickLogin('umkm')
            }
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <Store
              className="text-slate-400 group-hover:text-green-600 mb-1"
              size={20}
            />

            <span className="text-xs font-bold text-slate-600 group-hover:text-green-700">
              UMKM
            </span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Belum memiliki akun?{' '}
          <button
            onClick={() => navigateTo('register')}
            className="text-blue-600 font-bold hover:underline"
          >
            Daftar sekarang
          </button>
        </p>
      </div>
    </div>
  );
}


function StudentDashboard({
  onLogout,
  currentUser,
  users,
  projects,
  onApply,
  messages,
  setMessages,
  onUpdateProfile,
  onCompleteProject,
  onStartChat,
  onSubmitBanding,
  activeChatContext,
  setActiveChatContext,
  transactions,
  onRequestTransaction
}) {
  const [activeTab, setActiveTab] = React.useState('cari');
  const [activeChatId, setActiveChatId] = React.useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [bandingInput, setBandingInput] = React.useState({});
  const [categoryFilter, setCategoryFilter] = React.useState('Semua');
  const [budgetFilter, setBudgetFilter] = React.useState('Semua');

  const [selectedProject, setSelectedProject] = React.useState(null);
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [proposalText, setProposalText] = React.useState('');

  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [editProfileData, setEditProfileData] = React.useState({
    name: currentUser.name || '',
    univ: currentUser.univ || '',
    semester: currentUser.semester || '',
    bio: currentUser.bio || '',
    skills: currentUser.skills ? currentUser.skills.join(', ') : ''
  });

  const handleStartChat = (umkmId, projectId) => {
    setActiveChatId(`chat_${currentUser.id}_${umkmId}_${projectId}`);
    setActiveChatContext(projectId);
    setIsChatOpen(true);
    setSelectedProject(null);
  };

  const myApplications = projects.filter((p) =>
    p.applicants.some((a) => a.studentId === currentUser.id)
  );

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    onApply(selectedProject.id, proposalText);
    setShowApplyModal(false);
    setSelectedProject(null);
    setProposalText('');
    setActiveTab('lamaran');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile(currentUser.id, {
      ...editProfileData,
      semester: parseInt(editProfileData.semester) || 1,
      skills: editProfileData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setShowEditProfile(false);
  };

  const filteredProjects = projects.filter(p => {
    if (p.status !== 'open') return false;
    
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(searchLower) || 
                        p.umkmName.toLowerCase().includes(searchLower) ||
                        p.tags.some(t => t.toLowerCase().includes(searchLower));
    if (!matchSearch) return false;

    if (categoryFilter !== 'Semua' && p.category !== categoryFilter) return false;

    const budget = Number(p.budget);
    if (budgetFilter === '< 100k' && budget >= 100000) return false;
    if (budgetFilter === '100k - 500k' && (budget < 100000 || budget > 500000)) return false;
    if (budgetFilter === '> 500k' && budget <= 500000) return false;

    return true;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 relative">
      {showApplyModal && selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Lamar Project</h2>
            <p className="text-slate-600 mb-6">Ceritakan mengapa Anda cocok untuk project "{selectedProject.title}"</p>
            
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Proposal / Pesan Singkat</label>
                <textarea 
                  rows={4}
                  value={proposalText}
                  onChange={e => setProposalText(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Halo, saya memiliki pengalaman dalam hal ini..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold transition-all">
                  Batal
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all">
                  Kirim Lamaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Edit Profil</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                <input required type="text" value={editProfileData.name} onChange={e => setEditProfileData({...editProfileData, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Universitas</label>
                  <input required type="text" value={editProfileData.univ} onChange={e => setEditProfileData({...editProfileData, univ: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Semester</label>
                  <input required type="number" min="1" max="14" value={editProfileData.semester} onChange={e => setEditProfileData({...editProfileData, semester: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bio Singkat</label>
                <textarea rows={3} value={editProfileData.bio} onChange={e => setEditProfileData({...editProfileData, bio: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Skill (pisahkan dengan koma)</label>
                <input type="text" value={editProfileData.skills} onChange={e => setEditProfileData({...editProfileData, skills: e.target.value})} placeholder="React, Figma, dll" className="w-full p-3 rounded-xl border border-slate-200" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold">Batal</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProject && !showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  {selectedProject.status === 'open' ? 'Mencari Pelamar' : 'Ditutup'}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-3">{selectedProject.title}</h2>
                <div className="flex items-center mt-2 text-sm font-bold text-slate-500">
                  <span>{selectedProject.umkmName}</span>
                  {selectedProject.verified && <CheckCircle2 size={16} className="ml-2 text-blue-500" />}
                </div>
              </div>
              <button onClick={() => setSelectedProject(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><X size={20} /></button>
            </div>
            
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{selectedProject.category || 'Lainnya'}</span>
              {selectedProject.tags.map(t => <span key={t} className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">{t}</span>)}
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">{selectedProject.desc}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-green-700 mb-1">Budget</p>
                <p className="text-lg font-extrabold text-green-700">{formatRupiah(selectedProject.budget)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-500 mb-1">Deadline</p>
                <p className="text-lg font-extrabold text-slate-700">{selectedProject.deadline}</p>
              </div>
            </div>

            <p className="text-sm text-slate-500 font-medium mb-6">{selectedProject.applicants.length} orang telah melamar</p>

            {selectedProject.status === 'open' && (
              <div className="flex gap-3">
                <button onClick={() => setShowApplyModal(true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all">
                  Kirim Lamaran
                </button>
                <button onClick={() => handleStartChat(selectedProject.umkmId, selectedProject.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold border border-slate-200 flex items-center justify-center">
                  <MessageCircle size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out md:flex md:w-64 bg-white border-r border-slate-200 p-6 flex-col z-[100] h-[100dvh] md:h-screen w-64 shadow-2xl md:shadow-none`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mr-2">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Gig<span className="text-blue-600">Skill</span>
            </span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Menu Utama</h2>
        <nav className="space-y-2 flex-1">
          {[
            { id: 'cari', icon: Search, label: 'Cari Project' },
            { id: 'lamaran', icon: Briefcase, label: 'Lamaran Saya' },
            { id: 'profil', icon: User, label: 'Profil & Portfolio' },
            { id: 'dompet', icon: CreditCard, label: 'Dompet Saya' },
            { id: 'pesan', icon: MessageCircle, label: 'Pesan' }
          ].map((item) => (
            <button key={item.id} onClick={() => { if(item.id === 'pesan') { setIsChatOpen(true); } else { setActiveTab(item.id); } setIsMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id || (item.id === 'pesan' && isChatOpen) ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="pt-6 mt-6 border-t border-slate-200">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-[90] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Mahasiswa</h1>
          </div>
          <div className="flex items-center mt-2 space-x-2">
            <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase">{currentUser.univ || 'Universitas'}</span>
            {currentUser.verified ? <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md"><CheckCircle2 size={14} className="mr-1" /> Terverifikasi</span> : <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">Menunggu Verifikasi</span>}
          </div>
        </div>

        {activeTab === 'dompet' && <DompetView role="student" currentUser={currentUser} onRequestTransaction={onRequestTransaction} transactions={transactions} />}
        <ChatView currentUser={currentUser} users={users} role="student" messages={messages} setMessages={setMessages} initialActiveChat={activeChatId} activeChatContext={activeChatContext} setActiveChatContext={setActiveChatContext} projects={projects} isChatOpen={isChatOpen || activeTab === 'pesan'} onClose={() => { setIsChatOpen(false); if(activeTab === 'pesan') setActiveTab('cari'); }} />

        {activeTab === 'cari' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-2 w-full">
                <Search className="text-slate-400 mr-2" size={20} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari judul, tag, atau UMKM..." className="w-full p-2 outline-none text-sm font-medium bg-transparent" />
              </div>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none w-full md:w-auto">
                <option value="Semua">Semua Kategori</option>
                <option value="Desain">Desain</option>
                <option value="Pemasaran">Pemasaran</option>
                <option value="Administrasi">Administrasi</option>
              </select>
              <select value={budgetFilter} onChange={e => setBudgetFilter(e.target.value)} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none w-full md:w-auto">
                <option value="Semua">Semua Budget</option>
                <option value="< 100k">&lt; Rp 100.000</option>
                <option value="100k - 500k">Rp 100k - 500k</option>
                <option value="> 500k">&gt; Rp 500.000</option>
              </select>
            </div>
            
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="font-bold text-slate-500">Tidak ada project yang sesuai dengan filter Anda.</p>
                <button onClick={() => { setSearchQuery(''); setCategoryFilter('Semua'); setBudgetFilter('Semua'); }} className="mt-4 text-blue-600 font-bold hover:underline">Reset Filter</button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProjects.map((project) => {
                  const hasApplied = project.applicants.some((a) => a.studentId === currentUser.id);
                  return (
                    <div
                      key={project.id}
                      onClick={() => !hasApplied && setSelectedProject(project)}
                      className={'bg-white p-6 rounded-2xl border transition-all group ' + (hasApplied ? 'border-slate-200 opacity-60 cursor-default' : 'border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer')}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-500 mb-1">{project.umkmName}</p>
                          <h3 className={'text-xl font-extrabold ' + (hasApplied ? 'text-slate-700' : 'text-slate-900 group-hover:text-blue-600')}>{project.title}</h3>
                        </div>
                        <div className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                          <p className="text-sm font-extrabold text-green-700">{formatRupiah(project.budget)}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                      {hasApplied && (
                        <div className="mt-4 inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
                          <CheckCircle2 size={14} className="mr-1.5" /> Sudah Dilamar
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'lamaran' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">Riwayat Lamaran</h2>
            {myApplications.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center">
                <Briefcase className="mx-auto mb-3 text-slate-300" size={40} />
                <p className="text-slate-500 font-medium">Belum ada lamaran yang diajukan.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myApplications.map(project => {
                  const application = project.applicants.find(a => a.studentId === currentUser.id);
                  let statusColor = 'bg-amber-100 text-amber-700';
                  if (application.status === 'Diterima' || project.status === 'Selesai') statusColor = 'bg-green-100 text-green-700';
                  if (application.status === 'Ditolak') statusColor = 'bg-red-100 text-red-700';

                  const isAccepted = application.status === 'Diterima';
                  const isCompleted = project.status === 'Selesai';
                  
                  return (
                    <div key={project.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-slate-500">{project.umkmName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                            {isCompleted ? 'Selesai' : application.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900">{project.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.desc}</p>
                        <p className="text-sm text-slate-500 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">Proposal: "{application.proposal}"</p>
                        <p className="text-xs font-bold text-slate-400 mt-2">Dilamar pada: {application.date}</p>
                        
                        {(isAccepted && !isCompleted && project.status !== 'Menunggu Review' && project.status !== 'Menunggu Banding' && project.status !== 'Banding Berlangsung') && (
                           <div className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                             <div className="flex justify-between items-center mb-1">
                               <span className="text-xs font-bold text-slate-600">Progres Pengerjaan</span>
                               <span className="text-xs font-bold text-blue-600">Sedang Dikerjakan</span>
                             </div>
                             <div className="w-full bg-slate-200 rounded-full h-2">
                               <div className="bg-blue-600 h-2 rounded-full w-1/2 animate-pulse"></div>
                             </div>
                           </div>
                        )}
                        {project.status === 'Menunggu Review' && (
                           <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                             <p className="text-sm font-bold text-amber-700">Menunggu Review UMKM</p>
                             <p className="text-xs text-amber-600">Pekerjaan telah dikirim dan sedang direview.</p>
                           </div>
                        )}
                        {project.status === 'Menunggu Banding' && project.banding && (
                           <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl">
                             <p className="text-sm font-bold text-red-700">Pekerjaan Ditolak UMKM</p>
                             <p className="text-xs text-red-600 italic mt-1">"{project.banding.reason}"</p>
                             <div className="mt-3">
                               <textarea 
                                 className="w-full text-sm p-2 rounded-lg border border-red-200 focus:outline-none focus:ring-1 focus:ring-red-500" 
                                 placeholder="Berikan penjelasan/jawaban Anda..."
                                 rows="2"
                                 value={bandingInput[project.id] || ''}
                                 onChange={e => setBandingInput({...bandingInput, [project.id]: e.target.value})}
                               ></textarea>
                               <button 
                                 onClick={() => onSubmitBanding(project.id, bandingInput[project.id] || '')}
                                 disabled={!(bandingInput[project.id] && bandingInput[project.id].trim())}
                                 className="mt-2 text-xs font-bold bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-red-700"
                               >Kirim Banding</button>
                             </div>
                           </div>
                        )}
                        {project.status === 'Banding Berlangsung' && project.banding && (
                           <div className="mt-4 bg-purple-50 border border-purple-200 p-4 rounded-xl">
                             <p className="text-sm font-bold text-purple-700">Banding Sedang Diproses</p>
                             <p className="text-xs text-purple-600 mt-1">Menunggu mediasi dari tim Admin GigSkill.</p>
                           </div>
                        )}
                      </div>
                      <div className="text-left md:text-right flex flex-col md:items-end justify-between self-stretch">
                        <p className="text-lg font-extrabold text-green-700 mb-2">{formatRupiah(project.budget)}</p>
                        <div className="flex gap-2 flex-wrap md:justify-end mt-auto">
                          <button onClick={() => handleStartChat(project.umkmId, project.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors flex items-center">
                            <MessageCircle size={16} className="mr-1.5" /> Chat
                          </button>
                          {(isAccepted && !isCompleted && project.status !== 'Menunggu Review' && project.status !== 'Menunggu Banding' && project.status !== 'Banding Berlangsung') && (
                            <button onClick={() => onCompleteProject(project.id)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                              Project Selesai
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h2>
                  <p className="text-slate-500 font-medium">{currentUser.univ} â€¢ Semester {currentUser.semester || '?'}</p>
                  <div className="flex items-center mt-2 text-amber-500">
                    <span className="font-bold mr-1">{currentUser.rating || '0.0'}</span>
                    <span className="text-slate-400 text-sm font-medium">/ 5.0 (Rating)</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowEditProfile(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors">
                Edit Profil
              </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">Tentang Saya</h3>
                <p className="text-slate-700 leading-relaxed">{currentUser.bio || 'Belum ada bio. Edit profil untuk menambahkan.'}</p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">Keahlian (Skills)</h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills && currentUser.skills.length > 0 ? (
                    currentUser.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg border border-blue-100">{skill}</span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">Belum ada skill.</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">Portfolio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser.portfolios && currentUser.portfolios.length > 0 ? (
                    currentUser.portfolios.map((port, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:border-blue-300 transition-colors cursor-pointer">
                        <span className="font-bold text-slate-700">{port.title}</span>
                        <ArrowRight size={16} className="text-slate-400" />
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">Belum ada portofolio.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function UMKMDashboard({
  onLogout,
  currentUser,
  users,
  projects,
  onPostProject,
  onUpdateApplicantStatus,
  messages,
  setMessages,
  onUpdateProfile,
  onStartChat,
  onReviewProject,
  activeChatContext,
  setActiveChatContext,
  transactions,
  onRequestTransaction
}) {
  const [activeTab, setActiveTab] = React.useState('project');
  const [activeChatId, setActiveChatId] = React.useState(null);
  const [rejectForm, setRejectForm] = React.useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  
  const [isCustomCategory, setIsCustomCategory] = React.useState(false);
  const [isCustomDeadline, setIsCustomDeadline] = React.useState(false);
  const [expandedProject, setExpandedProject] = React.useState(null);
  const [showStudentProfile, setShowStudentProfile] = React.useState(null);

  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [editProfileData, setEditProfileData] = React.useState({
    name: currentUser.name || '',
    category: currentUser.category || '',
    phone: currentUser.phone || '',
    desc: currentUser.desc || ''
  });

  const handleStartChat = (studentId, projectId) => {
    setActiveChatId(`chat_${studentId}_${currentUser.id}_${projectId}`);
    setActiveChatContext(projectId);
    setIsChatOpen(true);
    if (onStartChat) onStartChat(studentId, projectId);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile(currentUser.id, editProfileData);
    setShowEditProfile(false);
  };

  // Only show projects created by this UMKM (using dummy/u2 for mockup purposes)
  const myProjects = projects.filter(
    (p) => p.umkmId === currentUser.id || (p.umkmId === 'dummy' && currentUser.id === 'u2')
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      {showEditProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Edit Profil UMKM</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Usaha</label>
                <input required type="text" value={editProfileData.name} onChange={e => setEditProfileData({...editProfileData, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                  <input required type="text" value={editProfileData.category} onChange={e => setEditProfileData({...editProfileData, category: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">No. HP / Kontak</label>
                  <input required type="text" value={editProfileData.phone} onChange={e => setEditProfileData({...editProfileData, phone: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Usaha</label>
                <textarea rows={4} value={editProfileData.desc} onChange={e => setEditProfileData({...editProfileData, desc: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200"></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold">Batal</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStudentProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">Profil Pelamar</h2>
              <button onClick={() => setShowStudentProfile(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><X size={20} /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {showStudentProfile.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{showStudentProfile.name}</h3>
                <p className="text-slate-500 text-sm">{showStudentProfile.univ} â€¢ Semester {showStudentProfile.semester}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bio</h4>
                <p className="text-slate-700 text-sm">{showStudentProfile.bio || '-'}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skill</h4>
                <div className="flex flex-wrap gap-2">
                  {showStudentProfile.skills?.map(s => <span key={s} className="bg-blue-50 text-blue-700 font-bold text-xs px-2 py-1 rounded-md">{s}</span>)}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Portfolio</h4>
                <ul className="list-disc pl-5 text-sm text-blue-600 font-medium">
                  {showStudentProfile.portfolios?.map(p => <li key={p.title}><a href={p.link} className="hover:underline">{p.title}</a></li>)}
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <span className="inline-block bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-lg">Rating: {showStudentProfile.rating} / 5.0</span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out md:flex md:w-64 bg-white border-r border-slate-200 p-6 flex-col z-[100] h-[100dvh] md:h-screen w-64 shadow-2xl md:shadow-none`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mr-2">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Gig<span className="text-blue-600">Skill</span>
            </span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Menu Utama</h2>
        <nav className="space-y-2 flex-1">
          {[
            { id: 'project', icon: Briefcase, label: 'Project Saya' },
            { id: 'post', icon: Plus, label: 'Buat Project Baru' },
            { id: 'profil', icon: Store, label: 'Profil Usaha' },
            { id: 'dompet', icon: CreditCard, label: 'Dompet Saya' },
            { id: 'pesan', icon: MessageCircle, label: 'Pesan' }
          ].map((item) => (
            <button key={item.id} onClick={() => { if(item.id === 'pesan') { setIsChatOpen(true); } else { setActiveTab(item.id); } setIsMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id || (item.id === 'pesan' && isChatOpen) ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="pt-6 mt-6 border-t border-slate-200">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-[90] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-8 flex justify-between items-start md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard UMKM</h1>
            </div>
            <p className="text-slate-500 mt-1 font-medium">Kelola project dan pelamar Anda</p>
          </div>
        </div>

        {activeTab === 'dompet' && <DompetView role="umkm" currentUser={currentUser} onRequestTransaction={onRequestTransaction} transactions={transactions} />}
        <ChatView currentUser={currentUser} users={users} role="umkm" messages={messages} setMessages={setMessages} initialActiveChat={activeChatId} activeChatContext={activeChatContext} setActiveChatContext={setActiveChatContext} projects={projects} isChatOpen={isChatOpen || activeTab === 'pesan'} onClose={() => { setIsChatOpen(false); if(activeTab === 'pesan') setActiveTab('project'); }} />

        {activeTab === 'project' && (
          <div className="space-y-6">
            {myProjects.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="font-bold text-slate-500 mb-4">Belum ada project yang diposting.</p>
                <button onClick={() => setActiveTab('post')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Buat Project Pertama</button>
              </div>
            ) : (
              <div className="grid gap-6">
                {myProjects.map((project) => (
                  <div key={project.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest border ${
                            project.status === 'open' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                            project.status === 'Selesai' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                            project.status === 'Menunggu Review' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            project.status === 'Menunggu Banding' ? 'bg-red-100 text-red-700 border-red-200' :
                            project.status === 'Banding Berlangsung' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-green-100 text-green-700 border-green-200'
                          }`}>
                            {project.status === 'open' ? 'Mencari Pelamar' : 
                             project.status === 'Selesai' ? 'Project Selesai' : 
                             project.status === 'Menunggu Review' ? 'Menunggu Review' :
                             project.status === 'Menunggu Banding' ? 'Menunggu Banding' :
                             project.status === 'Banding Berlangsung' ? 'Banding Berlangsung' :
                             'Mahasiswa Terpilih'}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900">{project.title}</h3>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xl font-extrabold text-green-700 mb-1">{formatRupiah(project.budget)}</p>
                        <p className="text-sm font-bold text-slate-500">{project.applicants.length} Pelamar</p>
                      </div>
                    </div>
                    
                    {(project.status === 'Menunggu Review' || project.status === 'Menunggu Banding' || project.status === 'Banding Berlangsung' || project.status === 'Selesai' || project.status === 'Mahasiswa Terpilih') && (() => {
                      const acceptedApplicant = project.applicants.find(a => a.status === 'Diterima');
                      if (!acceptedApplicant) return null;
                      return (
                        <div className="mt-4 mb-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <p className="text-sm font-bold text-slate-700 mb-2">Status Pekerjaan: <span className="text-blue-600 capitalize">{project.status}</span></p>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 mb-3 md:mb-0">
                              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">{acceptedApplicant.studentName.charAt(0)}</div>
                              <div>
                                <span className="text-sm font-bold block">{acceptedApplicant.studentName}</span>
                                <span className="text-[10px] text-slate-500 block">Mahasiswa Terpilih</span>
                              </div>
                            </div>
                            
                            {project.status === 'Menunggu Review' && (
                              <div className="flex gap-2">
                                <button onClick={() => { setRejectForm(project.id); setRejectReason(''); }} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Tolak & Banding</button>
                                <button onClick={() => onReviewProject(project.id, true)} className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Terima & Selesai</button>
                              </div>
                            )}
                          </div>
                          
                          {rejectForm === project.id && project.status === 'Menunggu Review' && (
                            <div className="mt-3">
                              <textarea 
                                className="w-full text-sm p-2 rounded-lg border border-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 mb-2" 
                                placeholder="Alasan penolakan / perbaikan yang diperlukan..."
                                rows="2"
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                              ></textarea>
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setRejectForm(null)} className="text-xs text-slate-500 hover:underline">Batal</button>
                                <button 
                                  onClick={() => { onReviewProject(project.id, false, rejectReason); setRejectForm(null); }}
                                  disabled={!rejectReason.trim()}
                                  className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                                >Kirim Banding</button>
                              </div>
                            </div>
                          )}

                          {project.status === 'Menunggu Banding' && project.banding && (
                             <div className="mt-3 bg-red-50 border border-red-100 p-3 rounded-lg text-xs text-red-700">
                               <p className="font-bold">Menunggu Respon Mahasiswa</p>
                               <p className="italic mt-1">Alasan Anda: "{project.banding.reason}"</p>
                             </div>
                          )}

                          {project.status === 'Banding Berlangsung' && project.banding && (
                             <div className="mt-3 bg-purple-50 border border-purple-100 p-3 rounded-lg text-xs text-purple-700">
                               <p className="font-bold">Banding Sedang Diproses</p>
                               <p className="italic mt-1">Mahasiswa menjawab: "{project.banding.studentResponse}"</p>
                               <p className="mt-1 text-[10px]">Tim Admin GigSkill sedang meninjau kasus ini.</p>
                             </div>
                          )}
                        </div>
                      );
                    })()}

                    <button onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)} className="text-blue-600 text-sm font-bold flex items-center hover:underline">
                      {expandedProject === project.id ? 'Sembunyikan Pelamar' : 'Lihat Daftar Pelamar'}
                      <ChevronDown size={16} className={`ml-1 transition-transform ${expandedProject === project.id ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedProject === project.id && (
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        {project.applicants.length === 0 ? (
                          <p className="text-center text-slate-500 text-sm py-4 bg-slate-50 rounded-xl">Belum ada yang melamar.</p>
                        ) : (
                          <div className="space-y-4">
                            {project.applicants.map((applicant, idx) => {
                              const studentInfo = users.find(u => u.id === applicant.studentId);
                              return (
                                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                                        {applicant.studentName.charAt(0)}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <p className="font-bold text-slate-900">{applicant.studentName}</p>
                                          {applicant.status !== 'Menunggu' && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${applicant.status === 'Diterima' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                              {applicant.status}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-500">{studentInfo?.univ} â€¢ Melamar pada {applicant.date}</p>
                                      </div>
                                    </div>
                                    <button onClick={() => setShowStudentProfile(studentInfo)} className="text-xs font-bold text-blue-600 hover:underline">Lihat Profil Lengkap</button>
                                  </div>
                                  
                                  <div className="mt-3 bg-white p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                                    <span className="font-bold text-slate-700 block mb-1">Pesan / Proposal:</span>
                                    "{applicant.proposal}"
                                  </div>

                                  {applicant.status === 'Menunggu' && project.status === 'open' && (
                                    <div className="mt-4 flex gap-2 justify-end border-t border-slate-200 pt-3">
                                      <button onClick={() => handleStartChat(applicant.studentId, project.id)} className="text-xs bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl flex items-center">
                                        <MessageCircle size={14} className="mr-1.5" /> Chat
                                      </button>
                                      <button onClick={() => onUpdateApplicantStatus(project.id, applicant.studentId, 'Ditolak')} className="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl">
                                        Tolak
                                      </button>
                                      <button onClick={() => onUpdateApplicantStatus(project.id, applicant.studentId, 'Diterima')} className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl">
                                        Terima & Pilih
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'post' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Posting Project Baru</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onPostProject({
                title: formData.get('title'),
                category: formData.get('category') === 'Custom' ? formData.get('custom_category') : formData.get('category'),
                budget: formData.get('budget'),
                deadline: formData.get('deadline') === 'Custom' ? formData.get('custom_deadline') : formData.get('deadline'),
                desc: formData.get('desc'),
                tags: formData.get('tags') ? String(formData.get('tags')).split(',').map(s => s.trim()) : [],
                status: 'open',
                verified: true,
                applicants: []
              });
              e.target.reset();
              setActiveTab('project');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Judul Project</label>
                <input name="title" required type="text" placeholder="Cth: Desain Logo Toko" className="w-full p-3 rounded-xl border border-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                  <select 
                    name="category" 
                    onChange={e => setIsCustomCategory(e.target.value === 'Custom')}
                    required={!isCustomCategory} 
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white mb-2"
                  >
                    <option value="Desain">Desain</option>
                    <option value="Pemasaran">Pemasaran</option>
                    <option value="Administrasi">Administrasi</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {isCustomCategory && (
                    <input name="custom_category" required type="text" placeholder="Masukkan kategori..." className="w-full p-3 rounded-xl border border-slate-200" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Budget (Rp)</label>
                  <input name="budget" required type="number" placeholder="Cth: 150000" className="w-full p-3 rounded-xl border border-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Deadline</label>
                  <select 
                    name="deadline" 
                    onChange={e => setIsCustomDeadline(e.target.value === 'Custom')}
                    required={!isCustomDeadline} 
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white mb-2"
                  >
                    <option value="1 Hari">1 Hari</option>
                    <option value="3 Hari">3 Hari</option>
                    <option value="1 Minggu">1 Minggu</option>
                    <option value="2 Minggu">2 Minggu</option>
                    <option value="1 Bulan">1 Bulan</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {isCustomDeadline && (
                    <input name="custom_deadline" required type="text" placeholder="Masukkan deadline custom... (Cth: 10 Hari)" className="w-full p-3 rounded-xl border border-slate-200" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tags (Pisahkan koma)</label>
                  <input name="tags" type="text" placeholder="Logo, Figma" className="w-full p-3 rounded-xl border border-slate-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Project</label>
                <textarea name="desc" required rows="4" placeholder="Ceritakan detail project yang ingin dikerjakan..." className="w-full p-3 rounded-xl border border-slate-200"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all">
                Posting Project
              </button>
            </form>
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold">
                  <Store size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h2>
                  <p className="text-slate-500 font-medium">{currentUser.category || 'Kategori Usaha'}</p>
                  <div className="flex items-center mt-2 space-x-3">
                    {currentUser.verified ? <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md"><CheckCircle2 size={14} className="mr-1" /> Terverifikasi</span> : <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">Menunggu Verifikasi</span>}
                    <span className="text-xs font-bold text-slate-500 flex items-center"><Briefcase size={14} className="mr-1"/> {myProjects.length} Project</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowEditProfile(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors">
                Edit Profil
              </button>
            </div>
            
            <div className="space-y-8 border-t border-slate-100 pt-8">
              <div>
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">Tentang Usaha</h3>
                <p className="text-slate-700 leading-relaxed">{currentUser.desc || 'Belum ada deskripsi usaha.'}</p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">Kontak</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block">
                  <p className="text-sm font-bold text-slate-700 flex items-center mb-2"><Phone size={16} className="mr-2 text-slate-400" /> {currentUser.phone || '-'}</p>
                  <p className="text-sm font-bold text-slate-700 flex items-center"><Mail size={16} className="mr-2 text-slate-400" /> {currentUser.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function DompetView({ role, currentUser, onRequestTransaction, transactions }) {
  const [showModal, setShowModal] = React.useState(null);
  const [amount, setAmount] = React.useState('');
  const [accountDetail, setAccountDetail] = React.useState('');
  const myTransactions = transactions.filter(t => t.userId === currentUser.id);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !accountDetail) return;
    onRequestTransaction(role === 'umkm' ? 'topup' : 'withdraw', amount, accountDetail);
    setAmount('');
    setAccountDetail('');
    setShowModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <DollarSign size={120} />
        </div>
        <p className="text-slate-400 font-bold mb-2">Total Saldo Aktif</p>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8">{formatRupiah(currentUser.balance || 0)}</h2>
        <div className="flex gap-4 relative z-10">
          {role === 'umkm' && (
            <button
              onClick={() => setShowModal('topup')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Isi Saldo (Top Up)
            </button>
          )}
          {role === 'student' && (
            <button
              onClick={() => setShowModal('withdraw')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center"
            >
              <ArrowRight size={20} className="mr-2" />
              Tarik Dana
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center">
          <Clock size={20} className="mr-2 text-slate-400" />
          Riwayat Transaksi
        </h3>
        
        {myTransactions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CreditCard size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Belum ada riwayat transaksi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myTransactions.map(tx => (
              <div key={tx.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{tx.type === 'topup' ? 'Top Up' : 'Withdraw'} <span className="text-xs bg-slate-200 px-2 rounded-full">{tx.status}</span></p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
                <p className={`font-extrabold ${tx.type === 'topup' ? 'text-blue-600' : 'text-slate-700'}`}>
                   {tx.type === 'withdraw' ? '-' : '+'} Rp {Number(tx.amount).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {showModal === 'topup' ? 'Top Up Saldo' : 'Tarik Dana'}
              </h2>
              <button onClick={() => setShowModal(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={20} />
              </button>
            </div>
            
            {showModal === 'topup' ? (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
                <p className="font-bold mb-1">Transfer Manual</p>
                <p>Silakan transfer ke rekening admin di bawah ini, lalu ajukan nominal top up:</p>
                <div className="mt-3 font-mono bg-white p-2 rounded font-bold text-lg text-center border border-amber-200">
                  BCA 123-456-7890 (Admin GigSkill)
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-800">
                <p className="font-bold mb-1">Penarikan Dana</p>
                <p>Dana akan ditransfer ke rekening bank / e-wallet yang terdaftar. Proses penarikan manual membutuhkan waktu 1x24 jam.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Contoh: 50000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {showModal === 'topup' ? 'Rekening Anda' : 'Rekening Tujuan'}
                </label>
                <input
                  type="text"
                  required
                  value={accountDetail}
                  onChange={(e) => setAccountDetail(e.target.value)}
                  placeholder="BCA 123456 a/n Joko"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-md"
              >
                Ajukan {showModal === 'topup' ? 'Top Up' : 'Penarikan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({
  onLogout,
  showToast, users, setUsers, projects, setProjects, transactions, setTransactions }) {
  const [activeTab, setActiveTab] = React.useState('verifikasi');

  const pendingStudents = users.filter(u => u.role === 'student' && !u.verified);
  const pendingUMKMs = users.filter(u => u.role === 'umkm' && !u.verified);
  const pendingTransactions = transactions.filter(t => t.status === 'Menunggu');
  const bandingProjects = projects.filter(p => p.status === 'Banding Berlangsung');

  const handleVerifyUser = (userId, isApproved) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, verified: isApproved, verificationStatus: isApproved ? 'Approved' : 'Rejected' };
      }
      return u;
    }));
    showToast(isApproved ? 'Verifikasi disetujui.' : 'Verifikasi ditolak.');
  };

  const handleVerifyTransaction = (txId, isApproved) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'Menunggu') return;
    
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) return { ...t, status: isApproved ? 'Disetujui' : 'Ditolak' };
      return t;
    }));

    if (isApproved) {
      setUsers(prev => prev.map(u => {
        if (u.id === tx.userId) {
          const change = tx.type === 'withdraw' ? -Number(tx.amount) : Number(tx.amount);
          return { ...u, balance: (u.balance || 0) + change };
        }
        return u;
      }));
    }
    showToast(isApproved ? 'Transaksi disetujui.' : 'Transaksi ditolak.');
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-blue-600" />
            <h2 className="text-2xl font-extrabold text-slate-900">Admin GigSkill Dashboard</h2>
          </div>
          <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            <span className="hidden md:inline">Keluar Akun</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {['verifikasi', 'keuangan', 'moderasi'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-bold text-sm capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-200 border border-slate-200'}`}
            >
              {tab === 'verifikasi' ? 'Verifikasi Akun' : tab === 'keuangan' ? 'Transaksi Keuangan' : 'Mediasi / Banding'}
            </button>
          ))}
        </div>

        {activeTab === 'verifikasi' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">Verifikasi Mahasiswa (KTM)</h3>
              {pendingStudents.length === 0 ? <p className="text-sm text-slate-500">Tidak ada permintaan.</p> : pendingStudents.map(u => (
                <div key={u.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-3">
                  <p className="font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.univ}</p>
                  <div className="my-2 p-2 bg-slate-200 text-xs text-center rounded text-slate-500 italic">[Mockup KTM Image]</div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleVerifyUser(u.id, false)} className="flex-1 text-xs font-bold bg-white text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50">Tolak</button>
                    <button onClick={() => handleVerifyUser(u.id, true)} className="flex-1 text-xs font-bold bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Setujui</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">Verifikasi UMKM</h3>
              {pendingUMKMs.length === 0 ? <p className="text-sm text-slate-500">Tidak ada permintaan.</p> : pendingUMKMs.map(u => (
                <div key={u.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-3">
                  <p className="font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.category} - {u.phone}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleVerifyUser(u.id, false)} className="flex-1 text-xs font-bold bg-white text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50">Tolak</button>
                    <button onClick={() => handleVerifyUser(u.id, true)} className="flex-1 text-xs font-bold bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Setujui</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'keuangan' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Permintaan Transaksi</h3>
            {pendingTransactions.length === 0 ? <p className="text-sm text-slate-500">Tidak ada transaksi tertunda.</p> : pendingTransactions.map(tx => (
              <div key={tx.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-3 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="font-bold text-slate-800">{tx.type === 'topup' ? 'Top Up' : 'Withdraw'}</p>
                  <p className="text-sm text-slate-600">{tx.userName} ({tx.userRole})</p>
                  <p className="text-xs text-slate-500 mt-1">Metode/Rek: {tx.accountDetails}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-blue-600 text-lg mb-2">Rp {tx.amount.toLocaleString('id-ID')}</p>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleVerifyTransaction(tx.id, false)} className="text-xs font-bold bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50">Tolak</button>
                    <button onClick={() => handleVerifyTransaction(tx.id, true)} className="text-xs font-bold bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Setujui</button>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}

function ChatView({ currentUser, users, role, messages, setMessages, initialActiveChat, activeChatContext, projects, setActiveChatContext, isChatOpen, onClose }) {
  const [activeChat, setActiveChat] = React.useState(initialActiveChat);
  const [messageText, setMessageText] = React.useState('');
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (initialActiveChat) {
      setActiveChat(initialActiveChat);
    }
  }, [initialActiveChat]);

  if (!isChatOpen) return null;

  const getPartnerId = (chatId) => {
    if (!chatId) return null;
    const parts = chatId.split('_');
    return parts[1] === currentUser.id ? parts[2] : parts[1];
  };

  const getProjectId = (chatId) => {
    if (!chatId) return null;
    const parts = chatId.split('_');
    return parts[3] || null;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;
    const projectId = getProjectId(activeChat);
    const newMsg = {
      id: 'm_' + Date.now(),
      chatId: activeChat,
      senderId: currentUser.id,
      text: messageText,
      timestamp: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
      projectId: projectId || undefined
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageText('');
  };

  const activePartner = activeChat ? users.find(u => u.id === getPartnerId(activeChat)) : null;
  const activeProject = activeChatContext ? projects.find(p => p.id === activeChatContext) : null;
  
  // Array of safe messages
  const safeMessages = Array.isArray(messages) ? messages : [];
  const activeMessages = safeMessages.filter(m => m.chatId === activeChat);

  // Build distinct chat list based on messages and activeChat
  const chatIds = new Set();
  safeMessages.forEach(m => {
    if (m.chatId && m.chatId.includes(currentUser.id)) {
      chatIds.add(m.chatId);
    }
  });
  if (activeChat) chatIds.add(activeChat);
  
  const chatList = Array.from(chatIds).sort((a, b) => {
    const msgA = safeMessages.filter(m => m.chatId === a).pop();
    const msgB = safeMessages.filter(m => m.chatId === b).pop();
    if (!msgA) return -1;
    if (!msgB) return 1;
    return msgB.id.localeCompare(msgA.id);
  });

  return (
    <div className={`fixed z-[150] bg-white shadow-2xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
      isFullscreen 
        ? 'inset-0 w-full h-[100dvh] rounded-none' 
        : 'bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[420px] h-[75vh] md:h-[600px] md:max-h-[80vh] rounded-t-3xl md:rounded-3xl border-t md:border border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]'
    }`}>
      {/* Header for Mobile or Fullscreen */}
      <div className={`${activeChat ? 'hidden' : 'flex'} md:hidden p-4 border-b border-slate-200 bg-white justify-between items-center shrink-0`}>
        <h2 className="font-extrabold text-slate-800">Pesan</h2>
        <div className="flex gap-2">
           {isFullscreen ? (
                    <button type="button" onClick={() => setIsFullscreen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                      <span className="text-sm font-bold hidden md:inline">Kecilkan</span><span className="text-sm font-bold md:hidden">â†“</span>
                    </button>
                 ) : (
                    <button type="button" onClick={() => setIsFullscreen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                      <span className="text-xs font-bold hidden md:inline">Perbesar</span><span className="text-xs font-bold md:hidden">â¤¢</span>
                    </button>
                 )}
           <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
        </div>
      </div>

      <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-slate-200 flex-col bg-slate-50`}>
        <div className="hidden md:flex p-4 border-b border-slate-200 bg-white justify-between items-center shrink-0">
          <h2 className="font-extrabold text-slate-800">Pesan</h2>
          <div className="flex gap-1">
             {isFullscreen ? (
                    <button type="button" onClick={() => setIsFullscreen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                      <span className="text-sm font-bold hidden md:inline">Kecilkan</span><span className="text-sm font-bold md:hidden">â†“</span>
                    </button>
                 ) : (
                    <button type="button" onClick={() => setIsFullscreen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                      <span className="text-xs font-bold hidden md:inline">Perbesar</span><span className="text-xs font-bold md:hidden">â¤¢</span>
                    </button>
                 )}
             <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatList.map(chatId => {
            const partner = users.find(u => u.id === getPartnerId(chatId));
            if (!partner) return null;
            const project = projects.find(p => p.id === getProjectId(chatId));
            const lastMsg = safeMessages.filter(m => m.chatId === chatId).pop();
            return (
              <div 
                key={chatId}
                onClick={() => { setActiveChat(chatId); setActiveChatContext(getProjectId(chatId)); }}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${activeChat === chatId ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-100 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{partner.name}</h4>
                  {lastMsg && <span className="text-[10px] text-slate-400 shrink-0 ml-2">{lastMsg.timestamp}</span>}
                </div>
                {project && <p className="text-[10px] font-bold text-blue-600 mb-1 line-clamp-1">{project.title}</p>}
                <p className="text-xs text-slate-500 line-clamp-1">{lastMsg ? lastMsg.text : 'Mulai percakapan'}</p>
              </div>
            );
          })}
          {chatList.length === 0 && (
             <div className="p-6 text-center text-slate-400 text-sm">Belum ada percakapan.</div>
          )}
        </div>
      </div>
      
      <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 flex-col bg-slate-50 relative`}>
        {activeChat && activePartner ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-20 shrink-0">
              <div className="flex items-center gap-3">
                <button type="button" className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setActiveChat(null)}>
                  <span className="text-sm font-bold">â†</span>
                </button>
                <div>
                  <h3 className="font-extrabold text-slate-900 truncate">{activePartner.name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{activePartner.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                 {isFullscreen ? (
                    <button type="button" onClick={() => setIsFullscreen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                      <span className="text-sm font-bold hidden md:inline">Kecilkan</span><span className="text-sm font-bold md:hidden">â†“</span>
                    </button>
                 ) : (
                    <button type="button" onClick={() => setIsFullscreen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                      <span className="text-xs font-bold hidden md:inline">Perbesar</span><span className="text-xs font-bold md:hidden">â¤¢</span>
                    </button>
                 )}
                 <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
              </div>
            </div>
            
            {activeChatContext && activeProject && (
              <div className="bg-white border-b border-slate-200 p-3 flex justify-between items-center shadow-sm z-10 shrink-0">
                <div className="truncate pr-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Konteks Project</p>
                  <p className="text-sm font-bold text-blue-700 leading-tight truncate">{activeProject.title}</p>
                  <div className="flex gap-2 text-[10px] text-slate-600 mt-1 font-bold">
                    <span>Rp {Number(activeProject.budget).toLocaleString('id-ID')}</span>
                    <span>â€¢</span>
                    <span className="capitalize">{activeProject.status}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setActiveChatContext(null)} 
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <MessageCircle size={48} className="text-slate-200" />
                  <p className="text-sm">Belum ada pesan.</p>
                </div>
              ) : (
                activeMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm ${msg.senderId === currentUser.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <p className={`text-[10px] mt-1 text-right ${msg.senderId === currentUser.id ? 'text-blue-200' : 'text-slate-400'}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Ketik pesan..." 
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <MessageCircle size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium">Pilih percakapan untuk mulai chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Footer({ onOpenPopup }) {
  return (
    <footer className="bg-[#0f172a] text-slate-400 py-12 px-6 md:px-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center">
            Gig<span className="text-blue-500">Skill</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Empowering Students & Local Businesses.</p>
        </div>
        
        <div className="flex items-center space-x-6 text-sm font-bold text-slate-300">
          <button onClick={() => onOpenPopup('tentang')} className="hover:text-blue-400 transition-colors">Tentang Kami</button>
          <button onClick={() => onOpenPopup('panduan')} className="hover:text-blue-400 transition-colors">Panduan</button>
          <button onClick={() => onOpenPopup('syarat')} className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</button>
        </div>

        <div className="text-sm font-medium text-slate-500">
          &copy; 2026 GigSkill.web.id Platform
        </div>
      </div>
    </footer>
  );
}
