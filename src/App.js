import React, { useState } from 'react';
import {
  Menu,
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
    name: 'Joko Subianto (demo)',
    email: 'jokosubianto@student.com',
    password: '123',
    univ: 'unpam'
  },
  {
    id: 'u2',
    role: 'umkm',
    name: 'Toko Kue Ibu Tin',
    email: 'toko@ibu.com',
    password: '123',
    phone: '08123456789'
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
    desc: 'Kami membutuhkan desain logo baru yang minimalis dan banner untuk ditaruh di depan toko fisik kami.',
    tags: ['Graphic Design', 'Illustrator'],
    verified: true,
    applicants: []
  },
  {
    id: 'p2',
    umkmId: 'dummy',
    umkmName: "Hijab Syar'i Butik",
    title: 'Admin Instagram untuk 1 Minggu',
    budget: '250000',
    deadline: '7 Hari',
    desc: 'Tugas meliputi upload feed 1x sehari, membalas DM/Komen, dan buat 3 reels sederhana.',
    tags: ['Social Media', 'Copywriting'],
    verified: true,
    applicants: []
  }
];

const initialMessages = {
  'chat_u1_u2': [
    { id: 1, senderId: 'u1', text: 'Halo kak, saya tertarik dengan project desain logo yang diposting. Boleh saya tanya-tanya?', time: '10:00' },
    { id: 2, senderId: 'u2', text: 'Halo Joko! Boleh, silakan, mau tanya apa?', time: '10:05' },
  ]
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [users, setUsers] = useState(initialUsers);
  const [projects, setProjects] = useState(initialProjects);
  const [messages, setMessages] = React.useState(() => {
    const saved = localStorage.getItem('gigskill_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  React.useEffect(() => {
    localStorage.setItem('gigskill_messages', JSON.stringify(messages));
  }, [messages]);
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
    setToast({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        type: 'success'
      });
    }, 3000);
  };

  const handleRegister = (userData) => {
    const newId = 'u_' + Date.now();

    const newUser = {
      ...userData,
      id: newId
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
      ...projectData,
      id: 'p_' + Date.now(),
      umkmId: currentUser.id,
      umkmName: currentUser.name,
      verified: true,
      tags: ['New'],
      applicants: []
    };

    setProjects([newProject, ...projects]);

    showToast('Project berhasil diposting!', 'success');
  };

  const handleApplyProject = (projectId) => {
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      return;
    }

    if (
      project.applicants.find(
        (a) => a.studentId === currentUser.id
      )
    ) {
      showToast(
        'Anda sudah melamar project ini sebelumnya.',
        'error'
      );
      return;
    }

    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          applicants: [
            ...p.applicants,
            {
              studentId: currentUser.id,
              studentName: currentUser.name,
              date: new Date().toLocaleDateString('id-ID')
            }
          ]
        };
      }

      return p;
    });

    setProjects(updatedProjects);

    showToast(
      'Berhasil melamar project! Menunggu persetujuan UMKM.',
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {toast.show && (
        <div className="fixed top-5 right-5 z-[200]">
          <div
            className={
              'flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg border ' +
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

      <Navbar
        navigateTo={navigateTo}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

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
            <StudentDashboard
              currentUser={currentUser}
              users={users}
              projects={projects}
              onApply={handleApplyProject}
              messages={messages}
              setMessages={setMessages}
            />
          )}

        {currentPage === 'umkmDashboard' &&
          currentUser?.role === 'umkm' && (
            <UMKMDashboard
              currentUser={currentUser}
              users={users}
              projects={projects}
              onPostProject={handlePostProject}
              messages={messages}
              setMessages={setMessages}
            />
          )}

        {currentPage === 'adminDashboard' &&
          currentUser?.role === 'admin' && (
            <AdminDashboard showToast={showToast} />
          )}
      </main>

      <Footer />
    </div>
  );
}

function Navbar({
  navigateTo,
  currentUser,
  handleLogout
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

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
            onClick={() => navigateTo('landing')}
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
                <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <div
                    className={
                      'w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ' +
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

                    <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Keluar"
                >
                  <LogOut size={20} />
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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-slate-50">
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
                placeholder="••••••••"
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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-slate-50">
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
  currentUser,
  users,
  projects,
  onApply,
  messages,
  setMessages
}) {
  const [activeTab, setActiveTab] =
    useState('cari');
  const [activeChatId, setActiveChatId] = useState(null);

  const handleStartChat = (umkmId) => {
    setActiveChatId(`chat_${currentUser.id}_${umkmId}`);
    setActiveTab('pesan');
    setSelectedProject(null);
  };

  const [selectedProject, setSelectedProject] =
    useState(null);

  const myApplications = projects.filter((p) =>
    p.applicants.some(
      (a) => a.studentId === currentUser.id
    )
  );

  const handleApplyClick = () => {
    onApply(selectedProject.id);
    setSelectedProject(null);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Mencari Pelamar
                </span>

                <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
                  {selectedProject.title}
                </h2>

                <div className="flex items-center mt-2 text-sm font-bold text-slate-500">
                  <span>
                    {selectedProject.umkmName}
                  </span>

                  {selectedProject.verified && (
                    <CheckCircle2
                      size={16}
                      className="ml-2 text-blue-500"
                    />
                  )}
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedProject(null)
                }
                className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">
              {selectedProject.desc}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-green-700 mb-1">
                  Budget
                </p>
                <p className="text-lg font-extrabold text-green-700">
                  {formatRupiah(
                    selectedProject.budget
                  )}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-500 mb-1">
                  Deadline
                </p>

                <p className="text-lg font-extrabold text-slate-700">
                  {selectedProject.deadline}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApplyClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all"
              >
                Kirim Lamaran
              </button>
              <button
                onClick={() => handleStartChat(selectedProject.umkmId)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold transition-all border border-slate-200 flex items-center justify-center"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Mahasiswa
          </h1>

          <div className="flex items-center mt-2 space-x-2">
            <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
              {currentUser.univ ||
                'Universitas'}
            </span>

            <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md">
              <CheckCircle2
                size={14}
                className="mr-1"
              />
              Terverifikasi
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 min-w-[220px]">
          <div className="bg-green-100 p-3 rounded-xl">
            <DollarSign
              size={24}
              className="text-green-600"
            />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              Penghasilan Aktif
            </p>

            <p className="text-2xl font-extrabold text-slate-900 leading-none">
              Rp 0
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-3 space-y-1.5 sticky top-24">
            <button
              onClick={() =>
                setActiveTab('cari')
              }
              className={
                'w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ' +
                (activeTab === 'cari'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100')
              }
            >
              <Search size={18} />
              <span>Cari Project</span>
            </button>

            <button
              onClick={() =>
                setActiveTab('lamaran')
              }
              className={
                'w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ' +
                (activeTab === 'lamaran'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100')
              }
            >
              <FileText size={18} />

              <span>
                Lamaran Saya
                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                  {myApplications.length}
                </span>
              </span>
            </button>

            <button
              onClick={() =>
                setActiveTab('profil')
              }
              className={
                'w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ' +
                (activeTab === 'profil'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100')
              }
            >
              <User size={18} />
              <span>Profil & Portfolio</span>
            </button>

            <button
              onClick={() =>
                setActiveTab('dompet')
              }
              className={
                'w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ' +
                (activeTab === 'dompet'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100')
              }
            >
              <CreditCard size={18} />
              <span>Dompet Saya</span>
            </button>

            <button
              onClick={() =>
                setActiveTab('pesan')
              }
              className={
                'w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ' +
                (activeTab === 'pesan'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100')
              }
            >
              <MessageCircle size={18} />
              <span>Pesan</span>
            </button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'dompet' && (
            <DompetView role="student" />
          )}

          {activeTab === 'pesan' && (
            <ChatView 
              currentUser={currentUser} 
              users={users} 
              role="student" 
              messages={messages} 
              setMessages={setMessages} 
              initialActiveChat={activeChatId}
            />
          )}

          {activeTab === 'cari' && (
            <div className="space-y-6">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center">
                <Search
                  className="text-slate-400 ml-4 mr-2"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Cari project (desain, admin, web)..."
                  className="w-full p-2.5 outline-none text-sm font-medium text-slate-700 bg-transparent"
                />

                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                  Cari
                </button>
              </div>

              <div className="grid gap-4">
                {projects.map((project) => {
                  const hasApplied =
                    project.applicants.some(
                      (a) =>
                        a.studentId ===
                        currentUser.id
                    );

                  return (
                    <div
                      key={project.id}
                      onClick={() =>
                        !hasApplied &&
                        setSelectedProject(project)
                      }
                      className={
                        'bg-white p-6 rounded-2xl border transition-all group ' +
                        (hasApplied
                          ? 'border-slate-200 opacity-60 cursor-default'
                          : 'border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer')
                      }
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase">
                              {project.umkmName}
                            </span>

                            {project.verified && (
                              <CheckCircle2
                                size={14}
                                className="text-blue-500"
                              />
                            )}
                          </div>

                          <h3
                            className={
                              'text-xl font-extrabold text-slate-900 transition-colors ' +
                              (!hasApplied
                                ? 'group-hover:text-blue-600'
                                : '')
                            }
                          >
                            {project.title}
                          </h3>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <span className="block text-xl font-extrabold text-green-600">
                            {formatRupiah(
                              project.budget
                            )}
                          </span>

                          <span className="flex items-center justify-end text-xs font-bold text-slate-400 mt-1">
                            <Clock
                              size={12}
                              className="mr-1"
                            />
                            {project.deadline}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex gap-2 flex-wrap">
                          {project.tags.map(
                            (tag) => (
                              <span
                                key={tag}
                                className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg"
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>

                        {hasApplied && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-lg">
                            Sudah Dilamar
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'lamaran' && (
            <div className="space-y-4">
              {myApplications.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Briefcase size={32} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Belum ada project yang
                    dilamar
                  </h3>

                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    Mulai eksplorasi peluang
                    untuk membangun portofolio
                    Anda.
                  </p>

                  <button
                    onClick={() =>
                      setActiveTab('cari')
                    }
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800"
                  >
                    Cari Project Sekarang
                  </button>
                </div>
              ) : (
                myApplications.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          {project.umkmName}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900">
                        {project.title}
                      </h3>
                    </div>

                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200">
                      Menunggu Review UMKM
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'profil' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center space-x-6 mb-8 border-b border-slate-100 pb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-extrabold text-3xl">
                  {currentUser.name.charAt(0)}
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {currentUser.name}
                  </h2>

                  <p className="text-slate-500 font-medium">
                    {currentUser.email} •{' '}
                    {currentUser.univ}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                  <Star
                    size={18}
                    className="mr-2 text-amber-500"
                  />
                  Skill Saya
                </h3>

                <div className="flex gap-2 mb-8">
                  <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-sm font-bold border border-dashed border-slate-300 cursor-pointer hover:bg-slate-200">
                    + Tambah Skill
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UMKMDashboard({
  currentUser,
  users,
  projects,
  onPostProject,
  messages,
  setMessages
}) {
  const [activeTab, setActiveTab] =
    useState('project');
  const [activeChatId, setActiveChatId] = useState(null);

  const handleStartChat = (studentId) => {
    setActiveChatId(`chat_${studentId}_${currentUser.id}`);
    setActiveTab('pesan');
  };

  const [expandedProject, setExpandedProject] =
    useState(null);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] =
    useState('1-3 Hari');

  const myProjects = projects.filter(
    (p) => p.umkmId === currentUser.id
  );

  const handlePostSubmit = (e) => {
    e.preventDefault();

    onPostProject({
      title,
      desc,
      budget,
      deadline
    });

    setTitle('');
    setDesc('');
    setBudget('');
    setDeadline('1-3 Hari');
    setActiveTab('project');
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Dashboard UMKM
          </h1>

          <p className="text-slate-500 mt-2 font-medium">
            {currentUser.name} • Aktif
          </p>
        </div>

        <button
          onClick={() => setActiveTab('post')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Posting Project Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('project')}
            className={
              'px-6 py-4 font-bold text-sm border-b-2 transition-colors ' +
              (activeTab === 'project'
                ? 'border-green-600 text-green-700 bg-green-50/50'
                : 'border-transparent text-slate-500 hover:bg-slate-50')
            }
          >
            Project Aktif Anda ({myProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('post')}
            className={
              'px-6 py-4 font-bold text-sm border-b-2 transition-colors ' +
              (activeTab === 'post'
                ? 'border-green-600 text-green-700 bg-green-50/50'
                : 'border-transparent text-slate-500 hover:bg-slate-50')
            }
          >
            Buat Posting Baru
          </button>
          
          <button
            onClick={() => setActiveTab('dompet')}
            className={
              'px-6 py-4 font-bold text-sm border-b-2 transition-colors flex items-center ' +
              (activeTab === 'dompet'
                ? 'border-green-600 text-green-700 bg-green-50/50'
                : 'border-transparent text-slate-500 hover:bg-slate-50')
            }
          >
            <CreditCard size={18} className="mr-2" />
            Dompet Saya
          </button>
          
          <button
            onClick={() => setActiveTab('pesan')}
            className={
              'px-6 py-4 font-bold text-sm border-b-2 transition-colors flex items-center ' +
              (activeTab === 'pesan'
                ? 'border-green-600 text-green-700 bg-green-50/50'
                : 'border-transparent text-slate-500 hover:bg-slate-50')
            }
          >
            <MessageCircle size={18} className="mr-2" />
            Pesan
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'dompet' && (
            <DompetView role="umkm" />
          )}

          {activeTab === 'pesan' && (
            <ChatView 
              currentUser={currentUser} 
              users={users} 
              role="umkm" 
              messages={messages} 
              setMessages={setMessages} 
              initialActiveChat={activeChatId}
            />
          )}

          {activeTab === 'project' && (
            <div className="space-y-6">
              {myProjects.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 mb-4">
                    Anda belum memposting project
                    apapun.
                  </p>

                  <button
                    onClick={() =>
                      setActiveTab('post')
                    }
                    className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold"
                  >
                    Mulai Posting
                  </button>
                </div>
              ) : (
                myProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 bg-white shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest border border-amber-200">
                            Mencari Pelamar
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold text-slate-900">
                          {project.title}
                        </h3>

                        <p className="text-sm font-medium text-slate-500 mt-1">
                          Budget:{' '}
                          <span className="text-slate-700 font-bold">
                            {formatRupiah(
                              project.budget
                            )}
                          </span>{' '}
                          • Deadline:{' '}
                          <span className="text-slate-700 font-bold">
                            {project.deadline}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedProject(
                            expandedProject ===
                              project.id
                              ? null
                              : project.id
                          )
                        }
                        className={
                          'border px-6 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center space-x-2 ' +
                          (project.applicants.length >
                          0
                            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100')
                        }
                      >
                        <User size={18} />
                        <span>
                          Lihat Pelamar (
                          {project.applicants.length})
                        </span>
                      </button>
                    </div>

                    {expandedProject ===
                      project.id && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-700 mb-3">
                          Daftar Mahasiswa yang
                          Melamar:
                        </h4>

                        {project.applicants.length ===
                        0 ? (
                          <p className="text-xs text-slate-400 italic">
                            Belum ada mahasiswa
                            yang melamar project
                            ini.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {project.applicants.map(
                              (applicant, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                                      {applicant.studentName.charAt(
                                        0
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-sm font-bold text-slate-900">
                                        {
                                          applicant.studentName
                                        }
                                      </p>

                                      <p className="text-[10px] text-slate-500">
                                        Melamar pada{' '}
                                        {
                                          applicant.date
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleStartChat(applicant.studentId); 
                                      }} 
                                      className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center"
                                    >
                                      <MessageCircle size={14} className="mr-1" /> Chat
                                    </button>
                                    <button 
                                      onClick={(e) => e.stopPropagation()} 
                                      className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg"
                                    >
                                      Terima
                                    </button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex items-start space-x-4 mt-8">
                <div className="bg-white p-2.5 rounded-xl shadow-sm text-blue-600 shrink-0">
                  <MessageCircle size={24} />
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Tips Mendapatkan Talenta Terbaik
                  </h4>

                  <p className="text-xs font-medium text-slate-600 mt-1.5 leading-relaxed">
                    Saat memposting project,
                    deskripsikan kebutuhan Anda
                    sedetail mungkin. Beritahu
                    referensi agar mahasiswa bisa
                    mengukur kemampuannya sebelum
                    melamar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'post' && (
            <form
              onSubmit={handlePostSubmit}
              className="max-w-2xl mx-auto space-y-5"
            >
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                Detail Project Baru
              </h2>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Judul Project
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Contoh: Pembuatan Logo Toko Kue"
                  required
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Deskripsi Lengkap
                </label>

                <textarea
                  rows="4"
                  value={desc}
                  onChange={(e) =>
                    setDesc(e.target.value)
                  }
                  placeholder="Jelaskan secara detail apa yang Anda butuhkan..."
                  required
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Budget (Rp)
                  </label>

                  <input
                    type="number"
                    value={budget}
                    onChange={(e) =>
                      setBudget(e.target.value)
                    }
                    placeholder="150000"
                    required
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Deadline Pekerjaan
                  </label>

                  <select
                    required
                    value={deadline}
                    onChange={(e) =>
                      setDeadline(e.target.value)
                    }
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
                  >
                    <option value="1-3 Hari">
                      1-3 Hari
                    </option>

                    <option value="1 Minggu">
                      1 Minggu
                    </option>

                    <option value="2 Minggu">
                      2 Minggu
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md mt-4 transition-colors"
              >
                Posting Project Sekarang
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ showToast }) {
  const handleVerify = () => {
    showToast(
      'KTM berhasil diverifikasi! Akun mahasiswa telah aktif.',
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Admin Master Control
        </h1>

        <p className="text-slate-500 mt-2 font-medium">
          GigSkill System Administration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-4">
            Verifikasi KTM Tertunda (1)
          </h2>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Siti Aminah
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Universitas Pamulang
                </p>
              </div>

              <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded font-bold uppercase">
                Pending
              </span>
            </div>

            <div className="h-32 bg-slate-200 rounded-xl mb-4 flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
              [ Preview Gambar KTM ]
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleVerify}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
              >
                Setujui
              </button>

              <button
                onClick={() =>
                  showToast(
                    'Pengajuan KTM ditolak.',
                    'error'
                  )
                }
                className="flex-1 bg-white border border-slate-200 text-red-600 hover:bg-red-50 text-xs font-bold py-2 rounded-lg transition-colors"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-4">
            Verifikasi Pembayaran Manual (0)
          </h2>

          <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
            <CreditCard
              size={32}
              className="mb-2 opacity-50"
            />

            <p className="text-sm font-medium">
              Tidak ada transfer masuk yang perlu
              diverifikasi saat ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const [activeModal, setActiveModal] =
    useState(null);

  const [showRedirectConfirm, setShowRedirectConfirm] =
    useState(false);

  const driveLink =
    'https://drive.google.com/drive/folders/13lFplnmq2-m36dzozjo5wUHxnc8ozuCT';

  return (
    <>
      {activeModal === 'tentang' && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Tentang Kami
              </h2>

              <button
                onClick={() =>
                  setActiveModal(null)
                }
                className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-slate-700 leading-relaxed text-sm">
              <p>
                GigSkill adalah platform inovatif yang
                dirancang khusus untuk menjembatani
                mahasiswa Universitas Pamulang (UNPAM)
                dengan Usaha Mikro, Kecil, dan Menengah
                (UMKM) lokal. Misi kami adalah memberikan
                pengalaman kerja nyata (micro-credentials)
                bagi mahasiswa untuk membangun portofolio,
                sekaligus membantu UMKM melakukan
                transformasi digital dengan talenta lokal
                yang terjangkau.
              </p>

              <div
                onClick={() =>
                  setShowRedirectConfirm(true)
                }
                className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-900 mt-4 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} />
                  <h3 className="font-extrabold">
                    Project Tugas Bisnis Plan
                  </h3>
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <strong>
                      Mata Kuliah:
                    </strong>{' '}
                    Kewirausahaan
                  </p>

                  <p className="font-bold mt-3">
                    Oleh KELOMPOK 7:
                  </p>

                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      RIPKI MAULANA — 251010504293
                    </li>

                    <li>
                      MUHAMAD SOFIYAN — 251010502197
                    </li>

                    <li>
                      FARAH ZAFIRA ROSYADI — 251010502335
                    </li>

                    <li>
                      NAJMA NAURA TSABITA — 251010502277
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setActiveModal(null)
              }
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-6"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

      {activeModal === 'panduan' && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Panduan Penggunaan
              </h2>

              <button
                onClick={() =>
                  setActiveModal(null)
                }
                className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-slate-700 leading-relaxed text-sm mb-8">
              <ul className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Pendaftaran:</strong> Buat
                  akun sebagai Mahasiswa (wajib
                  melampirkan KTM) atau sebagai UMKM.
                </li>

                <li>
                  <strong>Eksplorasi & Posting:</strong>{' '}
                  Mahasiswa dapat mencari project. UMKM
                  dapat memposting kebutuhan mereka.
                </li>

                <li>
                  <strong>Proses Lamaran:</strong>{' '}
                  Mahasiswa mengirim lamaran, UMKM
                  memilih kandidat.
                </li>

                <li>
                  <strong>Pengerjaan:</strong> Kerjakan
                  project sesuai dengan kesepakatan
                  tenggat waktu.
                </li>

                <li>
                  <strong>Selesai:</strong> Setelah
                  disetujui, mahasiswa akan mendapatkan
                  ulasan.
                </li>
              </ul>
            </div>

            <button
              onClick={() =>
                setActiveModal(null)
              }
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

      {activeModal === 'syarat' && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Syarat & Ketentuan
              </h2>

              <button
                onClick={() =>
                  setActiveModal(null)
                }
                className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-slate-700 leading-relaxed text-sm mb-8 space-y-3">
              <p>
                1. <strong>Verifikasi:</strong>{' '}
                Mahasiswa wajib melampirkan KTM aktif.
                UMKM harus memberi data valid.
              </p>

              <p>
                2. <strong>Kewajiban:</strong> UMKM
                wajib memberikan deskripsi tugas dan
                besaran budget yang jelas.
              </p>

              <p>
                3. <strong>Transaksi:</strong> Segala
                bentuk transaksi keuangan di luar
                pantauan platform bukan tanggung jawab
                kami.
              </p>

              <p>
                4. <strong>Sanksi:</strong> GigSkill
                berhak memblokir akun yang terindikasi
                melakukan pelanggaran.
              </p>
            </div>

            <button
              onClick={() =>
                setActiveModal(null)
              }
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

      {showRedirectConfirm && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          onClick={() => setShowRedirectConfirm(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <FileText size={32} />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Buka Makalah Project?
            </h3>

            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Anda akan diarahkan ke tab baru
              (Google Drive) untuk melihat isi dokumen
              makalah dari project GigSkill ini.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setShowRedirectConfirm(false)
                }
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  window.open(
                    driveLink,
                    '_blank'
                  );
                  setShowRedirectConfirm(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Ya, Buka
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-white font-extrabold text-2xl tracking-tight mb-1">
              Gig<span className="text-blue-500">Skill</span>
            </span>

            <span className="text-slate-400 font-medium text-xs">
              Empowering Students & Local Businesses.
            </span>
          </div>

          <div className="flex flex-wrap justify-center space-x-6 font-bold text-slate-400">
            <button
              onClick={() =>
                setActiveModal('tentang')
              }
              className="hover:text-white transition-colors"
            >
              Tentang Kami
            </button>

            <button
              onClick={() =>
                setActiveModal('panduan')
              }
              className="hover:text-white transition-colors"
            >
              Panduan
            </button>

            <button
              onClick={() =>
                setActiveModal('syarat')
              }
              className="hover:text-white transition-colors"
            >
              Syarat & Ketentuan
            </button>
          </div>

          <div className="text-slate-500 font-medium text-xs">
            &copy; 2026 GigSkill.web.id Platform
          </div>
        </div>
      </footer>
    </>
  );
}
function DompetView({ role }) {
  const [showModal, setShowModal] = useState(null);
  const [amount, setAmount] = useState('');

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Permintaan ${showModal === 'topup' ? 'Top Up' : 'Penarikan'} sebesar ${formatRupiah(amount)} berhasil diajukan dan menunggu konfirmasi admin.`);
    setShowModal(null);
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <DollarSign size={120} />
        </div>
        <p className="text-slate-400 font-bold mb-2">Total Saldo Aktif</p>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8">{formatRupiah(0)}</h2>
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
        
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <CreditCard size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Belum ada riwayat transaksi.</p>
        </div>
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

              {showModal === 'topup' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bukti Transfer (Opsional)</label>
                  <input
                    type="file"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              )}

              {showModal === 'withdraw' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Rekening Tujuan / E-Wallet</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BCA 987654321 a/n Budi"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3.5 mt-2 rounded-xl font-bold text-white transition-all ${showModal === 'topup' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Kirim Permintaan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
function ChatView({ currentUser, users, role, messages, setMessages, initialActiveChat }) {
  const [activeChat, setActiveChat] = useState(initialActiveChat || null);
  const [newMessage, setNewMessage] = useState('');

  React.useEffect(() => {
    if (initialActiveChat) {
      setActiveChat(initialActiveChat);
    }
  }, [initialActiveChat]);

  // Generate chat list based on messages object
  const chatList = [];
  Object.keys(messages).forEach(chatId => {
    const parts = chatId.split('_');
    if (parts.length === 3 && parts[0] === 'chat') {
      const studentId = parts[1];
      const umkmId = parts[2];
      
      let partnerId = null;
      if (role === 'student' && currentUser.id === studentId) {
        partnerId = umkmId;
      } else if (role === 'umkm' && currentUser.id === umkmId) {
        partnerId = studentId;
      }
      
      if (partnerId) {
        const partner = users.find(u => u.id === partnerId);
        const chatMessages = messages[chatId] || [];
        const lastMsg = chatMessages[chatMessages.length - 1];
        chatList.push({
          id: chatId,
          partnerId: partnerId,
          partnerName: partner ? partner.name : 'Unknown User',
          lastMessage: lastMsg ? lastMsg.text : 'Belum ada pesan',
          unread: 0
        });
      }
    }
  });

  // If initialActiveChat is provided but not in chatList yet, add a placeholder
  if (initialActiveChat && !chatList.find(c => c.id === initialActiveChat)) {
    const parts = initialActiveChat.split('_');
    const partnerId = role === 'student' ? parts[2] : parts[1];
    const partner = users.find(u => u.id === partnerId);
    chatList.push({
      id: initialActiveChat,
      partnerId: partnerId,
      partnerName: partner ? partner.name : 'Unknown User',
      lastMessage: 'Belum ada pesan',
      unread: 0
    });
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const newMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg]
    }));
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex h-[600px]">
      {/* Chat List - Sidebar */}
      <div className={`w-full md:w-1/3 border-r border-slate-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-extrabold text-slate-900">Pesan Masuk</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatList.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 flex items-start gap-3 ${activeChat === chat.id ? 'bg-blue-50/50' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">
                {chat.partnerName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-slate-900 truncate text-sm">{chat.partnerName}</h4>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full md:w-2/3 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-3">
              <button 
                onClick={() => setActiveChat(null)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center font-bold">
                {chatList.find(c => c.id === activeChat)?.partnerName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{chatList.find(c => c.id === activeChat)?.partnerName}</h3>
                <p className="text-xs text-slate-500">Online</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
              {(messages[activeChat] || []).map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan..." 
                  className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2.5 text-sm transition-all"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl px-4 py-2.5 transition-all flex items-center justify-center"
                >
                  <MessageCircle size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={40} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-500">Pilih pesan untuk mulai mengobrol</p>
            <p className="text-sm mt-1">Diskusikan detail project sebelum membuat kesepakatan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
