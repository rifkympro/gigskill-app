import React from 'react';
import {
  Menu,
  X,
  Search,
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle2,
  User,
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
  MapPin,
  Star,
  ExternalLink,
  Send,
  Users,
  RotateCcw,
  AlertCircle,
  AlertTriangle,
  Camera,
  Image as ImageIcon,
  Key,
  Sparkles,
  Trash2,
  Check,
  Copy,
  Upload,
  FileText,
  Link,
  Eye,
  Award,
  ShoppingBag
} from 'lucide-react';
import LocationPicker from '../common/LocationPicker.jsx';
import DompetView from './DompetView.jsx';
import ChatView from './ChatView.jsx';
import CertificateModal from './CertificateModal.jsx';
import NotificationBell from '../common/NotificationBell.jsx';
import StudentServicesView from '../services/StudentServicesView.jsx';
import { calculateServiceFee } from '../../utils/feeCalculator.js';
import { compressImage } from '../../utils/imageCompressor.js';

export const PRESET_STUDENT_SERVICE_IMAGES = [
  { label: 'Template Web', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Desain Grafis & Feed', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
  { label: 'Menu & Branding Cafe', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Stiker & Kemasan Produk', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80' }
];

export const DUMMY_OFFLINE_PROOFS = [
  {
    id: 'dummy_1',
    title: 'Penataan Display Etalase',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    desc: 'Hasil penataan produk kue di etalase dan rak display toko fisik'
  },
  {
    id: 'dummy_2',
    title: 'Pemasangan Banner Promosi',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    desc: 'Dokumentasi spanduk promo yang telah terpasang rapi di area depan'
  },
  {
    id: 'dummy_3',
    title: 'Pemotretan Produk On-Site',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    desc: 'Sesi foto produk langsung di outlet UMKM dengan pencahayaan alami'
  },
  {
    id: 'dummy_4',
    title: 'Serah Terima Bersama Pemilik',
    url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    desc: 'Dokumentasi serah terima hasil pekerjaan bersama pemilik toko'
  }
];

export default function StudentDashboard({
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
  onRequestTransaction,
  onAddReview,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onViewCertificate,
  studentServices = [],
  onCreateStudentService,
  onDeleteStudentService,
  serviceOrders = [],
  onSubmitServiceWork,
  onCancelServiceOrder,
  sendNotification,
  showToast
}) {
  const [activeTab, setActiveTab] = React.useState('cari');
  const [activeChatId, setActiveChatId] = React.useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [bandingInput, setBandingInput] = React.useState({});
  const [categoryFilter, setCategoryFilter] = React.useState('Semua');
  const [budgetFilter, setBudgetFilter] = React.useState('Semua');
  const [lamaranStatusFilter, setLamaranStatusFilter] = React.useState('Semua');

  const [selectedProject, setSelectedProject] = React.useState(null);
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [proposalText, setProposalText] = React.useState('');
  const [certificateProject, setCertificateProject] = React.useState(null);

  // Verifikasi Akun Mahasiswa modal state
  const [showVerificationModal, setShowVerificationModal] = React.useState(false);
  const [highlightVerification, setHighlightVerification] = React.useState(false);
  const [verificationType, setVerificationType] = React.useState('photo'); // 'photo' | 'link'
  const [verificationFileUrl, setVerificationFileUrl] = React.useState('');
  const [verificationFileName, setVerificationFileName] = React.useState('');
  const [verificationLink, setVerificationLink] = React.useState('');
  const [verificationNotes, setVerificationNotes] = React.useState('');

  // Submit Result Modal state
  const [submittingProjectId, setSubmittingProjectId] = React.useState(null);
  const [submissionLink, setSubmissionLink] = React.useState('');
  const [submissionNotes, setSubmissionNotes] = React.useState('');

  // State for posting new service (post_jasa tab, matching UMKM post project experience)
  const [newServiceType, setNewServiceType] = React.useState('Online');
  const [newServiceLocation, setNewServiceLocation] = React.useState('');
  const [newServiceCategory, setNewServiceCategory] = React.useState('Desain Grafis');
  const [isCustomServiceCategory, setIsCustomServiceCategory] = React.useState(false);
  const [newServicePrice, setNewServicePrice] = React.useState('');
  const [newServiceDelivery, setNewServiceDelivery] = React.useState('2-3 Hari');
  const [isCustomDelivery, setIsCustomDelivery] = React.useState(false);
  const [newServicePreviewUrl, setNewServicePreviewUrl] = React.useState('');

  const validTabs = ['cari', 'lamaran', 'jasa', 'post_jasa', 'profil', 'dompet', 'pesan'];
  const safeTab = activeTab === 'profile' ? 'profil' : (activeTab === 'project' ? 'cari' : (validTabs.includes(activeTab) ? activeTab : 'cari'));
  const [offlinePhotos, setOfflinePhotos] = React.useState([]);
  const [offlinePin, setOfflinePin] = React.useState('');
  const [offlineDuration, setOfflineDuration] = React.useState('');
  const [offlinePicName, setOfflinePicName] = React.useState('');
  const [previewPhoto, setPreviewPhoto] = React.useState(null);

  // Deteksi apakah user adalah akun dummy
  const isDummyAccount = Boolean(
    currentUser?.isDummy === true ||
    currentUser?.id === 'u1' ||
    currentUser?.email === 'jokosubianto@student.com' ||
    currentUser?.email?.includes('dummy')
  );

  // Template pesan lamaran default
  const getDefaultProposalTemplate = (project, isReapply = false) => {
    const studentName = currentUser.name || 'Mahasiswa';
    const univ = currentUser.univ ? ` di ${currentUser.univ}` : '';
    const semester = currentUser.semester ? ` semester ${currentUser.semester}` : '';
    const skills = currentUser.skills && currentUser.skills.length > 0 ? currentUser.skills.join(', ') : 'komunikasi yang baik, komitmen kerja tinggi, dan dedikasi profesional';

    if (isReapply) {
      return `Halo ${project?.umkmName || 'Bapak/Ibu Pemilik UMKM'},\n\nSaya ${studentName} mengajukan lamaran ulang untuk proyek "${project?.title || ''}". Saya telah menyesuaikan penawaran dan menyempurnakan pendekatan sesuai kebutuhan usaha Anda.\n\nKeahlian utama saya: ${skills}.\n\nSaya siap memberikan hasil terbaik tepat waktu. Terima kasih!`;
    }

    return `Halo ${project?.umkmName || 'Bapak/Ibu Pemilik UMKM'},\n\nSaya ${studentName}, mahasiswa${semester}${univ}. Saya sangat tertarik dan siap mengerjakan proyek "${project?.title || ''}" ini secara profesional, tepat waktu, dan sesuai dengan spesifikasi yang Anda harapkan.\n\nKeahlian utama saya meliputi: ${skills}.\n\nBesar harapan saya untuk dapat berkontribusi dan bekerjasama dengan baik. Terima kasih!`;
  };

  // Review Modal state
  const [reviewingProject, setReviewingProject] = React.useState(null);
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');

  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [editProfileData, setEditProfileData] = React.useState({
    name: currentUser.name || '',
    univ: currentUser.univ || '',
    semester: currentUser.semester || '',
    bio: currentUser.bio || '',
    skills: currentUser.skills ? currentUser.skills.join(', ') : ''
  });

  const handleStartChat = (umkmId, projectId) => {
    // If an existing chat already exists in messages between these two, re-use its chatId
    let existingChatId = null;
    if (Array.isArray(messages)) {
      const existingMsg = messages.find(m => 
        m.chatId && 
        m.chatId.includes(currentUser.id) && 
        m.chatId.includes(umkmId) &&
        (!projectId || m.chatId.includes(projectId))
      );
      if (existingMsg) {
        existingChatId = existingMsg.chatId;
      }
    }
    const finalChatId = existingChatId || `chat::${currentUser.id}::${umkmId}::${projectId || 'general'}`;
    setActiveChatId(finalChatId);
    setActiveChatContext(projectId || null);
    setIsChatOpen(true);
    setSelectedProject(null);
    if (onStartChat) onStartChat(umkmId, projectId);
  };

  const myApplications = projects.filter((p) =>
    (p.applicants || []).some((a) => a.studentId === currentUser?.id)
  );

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  
  const getDistanceText = (studentLoc, projectLoc) => {
    if (!studentLoc || !projectLoc) return '';
    if (studentLoc.trim().toLowerCase() === projectLoc.trim().toLowerCase()) {
      return '(Dekat - Satu Kota)';
    }
    return '(Berbeda Kota)';
  };

  const handleApplySubmit = (e) => {
    if (e) e.preventDefault();
    const myApp = selectedProject?.applicants?.find(a => a.studentId === currentUser.id);
    const isReapply = myApp && myApp.status === 'Ditolak';
    const finalProposal = proposalText.trim() || getDefaultProposalTemplate(selectedProject, isReapply);
    onApply(selectedProject.id, finalProposal);
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
      {/* Modal Verifikasi Akun Mahasiswa */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4" onClick={() => setShowVerificationModal(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={24} />
                  Verifikasi Identitas Mahasiswa
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kirimkan foto KTM asli atau tautan dokumen cloud (Google Drive) untuk diverifikasi oleh Admin.
                </p>
              </div>
              <button onClick={() => setShowVerificationModal(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {currentUser.verified ? (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1.5">
                <p className="font-extrabold flex items-center gap-1.5 text-emerald-900 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Identitas Mahasiswa Terverifikasi Resmi
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  Selamat! Kartu Tanda Mahasiswa (KTM) Anda telah diverifikasi resmi oleh Admin GigSkill. Lencana terverifikasi aktif pada profil Anda.
                </p>
                {currentUser.verificationDoc && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-200/80 text-emerald-900">
                    <p className="text-[11px] font-medium">Metode: {currentUser.verificationDoc.type === 'photo' ? '📷 Foto/Scan KTM' : '🔗 Tautan Dokumen (Drive)'}</p>
                    <p className="text-[11px] font-medium">Tanggal Disetujui: {currentUser.verificationDoc.submittedAt || '-'}</p>
                    {currentUser.verificationDoc.type === 'photo' && currentUser.verificationDoc.value && (
                      <div className="mt-2">
                        <img src={currentUser.verificationDoc.value} alt="KTM Terverifikasi" className="w-28 h-20 object-cover rounded-lg border border-emerald-300 cursor-pointer hover:opacity-90" onClick={() => setPreviewPhoto(currentUser.verificationDoc.value)} />
                        <span className="text-[10px] text-emerald-700 underline cursor-pointer mt-0.5 block" onClick={() => setPreviewPhoto(currentUser.verificationDoc.value)}>Perbesar Foto KTM</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : currentUser.verificationStatus === 'Rejected' ? (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-red-950">
                  <AlertTriangle size={15} className="text-red-600" /> Pengajuan Verifikasi Sebelumnya Ditolak Admin
                </p>
                <p className="text-red-800">
                  <strong>Alasan Penolakan:</strong> {currentUser.verificationRejectReason || 'Dokumen belum memenuhi kriteria keabsahan.'}
                </p>
                <p className="text-[11px] text-red-600 font-medium">
                  Silakan unggah ulang foto KTM yang lebih jelas atau tautan berkas terbaru di bawah ini.
                </p>
              </div>
            ) : currentUser.verificationDoc ? (
              <div className="mb-4 p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Clock size={14} className="text-blue-600" /> Dokumen Terkirim Saat Ini (Status: {currentUser.verificationStatus || 'Menunggu Verifikasi Admin'})
                </p>
                <p className="text-blue-800">Metode: {currentUser.verificationDoc.type === 'photo' ? '📷 Foto/Scan KTM' : '🔗 Tautan Dokumen'}</p>
                <p className="text-blue-800">Tanggal Pengajuan: {currentUser.verificationDoc.submittedAt || '-'}</p>
                {currentUser.verificationDoc.notes && <p className="text-blue-800">Catatan: {currentUser.verificationDoc.notes}</p>}
                {currentUser.verificationDoc.type === 'photo' && currentUser.verificationDoc.value && (
                  <div className="mt-2">
                    <img src={currentUser.verificationDoc.value} alt="KTM Terkirim" className="w-28 h-20 object-cover rounded-lg border border-blue-200 cursor-pointer hover:opacity-90" onClick={() => setPreviewPhoto(currentUser.verificationDoc.value)} />
                    <span className="text-[10px] text-blue-600 underline cursor-pointer mt-0.5 block" onClick={() => setPreviewPhoto(currentUser.verificationDoc.value)}>Perbesar Foto</span>
                  </div>
                )}
                {currentUser.verificationDoc.type === 'link' && currentUser.verificationDoc.value && (
                  <a href={currentUser.verificationDoc.value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-bold mt-1">
                    <ExternalLink size={12} /> Buka Tautan Berkas ({currentUser.verificationDoc.value.slice(0, 35)}...)
                  </a>
                )}
              </div>
            ) : null}

            <form onSubmit={(e) => {
              e.preventDefault();
              const docValue = verificationType === 'photo' ? verificationFileUrl : verificationLink.trim();
              if (!docValue) {
                alert(verificationType === 'photo' ? 'Silakan pilih foto KTM Anda terlebih dahulu.' : 'Silakan isi tautan dokumen verifikasi.');
                return;
              }

              onUpdateProfile(currentUser.id, {
                verificationDoc: {
                  type: verificationType,
                  value: docValue,
                  fileName: verificationFileName,
                  notes: verificationNotes.trim() || `KTM Mahasiswa ${currentUser.univ || ''}`,
                  submittedAt: new Date().toLocaleDateString('id-ID')
                },
                verificationStatus: 'Pending',
                verificationRejectReason: '',
                verified: false
              });

              setShowVerificationModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Metode Pengiriman Berkas:</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setVerificationType('photo')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      verificationType === 'photo' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Camera size={14} /> Unggah Foto KTM
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationType('link')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      verificationType === 'link' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link size={14} /> Tautan Dokumen (Drive)
                  </button>
                </div>
              </div>

              {verificationType === 'photo' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Foto Kartu Tanda Mahasiswa (KTM) Asli</label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition-colors">
                    <Upload className="text-slate-400 mb-1" size={24} />
                    <span className="text-xs font-bold text-slate-700">Pilih / Jepret Foto KTM</span>
                    <span className="text-[10px] text-slate-400">Format JPG, PNG, atau scan dokumen</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setVerificationFileName(file.name);
                          try {
                            const compressed = await compressImage(file, { maxWidth: 1200, quality: 0.75 });
                            setVerificationFileUrl(compressed);
                          } catch (err) {
                            const reader = new FileReader();
                            reader.onload = () => setVerificationFileUrl(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                    />
                  </label>

                  {verificationFileUrl && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200">
                      <img src={verificationFileUrl} alt="Preview KTM Baru" className="w-full h-36 object-cover" />
                      <div className="p-2 bg-slate-50 text-[11px] font-medium text-slate-600 truncate border-t border-slate-100">
                        {verificationFileName || 'Foto Berkas Terpilih'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tautan Dokumen / File KTM (Google Drive / Cloud)</label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="url"
                      required
                      value={verificationLink}
                      onChange={e => setVerificationLink(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Pastikan izin tautan diatur ke "Siapa saja yang memiliki link dapat melihat".</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Induk Mahasiswa (NIM) & Catatan Pendukung</label>
                <textarea
                  rows={2}
                  value={verificationNotes}
                  onChange={e => setVerificationNotes(e.target.value)}
                  placeholder="Contoh: NIM 20220801123, Teknik Informatika semester 5"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send size={14} /> Kirim ke Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showApplyModal && selectedProject && (() => {
        const myApp = selectedProject.applicants.find(a => a.studentId === currentUser.id);
        const wasRejected = myApp && myApp.status === 'Ditolak';

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4" onClick={() => setShowApplyModal(false)}>
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {wasRejected ? 'Ajukan Lamaran Ulang' : 'Lamar Project'}
                </h2>
                <button onClick={() => setShowApplyModal(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <p className="text-slate-600 text-sm mb-4">
                {wasRejected 
                  ? `Perbarui proposal Anda untuk lowongan "${selectedProject.title}" agar UMKM dapat mempertimbangkan kembali.`
                  : `Ceritakan mengapa Anda cocok untuk project "${selectedProject.title}"`}
              </p>

              {wasRejected && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <AlertCircle size={15} className="text-rose-600 shrink-0" />
                    <span>Keterangan: Lamaran Sebelumnya Pernah Ditolak</span>
                  </div>
                  <p className="text-rose-700 leading-relaxed pl-5">
                    Anda mengajukan lamaran sebelumnya pada {myApp.date}. Gunakan kesempatan ini untuk menyempurnakan proposal, menambahkan portfolio terbaru, atau menyesuaikan penawaran Anda.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-700">
                      {wasRejected ? 'Proposal Baru / Catatan Revisi' : 'Proposal / Pesan Singkat'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setProposalText(getDefaultProposalTemplate(selectedProject, wasRejected))}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                      title="Gunakan kalimat pengantar template otomatis"
                    >
                      <Sparkles size={13} className="text-blue-500" /> Gunakan Pesan Template
                    </button>
                  </div>
                  <textarea 
                    rows={5}
                    value={proposalText}
                    onChange={e => setProposalText(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Langsung klik tombol Kirim Lamaran di bawah untuk menggunakan template resmi otomatis, atau ketik pesan personal Anda di sini..."
                  ></textarea>
                  <p className="text-[11px] text-slate-400 mt-1">
                    💡 <em>Tips: Jika kolom ini dikosongkan dan langsung klik kirim, sistem akan otomatis mengirimkan pesan perkenalan resmi dari template profil Anda.</em>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold transition-all">
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className={`flex-1 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                      wasRejected ? 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {wasRejected && <RotateCcw size={16} />}
                    {wasRejected ? 'Kirim Lamaran Ulang' : 'Kirim Lamaran'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Modal Kirim Hasil Pekerjaan */}
      {submittingProjectId && (() => {
        const submittingProject = projects.find(p => p.id === submittingProjectId);
        const isOffline = submittingProject?.type === 'Offline';
        const expectedPin = submittingProject?.offlineVerificationCode || '8492';
        const isPinMatch = offlinePin.trim() === expectedPin;

        const handleFileUpload = async (e) => {
          const files = Array.from(e.target.files || []);
          for (const file of files) {
            try {
              const compressed = await compressImage(file, { maxWidth: 1200, quality: 0.75 });
              setOfflinePhotos(prev => [...prev, compressed]);
            } catch (err) {
              const reader = new FileReader();
              reader.onload = (uploadEvent) => {
                if (uploadEvent.target?.result) {
                  setOfflinePhotos(prev => [...prev, uploadEvent.target.result]);
                }
              };
              reader.readAsDataURL(file);
            }
          }
        };

        const handleSubmit = (e) => {
          e.preventDefault();

          if (isOffline) {
            if (offlinePhotos.length === 0) {
              alert('Harap lampirkan minimal 1 foto dokumentasi lapangan (Anda juga bisa menggunakan foto sampel/dummy yang disediakan).');
              return;
            }
            if (!offlinePin.trim()) {
              alert('Harap masukkan kode PIN Serah Terima yang diberikan oleh UMKM.');
              return;
            }
            if (!isPinMatch) {
              const proceed = window.confirm(`Kode PIN yang Anda masukkan (${offlinePin}) berbeda dengan kode verifikasi UMKM (${expectedPin}). Pastikan Anda meminta kode yang valid dari pemilik UMKM di lokasi. Tetap ingin mengirimkan?`);
              if (!proceed) return;
            }

            let formattedLink = submissionLink.trim();
            if (formattedLink && !/^https?:\/\//i.test(formattedLink)) {
              formattedLink = 'https://' + formattedLink;
            }

            onCompleteProject(submittingProjectId, {
              type: 'Offline',
              photos: offlinePhotos,
              pin: offlinePin.trim(),
              pinVerified: isPinMatch,
              workDuration: offlineDuration.trim() || 'Sesuai jadwal',
              picName: offlinePicName.trim() || 'Pemilik Toko',
              notes: submissionNotes,
              link: formattedLink
            });
          } else {
            let formattedLink = submissionLink.trim();
            if (formattedLink && !/^https?:\/\//i.test(formattedLink)) {
              formattedLink = 'https://' + formattedLink;
            }
            onCompleteProject(submittingProjectId, {
              type: 'Online',
              link: formattedLink,
              notes: submissionNotes
            });
          }

          setSubmittingProjectId(null);
          setSubmissionLink('');
          setSubmissionNotes('');
          setOfflinePhotos([]);
          setOfflinePin('');
          setOfflineDuration('');
          setOfflinePicName('');
        };

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isOffline ? (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin size={12} /> Proyek Offline di Lokasi
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <ExternalLink size={12} /> Proyek Digital Online
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {isOffline ? 'Laporan & Bukti Proyek Offline' : 'Kirim Hasil Pekerjaan'}
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    {isOffline
                      ? `Kirim dokumentasi fisik pengerjaan di lokasi "${submittingProject?.title}" untuk diverifikasi UMKM.`
                      : 'Kirimkan tautan hasil kerja digital dan catatan untuk ditinjau oleh UMKM.'}
                  </p>
                </div>
                <button onClick={() => setSubmittingProjectId(null)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isOffline ? (
                  <>
                    {/* 1. Upload & Dummy Photo Section */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          1. Foto Dokumentasi Pekerjaan di Lokasi <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {offlinePhotos.length} foto dipilih
                        </span>
                      </div>

                      {/* File Upload Dropzone */}
                      <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-all group">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                          <Camera size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Unggah Foto dari Perangkat / Kamera</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Mendukung format JPG, PNG (Bisa lebih dari 1 foto)</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Interactive Dummy Samples Picker for testing - HANYA MUNCUL DI AKUN DUMMY */}
                      {isDummyAccount && (
                        <div className="mt-3 p-3 bg-gradient-to-br from-indigo-50/80 to-blue-50/60 border border-indigo-100 rounded-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                              <Sparkles size={13} className="text-indigo-600" />
                              Foto Sampel / Dummy (Hanya Akun Dummy):
                            </span>
                            <span className="text-[10px] text-indigo-600 font-bold bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                              Klik untuk pasang
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {DUMMY_OFFLINE_PROOFS.map(dummy => {
                              const isSelected = offlinePhotos.includes(dummy.url);
                              return (
                                <button
                                  key={dummy.id}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setOfflinePhotos(prev => prev.filter(u => u !== dummy.url));
                                    } else {
                                      setOfflinePhotos(prev => [...prev, dummy.url]);
                                    }
                                  }}
                                  className={`relative rounded-xl overflow-hidden border text-left p-1 transition-all group ${
                                    isSelected
                                      ? 'border-indigo-600 ring-2 ring-indigo-500/40 bg-white shadow-xs'
                                      : 'border-slate-200 bg-white hover:border-indigo-300'
                                  }`}
                                >
                                  <img src={dummy.url} alt={dummy.title} className="w-full h-14 object-cover rounded-lg group-hover:opacity-90" />
                                  <p className="text-[10px] font-bold text-slate-800 mt-1 line-clamp-1 leading-tight">{dummy.title}</p>
                                  {isSelected ? (
                                    <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                                      <Check size={10} />
                                    </div>
                                  ) : (
                                    <span className="text-[9px] text-indigo-600 font-semibold block mt-0.5">+ Tambah</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Photo Thumbnails Preview */}
                      {offlinePhotos.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[11px] font-bold text-slate-600 mb-1.5">Daftar Foto yang Akan Dikirim ({offlinePhotos.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {offlinePhotos.map((url, idx) => (
                              <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                                <img
                                  src={url}
                                  alt={`Bukti ${idx + 1}`}
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                                  onClick={() => setPreviewPhoto(url)}
                                />
                                <button
                                  type="button"
                                  onClick={() => setOfflinePhotos(prev => prev.filter((_, i) => i !== idx))}
                                  className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-0.5 rounded-full transition-colors"
                                  title="Hapus foto"
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Verification PIN Code Section */}
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <Key size={14} className="text-amber-600" />
                          2. Kode PIN Serah Terima UMKM <span className="text-rose-500">*</span>
                        </label>
                        {isPinMatch ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={11} /> Cocok dengan UMKM
                          </span>
                        ) : offlinePin.trim().length >= 4 ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle size={11} /> Kode Belum Cocok
                          </span>
                        ) : null}
                      </div>

                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Minta 4 digit kode PIN ini kepada pemilik UMKM di tempat setelah mereka selesai memeriksa hasil pekerjaan fisik Anda.
                      </p>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={offlinePin}
                          onChange={e => setOfflinePin(e.target.value.toUpperCase())}
                          placeholder="Contoh: 8492"
                          className="w-36 px-3 py-2 bg-white border border-amber-300 rounded-xl font-mono text-base font-extrabold tracking-widest text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {isDummyAccount && (
                          <button
                            type="button"
                            onClick={() => setOfflinePin(expectedPin)}
                            className="text-[11px] font-bold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                            title="Isi otomatis untuk pengujian akun dummy"
                          >
                            <Sparkles size={13} className="text-amber-600" />
                            Auto-fill PIN Dummy ({expectedPin})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 3. Detail Pelaksanaan Lapangan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Waktu / Durasi Pengerjaan
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                          <input
                            type="text"
                            value={offlineDuration}
                            onChange={e => setOfflineDuration(e.target.value)}
                            placeholder="Contoh: 13.00 - 17.00 WIB (4 Jam)"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Pendamping / PIC di Lokasi
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                          <input
                            type="text"
                            value={offlinePicName}
                            onChange={e => setOfflinePicName(e.target.value)}
                            placeholder="Contoh: Ibu Tin (Pemilik Toko)"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Laporan Catatan Aktivitas Lapangan */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ringkasan Laporan Pengerjaan di Lokasi <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={submissionNotes}
                        onChange={e => setSubmissionNotes(e.target.value)}
                        placeholder="Ceritakan detail aktivitas yang telah diselesaikan di lokasi (contoh: Penataan etalase depan dan rak kue kering, pengambilan foto 15 varian kue, dan pengecekan display bersama Ibu Tin)..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium leading-relaxed"
                      ></textarea>
                    </div>

                    {/* 5. Tautan Opsional (Google Drive foto mentah / video) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Link File Tambahan (Opsional)
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                          type="text"
                          value={submissionLink}
                          onChange={e => setSubmissionLink(e.target.value)}
                          placeholder="https://drive.google.com/... (opsional untuk raw photos / video)"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  /* Online Form */
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Tautan Hasil Kerja (Google Drive, Figma, GitHub, dll) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          required
                          value={submissionLink}
                          onChange={e => setSubmissionLink(e.target.value)}
                          placeholder="https://drive.google.com/... atau figma.com/..."
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Pastikan hak akses tautan sudah dibuka (Anyone with the link / Public view).</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Pengerjaan / Ringkasan</label>
                      <textarea
                        rows={3}
                        value={submissionNotes}
                        onChange={e => setSubmissionNotes(e.target.value)}
                        placeholder="Ceritakan apa saja yang telah diselesaikan, revisi yang diterapkan, atau instruksi pemakaian..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                      ></textarea>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSubmittingProjectId(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-all text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 text-white py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-md ${
                      isOffline ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <Send size={16} /> {isOffline ? 'Kirim Bukti & Laporan Lapangan' : 'Kirim Hasil Kerja'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Domisili (Kota/Area)</label>
                  <LocationPicker value={editProfileData.location || ''} onChange={val => setEditProfileData({...editProfileData, location: val})} />
                </div>
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

      {/* Modal Berikan Rating & Ulasan untuk UMKM */}
      {reviewingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Beri Ulasan untuk UMKM</h2>
                <p className="text-slate-500 text-sm mt-1">{reviewingProject.umkmName} • {reviewingProject.title}</p>
              </div>
              <button onClick={() => setReviewingProject(null)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Rating</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-extrabold text-amber-600 mt-1 inline-block">
                  {reviewRating === 5 && 'Sangat Memuaskan (5/5)'}
                  {reviewRating === 4 && 'Bagus & Komunikatif (4/5)'}
                  {reviewRating === 3 && 'Cukup Baik (3/5)'}
                  {reviewRating === 2 && 'Kurang Memuaskan (2/5)'}
                  {reviewRating === 1 && 'Sangat Kurang (1/5)'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Pengalaman / Ulasan Anda</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Bagikan pengalaman Anda bekerja sama dengan UMKM ini (pembayaran tepat waktu, keramahan, kejelasan instruksi)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingProject(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddReview(reviewingProject.id, {
                      fromRole: 'student',
                      fromId: currentUser.id,
                      fromName: currentUser.name,
                      toId: reviewingProject.umkmId,
                      rating: reviewRating,
                      comment: reviewComment
                    });
                    setReviewingProject(null);
                    setReviewComment('');
                    setReviewRating(5);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold text-sm shadow-md"
                >
                  Kirim Ulasan
                </button>
              </div>
            </div>
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
              {selectedProject.type === 'Offline' ? (
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded border border-amber-200">📍 Offline - {selectedProject.location} {getDistanceText(currentUser.location, selectedProject.location)}</span>
              ) : (
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">🌐 Online Remote</span>
              )}
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

            {/* Keterangan Lamaran Sebelumnya Pernah Ditolak */}
            {(() => {
              const myApp = selectedProject.applicants.find(a => a.studentId === currentUser.id);
              if (myApp && myApp.status === 'Ditolak') {
                return (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-2">
                    <div className="flex items-center gap-2 font-extrabold text-rose-900 text-sm">
                      <AlertCircle size={16} className="text-rose-600 shrink-0" />
                      <span>Keterangan: Lamaran Sebelumnya Pernah Ditolak</span>
                    </div>
                    <p className="leading-relaxed">
                      Anda sebelumnya pernah mengajukan lamaran untuk lowongan ini pada tanggal <span className="font-bold text-rose-900">{myApp.date}</span> dan berstatus belum diterima. Karena lowongan masih terbuka, Anda <span className="font-bold text-rose-900">dapat mengajukan lamaran kembali</span> dengan proposal atau portofolio yang disempurnakan.
                    </p>
                    {myApp.proposal && (
                      <div className="bg-white/90 p-2.5 rounded-xl border border-rose-100 text-slate-600 italic">
                        <span className="font-bold not-italic text-slate-700 block mb-0.5">Proposal sebelumnya:</span>
                        "{myApp.proposal}"
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            <p className="text-sm text-slate-500 font-medium mb-6">{selectedProject.applicants.length} orang telah melamar</p>

            {selectedProject.status === 'open' && (() => {
              const myApp = selectedProject.applicants.find(a => a.studentId === currentUser.id);
              const isPending = myApp && (myApp.status === 'Menunggu' || myApp.status === 'Pending');
              const wasRejected = myApp && myApp.status === 'Ditolak';

              return (
                <div className="flex gap-3">
                  {isPending ? (
                    <button disabled className="flex-1 bg-slate-100 text-slate-400 py-3.5 rounded-xl font-bold border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2">
                      <Clock size={18} /> Sudah Dilamar (Menunggu Review)
                    </button>
                  ) : wasRejected ? (
                    <button 
                      onClick={() => {
                        setProposalText(myApp.proposal ? `Halo, saya mengajukan lamaran ulang untuk project ini.\n\nPerbaikan proposal & portofolio:\n- ` : '');
                        setShowApplyModal(true);
                      }} 
                      className="flex-1 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Ajukan Lamaran Ulang
                    </button>
                  ) : (
                    <button onClick={() => setShowApplyModal(true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                      <Send size={18} />
                      Kirim Lamaran
                    </button>
                  )}
                  <button onClick={() => handleStartChat(selectedProject.umkmId, selectedProject.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold border border-slate-200 flex items-center justify-center">
                    <MessageCircle size={20} />
                  </button>
                </div>
              );
            })()}
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
            { id: 'jasa', icon: ShoppingBag, label: 'Jasa Saya' },
            { id: 'post_jasa', icon: Plus, label: 'Buat Penawaran Jasa' },
            { id: 'profil', icon: User, label: 'Profil & Portfolio' },
            { id: 'dompet', icon: CreditCard, label: 'Dompet Saya' },
            { id: 'pesan', icon: MessageCircle, label: 'Pesan' }
          ].map((item) => (
            <button key={item.id} onClick={() => { if(item.id === 'pesan') { setIsChatOpen(true); } else { setActiveTab(item.id); } setIsMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${safeTab === item.id || (item.id === 'pesan' && isChatOpen) ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
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
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Mahasiswa</h1>
            </div>
            <div className="flex items-center mt-2 space-x-2">
              <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase">{currentUser.univ || 'Universitas'}</span>
              {currentUser.verified ? (
                <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md">
                  <CheckCircle2 size={14} className="mr-1" /> Terverifikasi
                </span>
              ) : currentUser.verificationDoc ? (
                <button 
                  onClick={() => setShowVerificationModal(true)} 
                  className="flex items-center text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-md transition-colors"
                  title="Dokumen telah dikirim, klik untuk melihat atau mengubah"
                >
                  <Clock size={14} className="mr-1" /> Verifikasi Terkirim (Menunggu Admin)
                </button>
              ) : (
                <button 
                  onClick={() => setShowVerificationModal(true)} 
                  className="flex items-center text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-md transition-colors shadow-xs"
                  title="Klik untuk mengajukan verifikasi KTM"
                >
                  <ShieldCheck size={14} className="mr-1" /> Ajukan Verifikasi KTM
                </button>
              )}
            </div>
          </div>

          {/* Top-right quick actions: Saldo Dompet & Notification Bell */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setActiveTab('dompet')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
              title="Lihat Dompet & Saldo"
            >
              <CreditCard size={15} className="text-blue-600" />
              <span>Rp {(currentUser.balance || 0).toLocaleString('id-ID')}</span>
            </button>

            <NotificationBell
              currentUser={currentUser}
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              onMarkAllAsRead={onMarkAllAsRead}
              onDeleteNotification={onDeleteNotification}
              onClearAll={onClearAll}
              onAction={(notif) => {
                if (notif.actionType === 'open_certificate' && notif.contextId) {
                  const proj = projects.find(p => p.id === notif.contextId);
                  if (proj) {
                    if (onViewCertificate) {
                      onViewCertificate(proj, currentUser);
                    } else {
                      setSelectedCertificateProject(proj);
                    }
                  } else {
                    setActiveTab('profil');
                  }
                } else if (notif.actionType === 'open_profile') {
                  setActiveTab('profil');
                  // If rejected, open re-verification upload modal so student can resubmit
                  if (!currentUser.verified && notif.type === 'verification_rejected') {
                    setShowVerificationModal(true);
                  } else {
                    // Already verified or general profile view: keep modal closed, navigate to profil tab, highlight status card
                    setShowVerificationModal(false);
                    setHighlightVerification(true);
                    setTimeout(() => {
                      const el = document.getElementById('verifikasi-identitas-mahasiswa');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 100);
                    setTimeout(() => {
                      setHighlightVerification(false);
                    }, 3500);
                  }
                } else if (notif.actionType === 'open_wallet') {
                  setActiveTab('dompet');
                } else if (notif.actionType === 'open_student_services') {
                  setActiveTab('jasa');
                } else if (notif.actionType === 'open_project' || notif.actionType === 'open_lamaran') {
                  setActiveTab(notif.actionType === 'open_lamaran' ? 'lamaran' : 'cari');
                } else if (notif.actionType === 'open_chat' && notif.contextId) {
                  setActiveChatId(notif.contextId);
                  setIsChatOpen(true);
                }
              }}
            />
          </div>
        </div>

        {/* Verification banner if not verified */}
        {!currentUser.verified && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-sm font-extrabold text-amber-950">
                  {currentUser.verificationDoc ? 'Dokumen Verifikasi KTM Sedang Ditinjau' : 'Verifikasi Akun Mahasiswa Anda'}
                </p>
                <p className="text-xs text-amber-800">
                  {currentUser.verificationDoc
                    ? 'Dokumen verifikasi Anda sudah masuk ke antrean Admin. Anda dapat mengecek atau memperbarui data kapan saja.'
                    : 'Unggah foto KTM atau kirimkan tautan dokumen (Google Drive) agar profil Anda memiliki badge resmi terverifikasi.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowVerificationModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-center shadow-xs flex items-center gap-1.5"
            >
              {currentUser.verificationDoc ? <Eye size={14} /> : <Upload size={14} />}
              {currentUser.verificationDoc ? 'Lihat / Perbarui Dokumen' : 'Kirim Berkas Verifikasi'}
            </button>
          </div>
        )}

        {safeTab === 'dompet' && <DompetView role="student" currentUser={currentUser} onRequestTransaction={onRequestTransaction} transactions={transactions} />}
        {safeTab === 'jasa' && (
          <StudentServicesView
            currentUser={currentUser}
            studentServices={studentServices}
            onCreateStudentService={onCreateStudentService}
            onDeleteStudentService={onDeleteStudentService}
            serviceOrders={serviceOrders}
            onSubmitServiceWork={onSubmitServiceWork}
            onCancelServiceOrder={onCancelServiceOrder}
            showToast={showToast}
            onNavigateToPost={() => setActiveTab('post_jasa')}
          />
        )}

        {safeTab === 'post_jasa' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Posting Penawaran Jasa Baru</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const cat = isCustomServiceCategory ? formData.get('custom_category') : formData.get('category');
              const delivery = isCustomDelivery ? formData.get('custom_delivery') : formData.get('delivery_time');
              const priceVal = formData.get('price');
              const titleVal = formData.get('title');
              const descVal = formData.get('desc');
              const tagsVal = formData.get('tags');
              const typeVal = formData.get('type') || newServiceType;
              const locationVal = typeVal === 'Offline' ? newServiceLocation : '';

              if (!titleVal || !priceVal || Number(priceVal) <= 0) {
                if (showToast) showToast('Harap lengkapi judul dan harga penawaran jasa!', 'error');
                return;
              }

              const tagList = tagsVal
                ? String(tagsVal).split(',').map(s => s.trim()).filter(Boolean)
                : [String(cat || 'Jasa'), String(typeVal)];

              onCreateStudentService({
                title: String(titleVal),
                category: String(cat || 'Desain Grafis'),
                type: String(typeVal),
                format: formData.get('format') || 'Jasa Kustom',
                price: Number(priceVal),
                deliveryTime: String(delivery || '2-3 Hari'),
                desc: String(descVal || ''),
                tags: tagList,
                previewUrl: newServicePreviewUrl || PRESET_STUDENT_SERVICE_IMAGES[0].url,
                location: locationVal
              });

              e.target.reset();
              setNewServicePrice('');
              setNewServiceLocation('');
              setNewServicePreviewUrl('');
              setIsCustomServiceCategory(false);
              setIsCustomDelivery(false);
              if (showToast) showToast('Penawaran jasa Anda berhasil diposting dan kini tampil di katalog UMKM!', 'success');
              setActiveTab('jasa');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Judul Penawaran Jasa</label>
                <input
                  name="title"
                  required
                  type="text"
                  placeholder="Cth: Jasa Desain Feed Instagram & Banner Toko"
                  className="w-full p-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tipe Jasa</label>
                  <select
                    name="type"
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Online">Online (Remote)</option>
                    <option value="Offline">Offline (On-site)</option>
                  </select>
                </div>
                {newServiceType === 'Offline' ? (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi (Kota / Area)</label>
                    <LocationPicker name="location" value={newServiceLocation} onChange={setNewServiceLocation} />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Format Layanan</label>
                    <select
                      name="format"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Jasa Kustom">Jasa Kustom (Sesuai Kebutuhan)</option>
                      <option value="Template / Desain Jadi">Template / Desain Jadi</option>
                      <option value="Konsultasi & Audit">Konsultasi &amp; Pendampingan</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                  <select
                    name="category"
                    value={newServiceCategory}
                    onChange={(e) => {
                      setNewServiceCategory(e.target.value);
                      setIsCustomServiceCategory(e.target.value === 'Custom');
                    }}
                    required={!isCustomServiceCategory}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white mb-2"
                  >
                    <option value="Desain Grafis">Desain Grafis</option>
                    <option value="Pemasaran Digital">Pemasaran Digital</option>
                    <option value="Web & Teknologi">Web &amp; Teknologi</option>
                    <option value="Administrasi">Administrasi</option>
                    <option value="Video & Animasi">Video &amp; Animasi</option>
                    <option value="Penulisan & Konten">Penulisan &amp; Konten</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {isCustomServiceCategory && (
                    <input
                      name="custom_category"
                      required
                      type="text"
                      placeholder="Masukkan kategori jasa..."
                      className="w-full p-3 rounded-xl border border-slate-200"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Harga Jasa Ditawarkan (Rp)</label>
                  <input
                    name="price"
                    required
                    type="number"
                    min="10000"
                    placeholder="Cth: 150000"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200"
                  />
                  {Number(newServicePrice) > 0 && (() => {
                    const feeInfo = calculateServiceFee(Number(newServicePrice));
                    return (
                      <div className={`mt-2 p-3 rounded-xl border text-xs ${feeInfo.isFree ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-blue-50 border-blue-200 text-blue-950'}`}>
                        {feeInfo.isFree ? (
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
                              <span className="bg-emerald-200 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                                Bebas Fee Platform (Promo &le; Rp 100.000)
                              </span>
                            </div>
                            <p className="text-slate-600">
                              Harga jasa &le; Rp 100.000 bebas potongan platform (0% Fee). Anda akan menerima honor utuh 100% sebesar <strong>Rp {feeInfo.studentReceives.toLocaleString('id-ID')}</strong> saat jasa dibeli &amp; disetujui UMKM.
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1">
                              <span className="bg-blue-200 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                                Ketentuan Fee Platform Flat 10%
                              </span>
                            </div>
                            <div className="space-y-1 text-slate-700">
                              <div className="flex justify-between">
                                <span>Harga Ditagih ke UMKM:</span>
                                <span className="font-semibold">Rp {feeInfo.price.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Potongan Fee Platform (10%):</span>
                                <span className="font-semibold text-red-600">- Rp {feeInfo.platformFee.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-blue-200 font-bold text-slate-900">
                                <span>Estimasi Bersih yang Diterima:</span>
                                <span className="text-blue-700 font-extrabold">Rp {feeInfo.studentReceives.toLocaleString('id-ID')}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Estimasi Pengerjaan</label>
                  <select
                    name="delivery_time"
                    value={newServiceDelivery}
                    onChange={(e) => {
                      setNewServiceDelivery(e.target.value);
                      setIsCustomDelivery(e.target.value === 'Custom');
                    }}
                    required={!isCustomDelivery}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white mb-2"
                  >
                    <option value="1 Hari">1 Hari</option>
                    <option value="2-3 Hari">2-3 Hari</option>
                    <option value="5-7 Hari">5-7 Hari</option>
                    <option value="1-2 Minggu">1-2 Minggu</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {isCustomDelivery && (
                    <input
                      name="custom_delivery"
                      required
                      type="text"
                      placeholder="Masukkan estimasi pengerjaan... (Cth: 4 Hari)"
                      className="w-full p-3 rounded-xl border border-slate-200"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tags (Pisahkan koma)</label>
                  <input
                    name="tags"
                    type="text"
                    placeholder="Logo, Figma, Canva, Revisi 2x"
                    className="w-full p-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Sampul / Gambar Preview Jasa */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Sampul Portfolio / Gambar Preview
                </label>
                <p className="text-xs text-slate-400 mb-2">Gunakan preset sampel cepat di bawah atau masukkan tautan URL gambar Anda.</p>
                <input
                  name="preview_url"
                  type="url"
                  placeholder="https://images.unsplash.com/... atau tautan gambar"
                  value={newServicePreviewUrl}
                  onChange={(e) => setNewServicePreviewUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 mb-2"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_STUDENT_SERVICE_IMAGES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewServicePreviewUrl(p.url)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                        newServicePreviewUrl === p.url
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <ImageIcon size={13} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>

                {newServicePreviewUrl && (
                  <div className="mt-3 relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={newServicePreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = PRESET_STUDENT_SERVICE_IMAGES[0].url; }}
                    />
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Preview Gambar Terpilih
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Penawaran Jasa</label>
                <textarea
                  name="desc"
                  required
                  rows="4"
                  placeholder="Ceritakan detail jasa yang ditawarkan, apa saja yang akan didapatkan oleh UMKM, syarat revisi, dan pengalaman portofolio Anda..."
                  className="w-full p-3 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md"
              >
                Posting Penawaran Jasa
              </button>
            </form>
          </div>
        )}
        <ChatView currentUser={currentUser} users={users} role="student" messages={messages} setMessages={setMessages} initialActiveChat={activeChatId} activeChatContext={activeChatContext} setActiveChatContext={setActiveChatContext} projects={projects} isChatOpen={isChatOpen || safeTab === 'pesan'} onClose={() => { setIsChatOpen(false); if(safeTab === 'pesan') setActiveTab('cari'); }} sendNotification={sendNotification} />

        {safeTab === 'cari' && (
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
                  const myApp = project.applicants.find((a) => a.studentId === currentUser.id);
                  const isPreviouslyRejected = myApp && myApp.status === 'Ditolak';
                  const isPending = myApp && (myApp.status === 'Menunggu' || myApp.status === 'Pending');

                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={'bg-white p-6 rounded-2xl border transition-all group cursor-pointer ' + (
                        isPending
                          ? 'border-slate-200 hover:border-slate-300 opacity-80'
                          : isPreviouslyRejected
                          ? 'border-rose-200 hover:border-rose-400 hover:shadow-md bg-gradient-to-r from-rose-50/20 to-white'
                          : 'border-slate-200 hover:border-blue-400 hover:shadow-md'
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-500 mb-1">{project.umkmName}</p>
                          <h3 className={'text-xl font-extrabold ' + (
                            isPending ? 'text-slate-700' : isPreviouslyRejected ? 'text-slate-900 group-hover:text-rose-600' : 'text-slate-900 group-hover:text-blue-600'
                          )}>{project.title}</h3>
                        </div>
                        <div className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                          <p className="text-sm font-extrabold text-green-700">{formatRupiah(project.budget)}</p>
                        </div>
                      </div>

                      {/* Keterangan Pernah Ditolak di Card */}
                      {isPreviouslyRejected && (
                        <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                            <AlertCircle size={14} className="text-rose-600 shrink-0" />
                            <span>Keterangan: Lamaran sebelumnya pernah ditolak ({myApp.date})</span>
                          </div>
                          <span className="text-[11px] font-extrabold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                            <RotateCcw size={11} /> Bisa Lamar Lagi
                          </span>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.type === 'Offline' ? (
                          <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center">
                            📍 Offline - {project.location}
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-2.5 py-1 rounded-md flex items-center">
                            🌐 Online
                          </span>
                        )}
                        {project.tags.map((tag) => (
                          <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                          <Users size={14} className="text-blue-600" />
                          <span>{project.applicants.length > 0 ? `${project.applicants.length} Mahasiswa Melamar` : 'Belum Ada Pelamar'}</span>
                        </div>

                        {isPending ? (
                          <span className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            <Clock size={13} className="mr-1.5 text-blue-500" /> Sudah Dilamar (Menunggu)
                          </span>
                        ) : isPreviouslyRejected ? (
                          <span className="inline-flex items-center text-xs font-bold text-rose-600 group-hover:text-rose-700 gap-1 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-full border border-rose-200 transition-colors">
                            <RotateCcw size={13} /> Ajukan Ulang Lamaran &rarr;
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                            Lihat & Lamar &rarr;
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {safeTab === 'lamaran' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Riwayat Lamaran</h2>
                <p className="text-sm text-slate-500">Kelola dan pantau seluruh status proyek yang Anda lamar.</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'Semua', label: 'Semua' },
                  { key: 'Aktif', label: 'Sedang Berjalan' },
                  { key: 'Menunggu', label: 'Menunggu Review' },
                  { key: 'Selesai', label: 'Selesai' },
                  { key: 'Pending', label: 'Pending Lamaran' },
                  { key: 'Ditolak', label: 'Belum Diterima' }
                ].map(filter => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setLamaranStatusFilter(filter.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      lamaranStatusFilter === filter.key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const filteredApplications = myApplications.filter(project => {
                const application = (project.applicants || []).find(a => a.studentId === currentUser?.id);
                if (!application) return false;
                if (lamaranStatusFilter === 'Semua') return true;
                if (lamaranStatusFilter === 'Aktif') {
                  return application.status === 'Diterima' && project.status !== 'Selesai' && project.status !== 'Menunggu Review';
                }
                if (lamaranStatusFilter === 'Menunggu') {
                  return project.status === 'Menunggu Review' || project.status === 'Menunggu Banding' || project.status === 'Banding Berlangsung';
                }
                if (lamaranStatusFilter === 'Selesai') {
                  return project.status === 'Selesai';
                }
                if (lamaranStatusFilter === 'Pending') {
                  return application.status === 'Pending' || application.status === 'Menunggu';
                }
                if (lamaranStatusFilter === 'Ditolak') {
                  return application.status === 'Ditolak';
                }
                return true;
              });

              if (filteredApplications.length === 0) {
                return (
                  <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center">
                    <Briefcase className="mx-auto mb-3 text-slate-300" size={40} />
                    <p className="text-slate-500 font-medium">Tidak ada lamaran pada kategori ini.</p>
                    {lamaranStatusFilter !== 'Semua' && (
                      <button onClick={() => setLamaranStatusFilter('Semua')} className="mt-2 text-xs font-bold text-blue-600 hover:underline">
                        Tampilkan Semua
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="grid gap-4">
                  {filteredApplications.map(project => {
                    const application = project.applicants.find(a => a.studentId === currentUser.id);
                    let statusColor = 'bg-amber-100 text-amber-700';
                    if (application.status === 'Diterima' || project.status === 'Selesai') statusColor = 'bg-green-100 text-green-700';
                    if (application.status === 'Ditolak') statusColor = 'bg-red-100 text-red-700';

                    const isAccepted = application.status === 'Diterima';
                    const isCompleted = project.status === 'Selesai';
                    const studentHasReviewed = project.reviews && project.reviews.some(r => r.fromId === currentUser.id);
                    
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
                          {project.type === 'Offline' ? (
                             <span className="inline-block mt-1 bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded flex items-center w-fit">📍 Offline - {project.location}</span>
                          ) : (
                             <span className="inline-block mt-1 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded flex items-center w-fit">🌐 Online</span>
                          )}
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.desc}</p>
                          <p className="text-sm text-slate-500 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">Proposal: "{application.proposal}"</p>
                          <p className="text-xs font-bold text-slate-400 mt-2">Dilamar pada: {application.date}</p>

                          {/* Keterangan jika lamaran ditolak & info bisa lamar lagi */}
                          {application.status === 'Ditolak' && (
                            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                              <div className="flex items-center gap-1.5 font-bold">
                                <AlertCircle size={14} className="text-rose-600" />
                                <span>Status: Lamaran Belum Diterima</span>
                              </div>
                              <p className="text-rose-700 leading-relaxed">
                                {project.status === 'open' 
                                  ? 'Lowongan ini masih dibuka oleh UMKM. Anda dapat memperbaiki proposal dan mengajukan lamaran kembali.'
                                  : 'Lowongan ini saat ini telah terisi atau ditutup oleh UMKM.'}
                              </p>
                            </div>
                          )}

                          {application.reapplied && application.status === 'Menunggu' && (
                            <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-1.5">
                              <RotateCcw size={13} className="text-blue-600 shrink-0" />
                              <span>Lamaran ulang telah dikirim dan sedang menunggu tinjauan dari UMKM.</span>
                            </div>
                          )}
                          
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
                               <div className="flex items-center justify-between">
                                 <p className="text-sm font-bold text-amber-800">
                                   {project.type === 'Offline' ? '📍 Bukti Lapangan Menunggu Review UMKM' : 'Menunggu Review UMKM'}
                                 </p>
                                 <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">Terkirim</span>
                               </div>
                               <p className="text-xs text-amber-700 mt-1">
                                 {project.type === 'Offline'
                                   ? 'Foto dokumentasi dan kode PIN serah terima telah dikirimkan ke UMKM.'
                                   : 'Pekerjaan digital telah dikirim dan sedang diperiksa oleh UMKM.'}
                               </p>
                               {project.submission && (
                                 <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs space-y-2">
                                   {project.type === 'Offline' ? (
                                     <>
                                       <div className="flex flex-wrap items-center gap-2">
                                         <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg">
                                           <Key size={12} className="text-emerald-600" />
                                           PIN: <span className="font-mono">{project.submission.pin}</span>
                                           {project.submission.pinVerified && <CheckCircle2 size={12} className="text-emerald-600 ml-0.5" />}
                                         </span>
                                         {project.submission.workDuration && (
                                           <span className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                                             ⏱️ {project.submission.workDuration}
                                           </span>
                                         )}
                                         {project.submission.picName && (
                                           <span className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                                             👤 PIC: {project.submission.picName}
                                           </span>
                                         )}
                                       </div>

                                       {project.submission.photos && project.submission.photos.length > 0 && (
                                         <div>
                                           <p className="font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                                             <Camera size={13} className="text-slate-500" />
                                             Dokumentasi Foto ({project.submission.photos.length} foto):
                                           </p>
                                           <div className="flex flex-wrap gap-2">
                                             {project.submission.photos.map((photoUrl, pIdx) => (
                                               <div
                                                 key={pIdx}
                                                 onClick={() => setPreviewPhoto(photoUrl)}
                                                 className="w-16 h-16 rounded-xl overflow-hidden border border-amber-200 cursor-pointer shadow-xs hover:ring-2 hover:ring-amber-500 transition-all"
                                               >
                                                 <img src={photoUrl} alt="Bukti Lapangan" className="w-full h-full object-cover" />
                                               </div>
                                             ))}
                                           </div>
                                         </div>
                                       )}

                                       {project.submission.notes && (
                                         <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-amber-200/80 italic">
                                           "{project.submission.notes}"
                                         </p>
                                       )}
                                       {project.submission.link && (
                                         <a href={project.submission.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline flex items-center gap-1">
                                           <ExternalLink size={12} /> {project.submission.link}
                                         </a>
                                       )}
                                     </>
                                   ) : (
                                     <>
                                       <p className="font-bold text-slate-700">Bukti yang dikirim:</p>
                                       <a href={project.submission.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline flex items-center gap-1 mt-0.5 break-all">
                                         <ExternalLink size={12} /> {project.submission.link}
                                       </a>
                                       {project.submission.notes && (
                                         <p className="text-slate-600 mt-1 italic">"{project.submission.notes}"</p>
                                       )}
                                     </>
                                   )}
                                 </div>
                               )}
                             </div>
                          )}

                          {isCompleted && project.submission && (
                            <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                              <span className="font-bold text-slate-700 block">
                                {project.type === 'Offline' ? '📍 Bukti & Serah Terima Lapangan Terverifikasi:' : 'Tautan Hasil Kerja Terverifikasi:'}
                              </span>
                              {project.type === 'Offline' ? (
                                <div className="space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                                      <ShieldCheck size={12} className="text-emerald-600" />
                                      PIN Terverifikasi: {project.submission.pin}
                                    </span>
                                    {project.submission.workDuration && (
                                      <span className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                                        ⏱️ {project.submission.workDuration}
                                      </span>
                                    )}
                                  </div>
                                  {project.submission.photos && project.submission.photos.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {project.submission.photos.map((photoUrl, pIdx) => (
                                        <div
                                          key={pIdx}
                                          onClick={() => setPreviewPhoto(photoUrl)}
                                          className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:ring-2 hover:ring-blue-500"
                                        >
                                          <img src={photoUrl} alt="Bukti Lapangan" className="w-full h-full object-cover" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {project.submission.notes && (
                                    <p className="text-slate-600 italic bg-white p-2 rounded-xl border border-slate-200">
                                      "{project.submission.notes}"
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <a href={project.submission.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline flex items-center gap-1 mt-0.5">
                                    <ExternalLink size={12} /> {project.submission.link}
                                  </a>
                                  {project.submission.notes && (
                                    <p className="text-slate-600 italic mt-1">"{project.submission.notes}"</p>
                                  )}
                                </>
                              )}
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
                            {application.status === 'Ditolak' && project.status === 'open' && (
                              <button
                                onClick={() => {
                                  setSelectedProject(project);
                                  setProposalText(application.proposal ? `Halo, saya ingin mengajukan lamaran ulang untuk project ini.\n\nPerbaikan proposal & portofolio:\n- ` : '');
                                  setShowApplyModal(true);
                                }}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                <RotateCcw size={14} /> Lamar Ulang
                              </button>
                            )}
                            <button onClick={() => handleStartChat(project.umkmId, project.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors flex items-center">
                              <MessageCircle size={16} className="mr-1.5" /> Chat
                            </button>
                            {(isAccepted && !isCompleted && project.status !== 'Menunggu Review' && project.status !== 'Menunggu Banding' && project.status !== 'Banding Berlangsung') && (
                              <button 
                                onClick={() => {
                                  setSubmittingProjectId(project.id);
                                  setSubmissionLink('');
                                  setSubmissionNotes('');
                                  setOfflinePhotos([]);
                                  setOfflinePin('');
                                  setOfflineDuration('');
                                  setOfflinePicName('');
                                }} 
                                className={`${
                                  project.type === 'Offline'
                                    ? 'bg-amber-600 hover:bg-amber-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5`}
                              >
                                {project.type === 'Offline' ? (
                                  <>
                                    <Camera size={16} /> Kirim Bukti Lapangan
                                  </>
                                ) : (
                                  'Kirim Hasil Kerja'
                                )}
                              </button>
                            )}
                            {isCompleted && (
                              <button 
                                onClick={() => setCertificateProject(project)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                <Award size={15} /> E-Sertifikat
                              </button>
                            )}
                            {isCompleted && !studentHasReviewed && (
                              <button 
                                onClick={() => {
                                  setReviewingProject(project);
                                  setReviewRating(5);
                                  setReviewComment('');
                                }} 
                                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                <Star size={14} className="fill-white" /> Beri Ulasan UMKM
                              </button>
                            )}
                            {isCompleted && studentHasReviewed && (
                              <span className="inline-flex items-center text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
                                <CheckCircle2 size={14} className="mr-1" /> Sudah Diulas
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {safeTab === 'profil' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h2>
                  <p className="text-slate-500 font-medium">{currentUser.univ} • Semester {currentUser.semester || '?'}</p>
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

              {/* Verifikasi Identitas Mahasiswa */}
              <div
                id="verifikasi-identitas-mahasiswa"
                className={`p-5 rounded-2xl border transition-all duration-500 scroll-mt-24 ${
                  highlightVerification
                    ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200/70 shadow-lg'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        Status Verifikasi Identitas Mahasiswa
                        {currentUser.verified ? (
                          <span className="text-[11px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={12} /> Terverifikasi Resmi
                          </span>
                        ) : currentUser.verificationStatus === 'Rejected' ? (
                          <span className="text-[11px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <XCircle size={12} /> Verifikasi Ditolak
                          </span>
                        ) : currentUser.verificationDoc ? (
                          <span className="text-[11px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock size={12} /> Dalam Peninjauan Admin
                          </span>
                        ) : (
                          <span className="text-[11px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                            Belum Terverifikasi
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {currentUser.verified
                          ? 'Akun Anda telah diverifikasi resmi oleh Admin. Lencana terverifikasi meningkatkan kepercayaan UMKM terhadap lamaran Anda.'
                          : currentUser.verificationStatus === 'Rejected'
                          ? `Pengajuan verifikasi KTM Anda ditolak oleh Admin. Catatan: "${currentUser.verificationRejectReason || 'Dokumen belum memenuhi kriteria.'}". Silakan unggah perbaikan berkas.`
                          : currentUser.verificationDoc
                          ? `Dokumen telah dikirim (${currentUser.verificationDoc.type === 'photo' ? 'Foto KTM' : 'Tautan Drive'}). Admin sedang meninjau berkas Anda.`
                          : 'Kirimkan foto Kartu Tanda Mahasiswa (KTM) atau tautan Google Drive untuk mendapatkan tanda centang verifikasi.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(true)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-center shadow-xs flex items-center gap-1.5 ${
                      currentUser.verificationStatus === 'Rejected'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : currentUser.verified
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {currentUser.verified
                      ? 'Lihat Berkas Terverifikasi'
                      : currentUser.verificationStatus === 'Rejected'
                      ? 'Perbaiki & Ajukan Ulang'
                      : currentUser.verificationDoc
                      ? 'Periksa / Ubah Berkas'
                      : 'Unggah Dokumen KTM'}
                  </button>
                </div>
              </div>

              {/* Koleksi E-Sertifikat Terverifikasi */}
              <div className="border-t border-slate-200/80 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Award size={16} className="text-amber-500" />
                      Koleksi E-Sertifikat Terverifikasi
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sertifikat resmi micro-credential yang diterbitkan oleh GigSkill dan mitra UMKM ber-QR Code.
                    </p>
                  </div>
                </div>
                {(() => {
                  const completedProjects = projects.filter(p => 
                    p.status === 'Selesai' && 
                    p.applicants && 
                    p.applicants.some(a => a.studentId === currentUser.id && (a.status === 'Diterima' || a.status === 'Selesai'))
                  );

                  if (completedProjects.length === 0) {
                    return (
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 text-center">
                        <Award size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-slate-500 font-bold text-sm">Belum Ada E-Sertifikat</p>
                        <p className="text-slate-400 text-xs mt-1">Selesaikan proyek pertama Anda untuk mendapatkan e-sertifikat resmi ber-QR Code!</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {completedProjects.map(cp => (
                        <div key={cp.id} className="p-4 bg-gradient-to-br from-white to-amber-50/20 border border-amber-200/70 rounded-2xl flex flex-col justify-between shadow-xs hover:border-amber-400 transition-all">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={11} /> Terverifikasi
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {cp.completedDate || '21/09/2026'}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">{cp.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">Mitra: <strong className="text-slate-700">{cp.umkmName}</strong></p>
                          </div>
                          <button
                            onClick={() => setCertificateProject(cp)}
                            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Award size={14} /> Buka & Unduh E-Sertifikat
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Ulasan & Reputasi UMKM</h3>
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span>{currentUser.rating ? Number(currentUser.rating).toFixed(1) : '5.0'} / 5.0</span>
                    <span className="text-slate-400 font-medium">({currentUser.userReviews ? currentUser.userReviews.length : 0} ulasan)</span>
                  </div>
                </div>

                {currentUser.userReviews && currentUser.userReviews.length > 0 ? (
                  <div className="space-y-3">
                    {currentUser.userReviews.map((rev, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-slate-800 text-sm">{rev.fromName}</span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            <span>{rev.rating}.0</span>
                            <span className="text-slate-400 ml-1 font-normal">{rev.date}</span>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/70 text-center">
                    <p className="text-slate-400 text-sm">Belum ada ulasan dari UMKM. Selesaikan proyek untuk mendapatkan reputasi pertama Anda!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal untuk Pratinjau Foto Dokumentasi Lapangan */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[130] flex items-center justify-center p-4" 
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-3 border border-white/10" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-2 text-white">
              <span className="text-sm font-bold flex items-center gap-2">
                <Camera size={16} className="text-amber-400" /> Dokumentasi Lapangan (Offline)
              </span>
              <button 
                onClick={() => setPreviewPhoto(null)} 
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden p-1">
              <img 
                src={previewPhoto} 
                alt="Pratinjau Foto" 
                className="max-h-[72vh] w-auto object-contain rounded-xl" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {certificateProject && (
        <CertificateModal
          project={certificateProject}
          student={currentUser}
          umkm={{ name: certificateProject.umkmName }}
          onClose={() => setCertificateProject(null)}
        />
      )}
    </div>
  );
}