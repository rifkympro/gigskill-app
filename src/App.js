import React, { useState } from 'react';
import { 
  Menu, X, Search, Briefcase, GraduationCap, 
  Clock, CheckCircle2, User, FileText, 
  DollarSign, MessageCircle, Mail, Lock, Phone, Building, 
  Store, LogOut, Plus, ChevronDown, 
  XCircle, ArrowRight, ShieldCheck, CreditCard, Star
} from 'lucide-react';

const initialUsers = [
  { id: 'u1', role: 'student', name: 'Joko Subianto (demo)', email: 'jokosubianto@student.com', password: '123', univ: 'unpam' },
  { id: 'u2', role: 'umkm', name: 'Toko Kue Ibu Tin', email: 'toko@ibu.com', password: '123', phone: '08123456789' },
  { id: 'u3', role: 'admin', name: 'Super Admin', email: 'admin@gigskill.com', password: '123' }
];

const initialProjects = [
  { id: 'p1', umkmId: 'u2', umkmName: 'Toko Kue Ibu Tin', title: 'Desain Logo & Banner Toko Kue', budget: '150000', deadline: '3 Hari', desc: 'Kami membutuhkan desain logo baru yang minimalis dan banner untuk ditaruh di depan toko fisik kami.', tags: ['Graphic Design', 'Illustrator'], verified: true, applicants: [] },
  { id: 'p2', umkmId: 'dummy', umkmName: "Hijab Syar'i Butik", title: 'Admin Instagram untuk 1 Minggu', budget: '250000', deadline: '7 Hari', desc: 'Tugas meliputi upload feed 1x sehari, membalas DM/Komen, dan buat 3 reels sederhana.', tags: ['Social Media', 'Copywriting'], verified: true, applicants: [] },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing'); 
  const [users, setUsers] = useState(initialUsers);
  const [projects, setProjects] = useState(initialProjects);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, type) => {
    setToast({ show: true, message: message, type: type || 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleRegister = (userData) => {
    const newId = "u_" + Date.now();
    const newUser = { ...userData, id: newId };
    setUsers([...users, newUser]);
    const roleName = userData.role === 'student' ? 'Mahasiswa' : 'UMKM';
    showToast("Pendaftaran " + roleName + " Berhasil! Silakan login.", "success");
    setTimeout(() => navigateTo('login'), 1500);
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'student') navigateTo('studentDashboard');
      if (user.role === 'umkm') navigateTo('umkmDashboard');
      if (user.role === 'admin') navigateTo('adminDashboard');
      showToast("Selamat datang, " + user.name + "!", "success");
    } else {
      showToast("Email atau password salah!", "error");
    }
  };

  const handleQuickLogin = (role) => {
    const user = users.find(u => u.role === role);
    if(user) handleLogin(user.email, user.password);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('landing');
    showToast("Berhasil keluar dari akun", "success");
  };

  const handlePostProject = (projectData) => {
    const newProject = {
      ...projectData,
      id: "p_" + Date.now(),
      umkmId: currentUser.id,
      umkmName: currentUser.name,
      verified: true,
      tags: ["New"],
      applicants: []
    };
    setProjects([newProject, ...projects]);
    showToast("Project berhasil diposting!", "success");
  };

  const handleApplyProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project.applicants.find(a => a.studentId === currentUser.id)) {
      showToast("Anda sudah melamar project ini sebelumnya.", "error");
      return;
    }
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          applicants: [...p.applicants, { studentId: currentUser.id, studentName: currentUser.name, date: new Date().toLocaleDateString() }]
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    showToast("Berhasil melamar project! Menunggu persetujuan UMKM.", "success");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {toast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={"flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg border " + (toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700')}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <Navbar navigateTo={navigateTo} currentUser={currentUser} handleLogout={handleLogout} />
      
      <main className="flex-grow flex flex-col relative">
        {currentPage === 'landing' && <LandingPage navigateTo={navigateTo} />}
        {currentPage === 'login' && <LoginPage handleLogin={handleLogin} handleQuickLogin={handleQuickLogin} navigateTo={navigateTo} />}
        {currentPage === 'register' && <RegisterPage onRegister={handleRegister} navigateTo={navigateTo} />}
        {currentPage === 'studentDashboard' && currentUser?.role === 'student' && <StudentDashboard currentUser={currentUser} projects={projects} onApply={handleApplyProject} navigateTo={navigateTo} />}
        {currentPage === 'umkmDashboard' && currentUser?.role === 'umkm' && <UMKMDashboard currentUser={currentUser} projects={projects} onPostProject={handlePostProject} />}
        {currentPage === 'adminDashboard' && currentUser?.role === 'admin' && <AdminDashboard showToast={showToast} />}
      </main>
      
      <Footer />
    </div>
  );
}

function Navbar({ navigateTo, currentUser, handleLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleIcon = () => {
    if(currentUser.role === 'student') return <GraduationCap size={16} />;
    if(currentUser.role === 'umkm') return <Store size={16} />;
    if(currentUser.role === 'admin') return <ShieldCheck size={16} />;
    return <User size={16} />;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer group" onClick={() => navigateTo('landing')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 shadow-sm shadow-blue-600/20 group-hover:rotate-6 transition-transform">
                <Briefcase className="text-white" size={18} />
            </div>
            <span className="text-slate-900 font-extrabold text-2xl tracking-tight">
              Gig<span className="text-blue-600">Skill</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {!currentUser ? (
              <>
                <button onClick={() => navigateTo('landing')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Beranda</button>
                <div className="h-4 w-px bg-slate-200"></div>
                <button onClick={() => navigateTo('login')} className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Masuk</button>
                <button onClick={() => navigateTo('register')} className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm">Daftar Akun</button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <div className={"w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm " + (currentUser.role === 'umkm' ? 'bg-green-500' : currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600')}>
                    {getRoleIcon()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 leading-none">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{currentUser.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Keluar">
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2 rounded-lg hover:bg-slate-100">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 absolute w-full shadow-xl z-50">
          {!currentUser ? (
            <>
              <button onClick={() => {navigateTo('login'); setIsMobileMenuOpen(false);}} className="w-full text-left py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-50">Masuk</button>
              <button onClick={() => {navigateTo('register'); setIsMobileMenuOpen(false);}} className="w-full text-left py-3 px-4 rounded-xl font-bold text-white bg-blue-600">Daftar Akun</button>
            </>
          ) : (
             <button onClick={() => {handleLogout(); setIsMobileMenuOpen(false);}} className="w-full flex items-center space-x-2 py-3 px-4 rounded-xl font-bold text-red-600 bg-red-50">
               <LogOut size={18} /> <span>Keluar ({currentUser.name})</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

function LandingPage({ navigateTo }) {
  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-100 to-transparent blur-[100px] rounded-full -z-10 pointer-events-none opacity-60"></div>
        
        <div className="text-center max-w-4xl mx-auto z-10 relative">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-slate-200 shadow-sm px-4 py-2 rounded-full text-sm font-semibold mb-8 cursor-default">
             <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-slate-600">Project Beta Tester</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Hubungkan Talenta.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Bangun Pengalaman.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            GigSkill adalah platform micro-project yang dirancang untuk membantu mahasiswa membangun portofolio nyata, sekaligus membantu UMKM bertransformasi secara digital.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={() => navigateTo('register')} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-1 flex items-center justify-center">
              Mulai Sekarang <ArrowRight className="ml-2" size={20} />
            </button>
            <button onClick={() => navigateTo('login')} className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all">
              Masuk
            </button>
          </div>
        </div>

        <div className="mt-20 max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 bg-white px-3 py-1 rounded-md text-xs font-medium text-slate-400">gigskill.web.id/dashboard</div>
          </div>
          <div className="p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80 pointer-events-none">
            <div className="col-span-1 space-y-4">
                <div className="h-32 bg-white rounded-2xl border border-slate-200 p-4"><div className="w-12 h-12 bg-slate-100 rounded-full mb-3"></div><div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div><div className="h-3 w-1/2 bg-slate-100 rounded"></div></div>
                <div className="h-48 bg-white rounded-2xl border border-slate-200"></div>
            </div>
            <div className="col-span-2 space-y-4">
                <div className="h-16 bg-white rounded-2xl border border-slate-200 flex items-center px-4"><div className="h-4 w-1/3 bg-slate-200 rounded"></div></div>
                <div className="h-24 bg-white rounded-2xl border border-slate-200"></div>
                <div className="h-24 bg-white rounded-2xl border border-slate-200"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RegisterPage({ onRegister, navigateTo }) {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', univ: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ role: activeTab, name: formData.name, email: formData.email, password: formData.password, univ: formData.univ, phone: formData.phone });
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Buat Akun Baru</h2>
          <p className="text-slate-500 mt-2 font-medium">Pilih peran Anda untuk bergabung dengan ekosistem.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button onClick={() => setActiveTab('student')} className={"flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 " + (activeTab === 'student' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700')}>
            <GraduationCap size={18} /><span>Mahasiswa</span>
          </button>
          <button onClick={() => setActiveTab('umkm')} className={"flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 " + (activeTab === 'umkm' ? 'bg-white text-green-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700')}>
            <Store size={18} /><span>UMKM</span>
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {activeTab === 'student' ? (
            <div className="animate-in slide-in-from-left-4 duration-300 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nama Lengkap Sesuai KTM</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Cth: Budi Santoso" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Universitas</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select required value={formData.univ} onChange={e => setFormData({...formData, univ: e.target.value})} className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-slate-700 transition-all">
                    <option value="">Pilih Kampus...</option>
                    <option value="unpam">Universitas Pamulang</option>
                    <option value="ui">Universitas Indonesia</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nama Usaha / Bisnis</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Cth: Kopi Kenangan Senja" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nomor WhatsApp Aktif</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="081234567890" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email</label>
            <div className="relative mb-4">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@contoh.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all font-medium" />
            </div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all font-medium" />
            </div>
          </div>

          <button type="submit" className={"w-full text-white py-4 rounded-2xl font-extrabold text-lg transition-all shadow-lg hover:-translate-y-0.5 mt-6 " + (activeTab === 'student' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' : 'bg-green-600 hover:bg-green-700 shadow-green-600/30')}>
            Daftar Sekarang
          </button>
        </form>
        <p className="mt-8 text-center text-sm font-medium text-slate-600">
          Sudah memiliki akun? <button onClick={() => navigateTo('login')} className="text-blue-600 font-bold hover:underline">Masuk</button>
        </p>
      </div>
    </div>
  );
}

function LoginPage({ handleLogin, handleQuickLogin, navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 transform rotate-3">
             <Lock className="text-slate-600" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang</h2>
          <p className="text-slate-500 mt-2 font-medium">Silakan masuk menggunakan akun Anda.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 mb-8">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Anda" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
            </div>
          </div>
          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2">
            Masuk
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Atau Gunakan Demo Akun</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => handleQuickLogin('student')} className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <GraduationCap className="text-slate-400 group-hover:text-blue-600 mb-1" size={20} />
            <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">Mahasiswa</span>
          </button>
          <button type="button" onClick={() => handleQuickLogin('umkm')} className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
            <Store className="text-slate-400 group-hover:text-green-600 mb-1" size={20} />
            <span className="text-xs font-bold text-slate-600 group-hover:text-green-700">UMKM</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ currentUser, projects, onApply }) {
  const [activeTab, setActiveTab] = useState('cari');
  const [selectedProject, setSelectedProject] = useState(null);

  const myApplications = projects.filter(p => p.applicants.some(a => a.studentId === currentUser.id));

  const handleApplyClick = () => {
    onApply(selectedProject.id);
    setSelectedProject(null);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-500 relative">
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">Mencari Pelamar</span>
                <h2 className="text-2xl font-extrabold text-slate-900">{selectedProject.title}</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">{selectedProject.umkmName} {selectedProject.verified && <CheckCircle2 size={14} className="inline text-blue-500"/>}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><X size={20}/></button>
            </div>
            <div className="space-y-4 mb-8">
              <p className="text-slate-700 leading-relaxed text-sm">{selectedProject.desc}</p>
              <div className="flex gap-4 border-y border-slate-100 py-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-lg font-extrabold text-green-600">{formatRupiah(selectedProject.budget)}</p>
                </div>
                <div className="w-px bg-slate-100"></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Deadline</p>
                  <p className="text-lg font-extrabold text-slate-700 flex items-center"><Clock size={16} className="mr-1"/> {selectedProject.deadline}</p>
                </div>
              </div>
            </div>
            <button onClick={handleApplyClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">
              Kirim Lamaran Saya
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Mahasiswa</h1>
          <div className="flex items-center mt-2 space-x-2">
            <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase">{currentUser.univ || 'Universitas'}</span>
            <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md">
              <CheckCircle2 size={14} className="mr-1"/> Terverifikasi
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 min-w-[220px]">
          <div className="bg-green-100 p-3 rounded-xl"><DollarSign size={24} className="text-green-600"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Penghasilan Aktif</p>
            <p className="text-2xl font-extrabold text-slate-900 leading-none">Rp 0</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-3 space-y-1.5 sticky top-24">
            <button onClick={() => setActiveTab('cari')} className={"w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all " + (activeTab === 'cari' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>
              <Search size={18} /> <span>Cari Project</span>
            </button>
            <button onClick={() => setActiveTab('lamaran')} className={"w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all " + (activeTab === 'lamaran' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>
              <FileText size={18} /> <span>Lamaran Saya <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{myApplications.length}</span></span>
            </button>
            <button onClick={() => setActiveTab('profil')} className={"w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all " + (activeTab === 'profil' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>
              <User size={18} /> <span>Profil & Portfolio</span>
            </button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'cari' && (
            <div className="space-y-6">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <Search className="text-slate-400 ml-4 mr-2" size={20} />
                <input type="text" placeholder="Cari project (desain, admin, web)..." className="w-full p-2.5 outline-none text-sm font-medium text-slate-700 bg-transparent" />
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm">Cari</button>
              </div>

              <div className="grid gap-4">
                {projects.map((project) => {
                  const hasApplied = project.applicants.some(a => a.studentId === currentUser.id);
                  return (
                    <div key={project.id} onClick={() => !hasApplied && setSelectedProject(project)} className={"bg-white p-6 rounded-2xl border transition-all group " + (hasApplied ? 'border-slate-200 opacity-60 cursor-default' : 'border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer')}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase">{project.umkmName}</span>
                            {project.verified && <CheckCircle2 size={14} className="text-blue-500"/>}
                          </div>
                          <h3 className={"text-xl font-extrabold text-slate-900 transition-colors " + (!hasApplied ? 'group-hover:text-blue-600' : '')}>{project.title}</h3>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="block text-xl font-extrabold text-green-600">{formatRupiah(project.budget)}</span>
                          <span className="flex items-center justify-end text-xs font-bold text-slate-400 mt-1"><Clock size={12} className="mr-1"/> {project.deadline}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex gap-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg">{tag}</span>
                          ))}
                        </div>
                        {hasApplied && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-lg">Sudah Dilamar</span>}
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
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada project yang dilamar</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">Mulai eksplorasi peluang untuk membangun portofolio Anda.</p>
                  <button onClick={() => setActiveTab('cari')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800">Cari Project Sekarang</button>
                </div>
              ) : (
                myApplications.map(project => (
                  <div key={project.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-bold text-slate-500 uppercase">{project.umkmName}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900">{project.title}</h3>
                     </div>
                     <div className="flex items-center space-x-4">
                       <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200">Menunggu Review UMKM</span>
                     </div>
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
                  <h2 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h2>
                  <p className="text-slate-500 font-medium">{currentUser.email} • {currentUser.univ}</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Star size={18} className="mr-2 text-amber-500"/> Skill Saya</h3>
                <div className="flex gap-2 mb-8">
                  <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-sm font-bold border border-dashed border-slate-300 cursor-pointer hover:bg-slate-200">+ Tambah Skill</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UMKMDashboard({ currentUser, projects, onPostProject }) {
  const [activeTab, setActiveTab] = useState('project'); 
  const [expandedProject, setExpandedProject] = useState(null);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('1-3 Hari');

  const myProjects = projects.filter(p => p.umkmId === currentUser.id);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    onPostProject({ title, desc, budget, deadline });
    setTitle(''); setDesc(''); setBudget('');
    setActiveTab('project');
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard UMKM</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">{currentUser.name} • <span className="text-green-600">Aktif</span></p>
        </div>
        <button onClick={() => setActiveTab('post')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm shadow-green-600/20 flex items-center space-x-2">
          <Plus size={18} /> <span>Posting Project Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100">
            <button onClick={() => setActiveTab('project')} className={"px-6 py-4 font-bold text-sm border-b-2 transition-colors " + (activeTab === 'project' ? 'border-green-600 text-green-700 bg-green-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50')}>Project Aktif Anda ({myProjects.length})</button>
            <button onClick={() => setActiveTab('post')} className={"px-6 py-4 font-bold text-sm border-b-2 transition-colors " + (activeTab === 'post' ? 'border-green-600 text-green-700 bg-green-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50')}>Buat Posting Baru</button>
        </div>
        
        <div className="p-6 sm:p-8">
          {activeTab === 'project' && (
            <div className="space-y-6">
              {myProjects.length === 0 ? (
                 <div className="text-center py-10">
                   <p className="text-slate-500 mb-4">Anda belum memposting project apapun.</p>
                   <button onClick={() => setActiveTab('post')} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">Mulai Posting</button>
                 </div>
              ) : (
                myProjects.map(project => (
                  <div key={project.id} className="border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 bg-white shadow-sm transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest border border-amber-200">Mencari Pelamar</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900">{project.title}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Budget: <span className="text-slate-700 font-bold">{formatRupiah(project.budget)}</span> • Deadline: <span className="text-slate-700 font-bold">{project.deadline}</span></p>
                      </div>
                      <div className="w-full md:w-auto">
                        <button onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)} className={"w-full md:w-auto border px-6 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center space-x-2 " + (project.applicants.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100')}>
                          <User size={18}/> <span>Lihat Pelamar ({project.applicants.length})</span>
                        </button>
                      </div>
                    </div>
                    
                    {expandedProject === project.id && (
                      <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                        <h4 className="text-sm font-bold text-slate-700 mb-3">Daftar Mahasiswa yang Melamar:</h4>
                        {project.applicants.length === 0 ? (
                           <p className="text-xs text-slate-400 italic">Belum ada mahasiswa yang melamar project ini.</p>
                        ) : (
                           <div className="space-y-3">
                             {project.applicants.map((applicant, idx) => (
                               <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">{applicant.studentName.charAt(0)}</div>
                                    <div>
                                      <p className="text-sm font-bold text-slate-900">{applicant.studentName}</p>
                                      <p className="text-[10px] text-slate-500">Melamar pada {applicant.date}</p>
                                    </div>
                                  </div>
                                  <button className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg">Terima & Hubungi</button>
                               </div>
                             ))}
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
                  <h4 className="font-extrabold text-slate-900 text-sm">Tips Mendapatkan Talenta Terbaik</h4>
                  <p className="text-xs font-medium text-slate-600 mt-1.5 leading-relaxed">Saat memposting project, deskripsikan kebutuhan Anda sedetail mungkin. Beritahu referensi agar mahasiswa bisa mengukur kemampuannya sebelum melamar.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'post' && (
            <form onSubmit={handlePostSubmit} className="max-w-2xl mx-auto space-y-5 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Detail Project Baru</h2>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Judul Project</label>
                    <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Contoh: Pembuatan Logo Toko Kue" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi Lengkap</label>
                    <textarea rows="4" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Jelaskan secara detail apa yang Anda butuhkan..." required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Budget (Rp)</label>
                        <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="150000" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Deadline Pekerjaan</label>
                        <select required value={deadline} onChange={e=>setDeadline(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium">
                            <option value="1-3 Hari">1-3 Hari</option>
                            <option value="1 Minggu">1 Minggu</option>
                            <option value="2 Minggu">2 Minggu</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md mt-4 transition-colors">
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
    showToast("KTM berhasil diverifikasi! Akun mahasiswa telah aktif.", "success");
  };

  return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-500">
       <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <ShieldCheck className="mr-3 text-purple-600" size={32} />
            Admin Master Control
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">GigSkill System Administration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-4">Verifikasi KTM Tertunda (1)</h2>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Siti Aminah</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Universitas Pamulang</p>
                </div>
                <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded font-bold uppercase">Pending</span>
              </div>
              <div className="h-32 bg-slate-200 rounded-xl mb-4 flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                [ Preview Gambar KTM ]
              </div>
              <div className="flex gap-2">
                <button onClick={handleVerify} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">Setujui</button>
                <button className="flex-1 bg-white border border-slate-200 text-red-600 hover:bg-red-50 text-xs font-bold py-2 rounded-lg transition-colors">Tolak</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-4">Verifikasi Pembayaran Manual (0)</h2>
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
              <CreditCard size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Tidak ada transfer masuk yang perlu diverifikasi saat ini.</p>
            </div>
          </div>
        </div>
     </div>
  )
}

function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  const [showRedirectConfirm, setShowRedirectConfirm] = useState(false);
  const driveLink = "https://drive.google.com/drive/folders/13lFplnmq2-m36dzozjo5wUHxnc8ozuCT";

  return (
    <>
      {activeModal === 'tentang' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tentang Kami</h2>
              <button onClick={() => setActiveModal(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"><X size={20}/></button>
            </div>
            <div className="text-slate-700 leading-relaxed text-sm mb-8 space-y-4">
              <p>GigSkill adalah platform inovatif yang dirancang khusus untuk menjembatani mahasiswa Universitas Pamulang (UNPAM) dengan Usaha Mikro, Kecil, dan Menengah (UMKM) lokal. Misi kami adalah memberikan pengalaman kerja nyata (micro-credentials) bagi mahasiswa untuk membangun portofolio, sekaligus membantu UMKM melakukan transformasi digital dengan talenta lokal yang terjangkau.</p>
              <div onClick={() => setShowRedirectConfirm(true)} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-900 mt-4 cursor-pointer hover:bg-blue-100 transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <p className="font-extrabold text-sm uppercase tracking-wider text-blue-700">Project Tugas Bisnis Plan</p>
                  <ArrowRight size={16} className="text-blue-500 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <ul className="space-y-1 text-sm relative z-10">
                  <li><span className="font-semibold text-slate-700">Mata Kuliah:</span> Manajemen Pemasaran</li>
                  <li><span className="font-semibold text-slate-700">Oleh:</span> Ripki Maulana, Muhammad Sofyan, Muhammad Faiz</li>
                </ul>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-200/40 rounded-full blur-xl group-hover:bg-blue-300/40 transition-colors"></div>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">Mengerti & Tutup</button>
          </div>
        </div>
      )}

      {activeModal === 'panduan' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Panduan Penggunaan</h2>
              <button onClick={() => setActiveModal(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"><X size={20}/></button>
            </div>
            <div className="text-slate-700 leading-relaxed text-sm mb-8">
              <ul className="list-decimal pl-5 space-y-3">
                <li><strong>Pendaftaran:</strong> Buat akun sebagai Mahasiswa (wajib melampirkan KTM) atau sebagai UMKM.</li>
                <li><strong>Eksplorasi & Posting:</strong> Mahasiswa dapat mencari project. UMKM dapat memposting kebutuhan mereka.</li>
                <li><strong>Proses Lamaran:</strong> Mahasiswa mengirim lamaran, UMKM memilih kandidat.</li>
                <li><strong>Pengerjaan:</strong> Kerjakan project sesuai dengan kesepakatan tenggat waktu.</li>
                <li><strong>Selesai:</strong> Setelah disetujui, mahasiswa akan mendapatkan ulasan.</li>
              </ul>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">Mengerti & Tutup</button>
          </div>
        </div>
      )}

      {activeModal === 'syarat' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Syarat & Ketentuan</h2>
              <button onClick={() => setActiveModal(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"><X size={20}/></button>
            </div>
            <div className="text-slate-700 leading-relaxed text-sm mb-8 space-y-3">
              <p>1. <strong>Verifikasi:</strong> Mahasiswa wajib melampirkan KTM aktif. UMKM harus memberi data valid.</p>
              <p>2. <strong>Kewajiban:</strong> UMKM wajib memberikan deskripsi tugas dan besaran budget yang jelas.</p>
              <p>3. <strong>Transaksi:</strong> Segala bentuk transaksi keuangan di luar pantauan platform bukan tanggung jawab kami.</p>
              <p>4. <strong>Sanksi:</strong> GigSkill berhak memblokir akun yang terindikasi melakukan pelanggaran.</p>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">Mengerti & Tutup</button>
          </div>
        </div>
      )}

      {showRedirectConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Buka Makalah Project?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Anda akan diarahkan ke tab baru (Google Drive) untuk melihat isi dokumen makalah dari project GigSkill ini.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowRedirectConfirm(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Batal</button>
              <button onClick={() => { window.open(driveLink, '_blank'); setShowRedirectConfirm(false); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">Ya, Buka <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-white font-extrabold text-2xl tracking-tight mb-1">Gig<span className="text-blue-500">Skill</span></span>
            <span className="text-slate-400 font-medium text-xs">Empowering Students & Local Businesses.</span>
          </div>
          <div className="flex flex-wrap justify-center space-x-6 font-bold text-slate-400">
            <button onClick={() => setActiveModal('tentang')} className="hover:text-white transition-colors">Tentang Kami</button>
            <button onClick={() => setActiveModal('panduan')} className="hover:text-white transition-colors">Panduan</button>
            <button onClick={() => setActiveModal('syarat')} className="hover:text-white transition-colors">Syarat & Ketentuan</button>
          </div>
          <div className="text-slate-500 font-medium text-xs">
            &copy; 2026 GigSkill.web.id Platform
          </div>
        </div>
      </footer>
    </>
  );
}
