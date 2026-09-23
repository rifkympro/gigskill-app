import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';

import { initialUsers, initialProjects, initialMessages, initialNotifications } from './data/initialData.js';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import LandingPage from './components/landing/LandingPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import RegisterPage from './components/auth/RegisterPage.jsx';
import StudentDashboard from './components/dashboard/StudentDashboard.jsx';
import UMKMDashboard from './components/dashboard/UMKMDashboard.jsx';
import AdminDashboard from './components/dashboard/AdminDashboard.jsx';
import VerifyCertificatePage from './components/verification/VerifyCertificatePage.jsx';
import CertificateModal from './components/dashboard/CertificateModal.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [users, setUsers] = React.useState(() => {
    const saved = localStorage.getItem('gigskill_users');
    let parsedUsers = saved ? JSON.parse(saved) : initialUsers;
    const appVersion = localStorage.getItem('gigskill_app_version_v4');
    if (!appVersion) {
      parsedUsers = parsedUsers.map(u => {
        if (u.id === 'u1') return { ...u, balance: 300000 };
        if (u.id === 'u2') return { ...u, balance: 5000000 };
        if (u.id === 'u3' || u.role === 'admin') return { ...u, email: 'admin@gigskill.web.id', password: '123' };
        return u;
      });
      // Ensure admin user exists
      if (!parsedUsers.some(u => u.role === 'admin')) {
        parsedUsers.push({
          id: 'u3',
          role: 'admin',
          name: 'Super Admin',
          email: 'admin@gigskill.web.id',
          password: '123'
        });
      }
      localStorage.setItem('gigskill_app_version_v4', 'v4');
    }
    // Also explicitly verify admin user has the new email
    parsedUsers = parsedUsers.map(u => {
      if (u.role === 'admin') return { ...u, email: 'admin@gigskill.web.id', password: '123' };
      return u;
    });
    return parsedUsers;
  });
  const [projects, setProjects] = React.useState(() => {
    const saved = localStorage.getItem('gigskill_projects');
    if (!saved) return initialProjects;
    try {
      const parsed = JSON.parse(saved);
      // Migration: Ensure dummy project p1 (Desain Logo & Banner) is strictly Online (Remote) without PIN
      let changed = false;
      const updated = parsed.map(p => {
        if (p.id === 'p1' && (p.type === 'Offline' || p.offlineVerificationCode)) {
          changed = true;
          const { offlineVerificationCode, ...rest } = p;
          return {
            ...rest,
            type: 'Online',
            location: '',
            desc: 'Pekerjaan remote digital: Kami membutuhkan desain logo baru yang minimalis dan banner promosi. Pengiriman hasil kerja berupa file master vektor (.AI/.EPS) dan preview format PNG/PDF melalui Google Drive.'
          };
        }
        if (p.id === 'p3' && p.category === 'Pekerjaan Fisik & Desain') {
          changed = true;
          return { ...p, category: 'Operasional & Foto On-Site' };
        }
        return p;
      });
      if (changed) {
        localStorage.setItem('gigskill_projects', JSON.stringify(updated));
      }
      return updated;
    } catch {
      return initialProjects;
    }
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'tx_demo_wd_1',
        userId: 'u1',
        userName: 'Joko Subianto',
        userRole: 'student',
        type: 'withdraw',
        amount: 150000,
        accountDetails: 'BCA 8271928371 a/n Joko Subianto',
        status: 'Menunggu',
        date: new Date().toLocaleDateString('id-ID')
      }
    ];
  });
  const [notifications, setNotifications] = React.useState(() => {
    const saved = localStorage.getItem('gigskill_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return initialNotifications;
  });
  const [footerPopup, setFooterPopup] = React.useState(null);
  const [activeChatContext, setActiveChatContext] = React.useState(null);
  const [verifyCertCode, setVerifyCertCode] = useState('');
  const [previewCertProject, setPreviewCertProject] = useState(null);
  const [previewCertStudent, setPreviewCertStudent] = useState(null);

  // Check URL query on initial load (e.g. from scanned QR code)
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const certParam = params.get('cert');
        if (certParam) {
          setVerifyCertCode(certParam);
          setCurrentPage('verify-cert');
        } else if (window.location.pathname.includes('/verify')) {
          setCurrentPage('verify-cert');
        }
      }
    } catch (e) {
      console.warn('URL parsing error:', e);
    }
  }, []);

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
  React.useEffect(() => {
    localStorage.setItem('gigskill_notifications', JSON.stringify(notifications));
  }, [notifications]);
  const [currentUser, setCurrentUser] = useState(null);

  const sendNotification = (notifData) => {
    const newNotif = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      date: new Date().toLocaleDateString('id-ID'),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      ...notifData
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkNotificationAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => {
      if (!currentUser) return n;
      if (currentUser.role === 'admin' && (n.userId === currentUser.id || n.userId === 'admin' || n.role === 'admin')) {
        return { ...n, read: true };
      }
      if (n.userId === currentUser.id) {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const handleDeleteNotification = (notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.filter(n => {
      if (!currentUser) return false;
      if (currentUser.role === 'admin') {
        return !(n.userId === currentUser.id || n.userId === 'admin' || n.role === 'admin');
      }
      return n.userId !== currentUser.id;
    }));
  };
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
      balance: 0,
      verified: false,
      isDummy: false,
      ...(userData.role === 'student' ? { skills: [], portfolios: [] } : {})
    };

    setUsers([...users, newUser]);

    const roleName =
      userData.role === 'student' ? 'Mahasiswa' : 'UMKM';

    // Kirim notifikasi selamat datang ke pengguna baru
    sendNotification({
      userId: newId,
      role: userData.role,
      type: 'welcome',
      title: 'Selamat Datang di GigSkill! 👋',
      message: `Akun ${roleName} Anda telah dibuat. Lengkapi profil dan ajukan verifikasi berkas untuk mulai bertransaksi dengan aman.`,
      actionType: 'open_profile'
    });

    // Kirim notifikasi ke Admin tentang pendaftaran baru
    sendNotification({
      userId: 'u3',
      role: 'admin',
      type: 'user_registered',
      title: 'Pengguna Baru Terdaftar 👤',
      message: `${userData.name} mendaftar sebagai ${roleName}. Menunggu verifikasi identitas.`,
      actionType: 'open_admin_verifikasi'
    });

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
    const umkmBalance = Number(currentUser?.balance || 0);
    const projectBudget = Number(projectData.budget || 0);

    if (umkmBalance <= 0) {
      showToast('Saldo Anda Rp 0! Silakan lakukan Top Up terlebih dahulu sebelum memposting project agar saldo tidak minus.', 'error');
      return false;
    }

    if (projectBudget > umkmBalance) {
      showToast(`Budget project (Rp ${projectBudget.toLocaleString('id-ID')}) melebihi saldo dompet Anda (Rp ${umkmBalance.toLocaleString('id-ID')}). Silakan top up saldo terlebih dahulu.`, 'error');
      return false;
    }

    const newProject = {
      id: 'p_' + Date.now(),
      umkmId: currentUser.id,
      umkmName: currentUser.name,
      verified: true,
      applicants: [],
      ...projectData,
      offlineVerificationCode: projectData.type === 'Offline' 
        ? (projectData.offlineVerificationCode || Math.floor(1000 + Math.random() * 9000).toString()) 
        : undefined,
      tags: projectData.tags || ['New']
    };

    setProjects([newProject, ...projects]);

    sendNotification({
      userId: currentUser.id,
      role: 'umkm',
      type: 'project_posted',
      title: 'Lowongan Proyek Diterbitkan! 🚀',
      message: `Proyek "${projectData.title}" dengan honor Rp ${projectBudget.toLocaleString('id-ID')} telah online dan siap dilamar mahasiswa.`,
      actionType: 'open_project',
      contextId: newProject.id
    });

    showToast('Project berhasil diposting!', 'success');
    return true;
  };

  const handleUpdateProfile = (userId, newProfileData) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...newProfileData } : u));
    setCurrentUser(prev => ({ ...prev, ...newProfileData }));

    // Jika user mengajukan dokumen verifikasi
    if (newProfileData.verificationDoc && newProfileData.verificationStatus === 'Pending') {
      sendNotification({
        userId: userId,
        role: currentUser?.role,
        type: 'verification_submitted',
        title: 'Berkas Verifikasi Terkirim 📄',
        message: 'Pengajuan berkas Anda telah masuk antrean peninjauan oleh Admin GigSkill.',
        actionType: 'open_profile'
      });
      sendNotification({
        userId: 'u3',
        role: 'admin',
        type: 'admin_verification_pending',
        title: 'Verifikasi Baru Perlu Ditinjau 🛡️',
        message: `${currentUser?.name} mengajukan dokumen verifikasi akun.`,
        actionType: 'open_admin_verifikasi'
      });
    }

    showToast('Profil berhasil diperbarui!');
  };

  const handleUpdateApplicantStatus = (projectId, studentId, status) => {
    const project = projects.find(p => p.id === projectId);
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: status === 'Diterima' ? 'Mahasiswa Terpilih' : p.status,
          applicants: p.applicants.map(a => {
            if (a.studentId === studentId) {
              return {
                ...a,
                status,
                lastRejectedDate: status === 'Ditolak' ? new Date().toLocaleDateString('id-ID') : a.lastRejectedDate
              };
            }
            if (status === 'Diterima' && (a.status === 'Pending' || a.status === 'Menunggu')) {
              return { ...a, status: 'Ditolak', lastRejectedDate: new Date().toLocaleDateString('id-ID') };
            }
            return a;
          })
        };
      }
      return p;
    }));

    if (project) {
      if (status === 'Diterima') {
        sendNotification({
          userId: studentId,
          role: 'student',
          type: 'application_accepted',
          title: 'Selamat! Lamaran Anda Diterima 🎉',
          message: `Anda terpilih mengerjakan proyek "${project.title}" oleh ${project.umkmName}. Silakan cek tab Project Aktif dan mulai pengerjaan.`,
          actionType: 'open_project',
          contextId: project.id
        });
      } else if (status === 'Ditolak') {
        sendNotification({
          userId: studentId,
          role: 'student',
          type: 'application_rejected',
          title: 'Pemberitahuan Status Lamaran',
          message: `Lamaran Anda untuk "${project.title}" belum dapat diterima saat ini. Anda dapat melamar proyek menarik lainnya.`,
          actionType: 'open_lamaran',
          contextId: project.id
        });
      }
    }

    showToast(`Pelamar ${status === 'Diterima' ? 'berhasil diterima' : 'ditolak'}.`, status === 'Diterima' ? 'success' : 'error');
  };

  const handleRequestTransaction = (type, amount, accountDetails) => {
    const numAmount = Number(amount);

    if (type === 'withdraw') {
      if (numAmount > (currentUser.balance || 0)) {
        showToast('Saldo Anda tidak mencukupi untuk melakukan penarikan dana.', 'error');
        return;
      }
      // Potong / hold saldo mahasiswa saat pengajuan penarikan
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: Math.max(0, (u.balance || 0) - numAmount) } : u));
      setCurrentUser(curr => curr ? { ...curr, balance: Math.max(0, (curr.balance || 0) - numAmount) } : curr);
    }

    const newTx = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      type, // 'topup' or 'withdraw'
      amount: numAmount,
      accountDetails,
      status: 'Menunggu',
      date: new Date().toLocaleDateString('id-ID'),
      deductedAtRequest: type === 'withdraw'
    };
    setTransactions(prev => [newTx, ...prev]);

    // Kirim notifikasi ke Admin
    sendNotification({
      userId: 'u3',
      role: 'admin',
      type: type === 'withdraw' ? 'withdraw_requested' : 'topup_requested',
      title: type === 'withdraw' ? 'Permintaan Penarikan Dana Baru 💸' : 'Permintaan Top Up Saldo 💳',
      message: `${currentUser.name} (${currentUser.role === 'student' ? 'Mahasiswa' : 'UMKM'}) meminta ${type === 'withdraw' ? 'penarikan' : 'top up'} Rp ${numAmount.toLocaleString('id-ID')}. Rek: ${accountDetails}`,
      actionType: 'open_admin_finance',
      contextId: newTx.id
    });

    // Kirim notifikasi konfirmasi ke pemohon
    sendNotification({
      userId: currentUser.id,
      role: currentUser.role,
      type: 'transaction_pending',
      title: type === 'withdraw' ? 'Penarikan Dana Sedang Diproses' : 'Permintaan Top Up Dikirim',
      message: `Permintaan ${type === 'withdraw' ? 'penarikan' : 'top up'} Rp ${numAmount.toLocaleString('id-ID')} telah tercatat dan sedang menunggu verifikasi Admin.`,
      actionType: 'open_wallet',
      contextId: newTx.id
    });

    showToast(
      type === 'withdraw'
        ? `Permintaan penarikan Rp ${numAmount.toLocaleString('id-ID')} berhasil diajukan. Saldo dipotong sementara & menunggu transfer Admin.`
        : `Permintaan Top Up berhasil dikirim ke Admin.`,
      'success'
    );
  };

  const handleReviewProject = (projectId, isAccepted, reason = '') => {
    const project = projects.find(p => p.id === projectId);
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
          setCurrentUser(curr => {
            if (!curr) return curr;
            if (curr.id === p.umkmId) return { ...curr, balance: (curr.balance || 0) - Number(p.budget) };
            if (p.applicants.some(a => a.status === 'Diterima' && a.studentId === curr.id)) {
              return { ...curr, balance: (curr.balance || 0) + Number(p.budget) };
            }
            return curr;
          });
          return { ...p, status: 'Selesai', paymentStatus: 'Sudah Dibayar', completedAt: new Date().toLocaleDateString('id-ID') };
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

    if (project) {
      const studentApplicant = project.applicants.find(a => a.status === 'Diterima');
      if (isAccepted) {
        if (studentApplicant) {
          sendNotification({
            userId: studentApplicant.studentId,
            role: 'student',
            type: 'project_completed',
            title: 'Honor Masuk & Sertifikat Terbit! 🎓',
            message: `Pekerjaan "${project.title}" disetujui ${project.umkmName}. Saldo Rp ${Number(project.budget).toLocaleString('id-ID')} telah ditambahkan ke dompet Anda!`,
            actionType: 'open_certificate',
            contextId: project.id
          });
        }
        sendNotification({
          userId: project.umkmId,
          role: 'umkm',
          type: 'project_completed',
          title: 'Proyek Selesai & Berhasil Ditutup ✅',
          message: `Proyek "${project.title}" telah Anda setujui. Pembayaran honor telah dialokasikan ke mahasiswa.`,
          actionType: 'open_project',
          contextId: project.id
        });
      } else {
        if (studentApplicant) {
          sendNotification({
            userId: studentApplicant.studentId,
            role: 'student',
            type: 'submission_rejected',
            title: 'Hasil Pekerjaan Perlu Revisi / Banding ⚠️',
            message: `UMKM memberikan catatan perbaikan untuk "${project.title}": "${reason || 'Perlu penyesuaian'}". Anda dapat memberikan tanggapan atau mengajukan banding.`,
            actionType: 'open_project',
            contextId: project.id
          });
        }
      }
    }

    showToast(isAccepted ? 'Project diselesaikan & Saldo ditransfer!' : 'Project dikembalikan untuk Banding.');
  };

  const handleAddReview = (projectId, reviewData) => {
    // reviewData: { fromRole: 'umkm'|'student', fromId, toId, rating: 1-5, comment: '' }
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const existingReviews = p.reviews || [];
        return {
          ...p,
          reviews: [...existingReviews, { ...reviewData, date: new Date().toLocaleDateString('id-ID') }]
        };
      }
      return p;
    }));

    // Update target user's rating & reviews list
    setUsers(prev => prev.map(u => {
      if (u.id === reviewData.toId) {
        const userReviews = u.userReviews || [];
        const updatedReviews = [...userReviews, { ...reviewData, projectTitle: projects.find(p => p.id === projectId)?.title || 'Project', date: new Date().toLocaleDateString('id-ID') }];
        const avgRating = (updatedReviews.reduce((sum, r) => sum + Number(r.rating), 0) / updatedReviews.length).toFixed(1);
        return {
          ...u,
          rating: Number(avgRating),
          userReviews: updatedReviews
        };
      }
      return u;
    }));

    setCurrentUser(curr => {
      if (curr && curr.id === reviewData.toId) {
        const userReviews = curr.userReviews || [];
        const updatedReviews = [...userReviews, { ...reviewData, projectTitle: projects.find(p => p.id === projectId)?.title || 'Project', date: new Date().toLocaleDateString('id-ID') }];
        const avgRating = (updatedReviews.reduce((sum, r) => sum + Number(r.rating), 0) / updatedReviews.length).toFixed(1);
        return {
          ...curr,
          rating: Number(avgRating),
          userReviews: updatedReviews
        };
      }
      return curr;
    });

    sendNotification({
      userId: reviewData.toId,
      type: 'review_received',
      title: 'Ulasan Baru Diterima ⭐',
      message: `${currentUser?.name || 'Seseorang'} memberi Anda rating ${reviewData.rating}/5: "${reviewData.comment || 'Pekerjaan memuaskan'}"`,
      actionType: 'open_profile'
    });

    showToast('Ulasan dan rating berhasil dikirim!', 'success');
  };

  const handleSubmitBanding = (projectId, studentResponse) => {
    const project = projects.find(p => p.id === projectId);
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

    if (project) {
      sendNotification({
        userId: project.umkmId,
        role: 'umkm',
        type: 'banding_student_response',
        title: 'Mahasiswa Menanggapi Banding ⚖️',
        message: `${currentUser?.name} memberikan sanggahan untuk proyek "${project.title}". Menunggu mediasi Admin.`,
        actionType: 'open_project',
        contextId: project.id
      });
      sendNotification({
        userId: 'u3',
        role: 'admin',
        type: 'banding_new',
        title: 'Mediasi Banding Baru Dibuka ⚖️',
        message: `Sengketa proyek "${project.title}" membutuhkan mediasi Admin (Batas waktu 48 jam).`,
        actionType: 'open_admin_moderasi',
        contextId: project.id
      });
    }

    showToast('Banding berhasil dikirim! Batas waktu 2 hari dimulai.');
  };

  const handleCompleteProject = (projectId, submissionData = {}) => {
    const proj = projects.find(p => p.id === projectId);
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.status === 'Mahasiswa Terpilih') {
        return { 
          ...p, 
          status: 'Menunggu Review',
          submission: {
            ...submissionData,
            submittedAt: new Date().toLocaleDateString('id-ID')
          }
        };
      }
      return p;
    }));

    if (proj) {
      sendNotification({
        userId: proj.umkmId,
        role: 'umkm',
        type: 'submission_received',
        title: 'Hasil Pekerjaan Diserahkan 📦',
        message: `${currentUser?.name} telah menyerahkan hasil pekerjaan "${proj.title}". Silakan tinjau dan konfirmasi penerimaan.`,
        actionType: 'open_project',
        contextId: proj.id
      });
    }

    showToast('Hasil pekerjaan berhasil dikirim! Menunggu review UMKM.', 'success');
  };

  const handleApplyProject = (projectId, proposal) => {
    if (currentUser?.role !== 'student') return;

    let toastMessage = 'Lamaran berhasil dikirim!';
    const targetProject = projects.find(p => p.id === projectId);

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const existingApp = p.applicants.find(a => a.studentId === currentUser.id);

          if (existingApp) {
            if (existingApp.status === 'Menunggu' || existingApp.status === 'Pending') {
              toastMessage = 'Lamaran Anda saat ini masih dalam proses peninjauan oleh UMKM.';
              return p;
            }
            if (existingApp.status === 'Diterima') {
              toastMessage = 'Anda sudah diterima pada project ini.';
              return p;
            }
            // Lamaran sebelumnya berstatus Ditolak -> izinkan apply lagi
            toastMessage = 'Lamaran ulang berhasil dikirim ke UMKM!';
            return {
              ...p,
              applicants: p.applicants.map(a => {
                if (a.studentId === currentUser.id) {
                  return {
                    ...a,
                    status: 'Menunggu',
                    proposal: proposal.trim() ? proposal : 'Halo, saya mengajukan lamaran ulang untuk project ini.',
                    date: new Date().toLocaleDateString('id-ID'),
                    previouslyRejected: true,
                    reapplied: true,
                    reapplyCount: (a.reapplyCount || 0) + 1,
                    lastRejectedDate: a.lastRejectedDate || a.date,
                    previousProposal: a.proposal
                  };
                }
                return a;
              })
            };
          }

          // Pelamar baru
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

    if (targetProject) {
      sendNotification({
        userId: targetProject.umkmId,
        role: 'umkm',
        type: 'application_received',
        title: 'Pelamar Baru pada Proyek Anda 📩',
        message: `${currentUser.name} mengajukan lamaran untuk proyek "${targetProject.title}".`,
        actionType: 'open_project',
        contextId: targetProject.id
      });
      sendNotification({
        userId: currentUser.id,
        role: 'student',
        type: 'application_submitted',
        title: 'Lamaran Berhasil Dikirim 🚀',
        message: `Proposal Anda untuk "${targetProject.title}" berhasil terkirim ke ${targetProject.umkmName}. Menunggu tanggapan.`,
        actionType: 'open_lamaran',
        contextId: targetProject.id
      });
    }

    showToast(toastMessage, toastMessage.includes('berhasil') ? 'success' : 'info');
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
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onDeleteNotification={handleDeleteNotification}
          onClearAll={handleClearAllNotifications}
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
            <StudentDashboard 
              onLogout={handleLogout}
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
              onAddReview={handleAddReview}
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onDeleteNotification={handleDeleteNotification}
              onClearAll={handleClearAllNotifications}
              sendNotification={sendNotification}
            />
          )}

        {currentPage === 'umkmDashboard' &&
          currentUser?.role === 'umkm' && (
            <UMKMDashboard 
              onLogout={handleLogout}
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
              onAddReview={handleAddReview}
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onDeleteNotification={handleDeleteNotification}
              onClearAll={handleClearAllNotifications}
              sendNotification={sendNotification}
            />
          )}

        {currentPage === 'adminDashboard' &&
          currentUser?.role === 'admin' && (
            <AdminDashboard 
              onLogout={handleLogout} 
              showToast={showToast} 
              users={users} 
              setUsers={setUsers} 
              setCurrentUser={setCurrentUser}
              projects={projects} 
              setProjects={setProjects} 
              transactions={transactions} 
              setTransactions={setTransactions} 
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onDeleteNotification={handleDeleteNotification}
              onClearAll={handleClearAllNotifications}
              sendNotification={sendNotification}
            />
          )}

        {currentPage === 'verify-cert' && (
          <VerifyCertificatePage
            projects={projects}
            users={users}
            initialCertCode={verifyCertCode}
            onBack={() => navigateTo(currentUser ? `${currentUser.role}Dashboard` : 'landing')}
            onViewCertificate={(proj, std) => {
              setPreviewCertProject(proj);
              setPreviewCertStudent(std);
            }}
          />
        )}
      </main>

      {/* Global Certificate Preview Modal */}
      {previewCertProject && (
        <CertificateModal
          project={previewCertProject}
          student={previewCertStudent || { name: 'Mahasiswa Terverifikasi', univ: 'Universitas Pamulang' }}
          umkm={{ name: previewCertProject.umkmName }}
          onClose={() => {
            setPreviewCertProject(null);
            setPreviewCertStudent(null);
          }}
        />
      )}

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
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tim Pengembang (Kelompok 7)</h4>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      Ripki Maulana • Muhamad Sofiyan • Farah Zafira • Najma Naura
                    </p>
                  </div>
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
      <Footer onOpenPopup={setFooterPopup} navigateTo={navigateTo} />
    </div>
  );
}
