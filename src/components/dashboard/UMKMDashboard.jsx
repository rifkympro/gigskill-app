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
  RotateCcw,
  AlertCircle,
  AlertTriangle,
  Camera,
  Image as ImageIcon,
  Key,
  Copy,
  Check,
  Upload,
  FileText,
  Link,
  Eye,
  Send,
  Award,
  ShoppingBag
} from 'lucide-react';
import LocationPicker from '../common/LocationPicker.jsx';
import DompetView from './DompetView.jsx';
import ChatView from './ChatView.jsx';
import CertificateModal from './CertificateModal.jsx';
import NotificationBell from '../common/NotificationBell.jsx';
import UMKMServicesCatalog from '../services/UMKMServicesCatalog.jsx';
import { calculateProjectFee, FREE_FEE_THRESHOLD } from '../../utils/feeCalculator.js';

export default function UMKMDashboard({
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
  onRequestTransaction,
  onAddReview,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  studentServices = [],
  serviceOrders = [],
  onOrderStudentService,
  onCompleteServiceOrder,
  onCancelServiceOrder,
  onCancelProject,
  onCreateStudentService,
  onDeleteStudentService,
  onSubmitServiceWork,
  sendNotification,
  showToast
}) {
  const [activeTab, setActiveTab] = React.useState('project');
  const [activeChatId, setActiveChatId] = React.useState(null);
  const [rejectForm, setRejectForm] = React.useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  
  const [projectStatusFilter, setProjectStatusFilter] = React.useState('Semua');

  // Review Modal state for reviewing student
  const [reviewingProject, setReviewingProject] = React.useState(null);
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [certificateProject, setCertificateProject] = React.useState(null);

  const [isCustomCategory, setIsCustomCategory] = React.useState(false);
  const [projectType, setProjectType] = React.useState('Online');
  const [newProjectLocation, setNewProjectLocation] = React.useState('');
  const [isCustomDeadline, setIsCustomDeadline] = React.useState(false);
  const [expandedProject, setExpandedProject] = React.useState(null);
  const [showStudentProfile, setShowStudentProfile] = React.useState(null);
  const [copiedPinProjectId, setCopiedPinProjectId] = React.useState(null);
  const [previewPhoto, setPreviewPhoto] = React.useState(null);
  const [budgetInput, setBudgetInput] = React.useState('');

  // Verification state for UMKM
  const [showVerificationModal, setShowVerificationModal] = React.useState(false);
  const [highlightVerification, setHighlightVerification] = React.useState(false);
  const validTabs = ['project', 'post', 'katalog_jasa', 'profil', 'dompet', 'pesan'];
  const safeTab = activeTab === 'profile' ? 'profil' : (validTabs.includes(activeTab) ? activeTab : 'project');
  const [verificationType, setVerificationType] = React.useState(currentUser?.verificationDoc?.type || 'photo');
  const [verificationLink, setVerificationLink] = React.useState(currentUser?.verificationDoc?.type === 'link' ? currentUser.verificationDoc.value : '');
  const [verificationFileUrl, setVerificationFileUrl] = React.useState(currentUser?.verificationDoc?.type === 'photo' ? currentUser.verificationDoc.value : '');
  const [verificationFileName, setVerificationFileName] = React.useState(currentUser?.verificationDoc?.fileName || '');
  const [verificationNotes, setVerificationNotes] = React.useState(currentUser?.verificationDoc?.notes || '');

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

      {/* Modal Verifikasi Dokumen Usaha UMKM */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4" onClick={() => setShowVerificationModal(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600" size={24} />
                  Verifikasi Usaha UMKM
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kirimkan foto legalitas (NIB / SIUP / Surat Izin) atau tautan dokumen cloud untuk diverifikasi Admin.
                </p>
              </div>
              <button onClick={() => setShowVerificationModal(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {currentUser.verified ? (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1.5">
                <p className="font-extrabold flex items-center gap-1.5 text-emerald-900 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Usaha UMKM Terverifikasi Resmi
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  Selamat! Dokumen legalitas usaha Anda telah disetujui resmi oleh Admin GigSkill. Lencana terverifikasi aktif pada profil UMKM Anda.
                </p>
                {currentUser.verificationDoc && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-200/80 text-emerald-900">
                    <p className="text-[11px] font-medium">Metode: {currentUser.verificationDoc.type === 'photo' ? '📷 Foto Dokumen / Tempat' : '🔗 Tautan Dokumen (Cloud)'}</p>
                    <p className="text-[11px] font-medium">Tanggal Disetujui: {currentUser.verificationDoc.submittedAt || '-'}</p>
                    {currentUser.verificationDoc.type === 'photo' && currentUser.verificationDoc.value && (
                      <div className="mt-2">
                        <img src={currentUser.verificationDoc.value} alt="Dokumen UMKM" className="w-28 h-20 object-cover rounded-lg border border-emerald-300 cursor-pointer hover:opacity-90" onClick={() => setPreviewPhoto(currentUser.verificationDoc.value)} />
                        <span className="text-[10px] text-emerald-700 underline cursor-pointer mt-0.5 block" onClick={() => setPreviewPhoto(currentUser.verificationDoc.value)}>Perbesar Foto</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : currentUser.verificationStatus === 'Rejected' ? (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-red-950">
                  <AlertTriangle size={15} className="text-red-600" /> Pengajuan Sebelumnya Ditolak Admin
                </p>
                <p className="text-red-800">
                  <strong>Alasan Penolakan:</strong> {currentUser.verificationRejectReason || 'Dokumen belum memenuhi persyaratan verifikasi.'}
                </p>
                <p className="text-[11px] text-red-600 font-medium">
                  Silakan perbaiki atau unggah berkas legalitas terbaru di bawah ini untuk ditinjau ulang oleh tim Admin.
                </p>
              </div>
            ) : currentUser.verificationDoc ? (
              <div className="mb-4 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <Clock size={14} className="text-emerald-600" /> Dokumen Verifikasi Terkirim (Status: {currentUser.verificationStatus || 'Menunggu Verifikasi Admin'})
                </p>
                <p className="text-emerald-800">Metode: {currentUser.verificationDoc.type === 'photo' ? '📷 Foto Dokumen / Tempat' : '🔗 Tautan Dokumen (Cloud)'}</p>
                <p className="text-emerald-800">Tanggal Pengajuan: {currentUser.verificationDoc.submittedAt || '-'}</p>
                {currentUser.verificationDoc.notes && <p className="text-emerald-800">Keterangan: {currentUser.verificationDoc.notes}</p>}
                {currentUser.verificationDoc.type === 'photo' && currentUser.verificationDoc.value && (
                  <div className="mt-2">
                    <img src={currentUser.verificationDoc.value} alt="Dokumen UMKM" className="w-28 h-20 object-cover rounded-lg border border-emerald-200 cursor-pointer hover:opacity-90" onClick={() => setPreviewPhoto(currentUser.verificationDoc.value)} />
                    <span className="text-[10px] text-emerald-600 underline cursor-pointer mt-0.5 block" onClick={() => setPreviewPhoto(currentUser.verificationDoc.value)}>Perbesar Foto</span>
                  </div>
                )}
                {currentUser.verificationDoc.type === 'link' && currentUser.verificationDoc.value && (
                  <a href={currentUser.verificationDoc.value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline font-bold mt-1">
                    <ExternalLink size={12} /> Buka Tautan Berkas ({currentUser.verificationDoc.value.slice(0, 35)}...)
                  </a>
                )}
              </div>
            ) : null}

            <form onSubmit={(e) => {
              e.preventDefault();
              const docValue = verificationType === 'photo' ? verificationFileUrl : verificationLink.trim();
              if (!docValue) {
                alert(verificationType === 'photo' ? 'Silakan unggah foto dokumen/tempat usaha terlebih dahulu.' : 'Silakan masukkan tautan dokumen verifikasi.');
                return;
              }

              onUpdateProfile(currentUser.id, {
                verificationDoc: {
                  type: verificationType,
                  value: docValue,
                  fileName: verificationFileName,
                  notes: verificationNotes.trim() || `Dokumen Usaha ${currentUser.name}`,
                  submittedAt: new Date().toLocaleDateString('id-ID')
                },
                verificationStatus: 'Pending',
                verificationRejectReason: '',
                verified: false
              });

              setShowVerificationModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Metode Berkas Verifikasi:</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setVerificationType('photo')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      verificationType === 'photo' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Camera size={14} /> Unggah Foto NIB / Toko
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationType('link')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      verificationType === 'link' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link size={14} /> Tautan Dokumen (Drive)
                  </button>
                </div>
              </div>

              {verificationType === 'photo' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Foto Dokumen NIB / Surat Keterangan Usaha / Foto Tempat</label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors">
                    <Upload className="text-slate-400 mb-1" size={24} />
                    <span className="text-xs font-bold text-slate-700">Pilih / Foto Berkas Legalitas</span>
                    <span className="text-[10px] text-slate-400">Format JPG, PNG, atau scan dokumen</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setVerificationFileName(file.name);
                          const reader = new FileReader();
                          reader.onload = () => {
                            setVerificationFileUrl(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {verificationFileUrl && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200">
                      <img src={verificationFileUrl} alt="Preview Berkas UMKM" className="w-full h-36 object-cover" />
                      <div className="p-2 bg-slate-50 text-[11px] font-medium text-slate-600 truncate border-t border-slate-100">
                        {verificationFileName || 'Foto Berkas Terpilih'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tautan Dokumen Legalitas (Google Drive / Cloud)</label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="url"
                      required
                      value={verificationLink}
                      onChange={e => setVerificationLink(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Pastikan izin dokumen dapat dibuka oleh Admin (Anyone with the link can view).</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor NIB / Catatan Legalitas Usaha</label>
                <textarea
                  rows={2}
                  value={verificationNotes}
                  onChange={e => setVerificationNotes(e.target.value)}
                  placeholder="Contoh: Nomor Induk Berusaha (NIB): 9120003412019, Toko fisik beroperasi sejak 2021"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send size={14} /> Kirim Berkas ke Admin
                </button>
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
                <p className="text-slate-500 text-sm">{showStudentProfile.univ} • Semester {showStudentProfile.semester}</p>
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

      {/* Modal Beri Rating & Ulasan untuk Mahasiswa */}
      {reviewingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Beri Rating Mahasiswa</h2>
                <p className="text-slate-500 text-sm mt-1">
                  {reviewingProject.studentName} • {reviewingProject.projectTitle}
                </p>
              </div>
              <button onClick={() => setReviewingProject(null)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Beri Bintang Kinerja</p>
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
                  {reviewRating === 5 && 'Hasil Luar Biasa & Memuaskan (5/5)'}
                  {reviewRating === 4 && 'Hasil Sangat Bagus (4/5)'}
                  {reviewRating === 3 && 'Hasil Cukup Sesuai (3/5)'}
                  {reviewRating === 2 && 'Perlu Peningkatan Kualitas (2/5)'}
                  {reviewRating === 1 && 'Tidak Memuaskan (1/5)'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ulasan & Feedback untuk Mahasiswa</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Tulis ulasan Anda terkait ketepatan waktu, kualitas kerja, atau komunikasi mahasiswa ini..."
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
                    onAddReview(reviewingProject.projectId, {
                      fromRole: 'umkm',
                      fromId: currentUser.id,
                      fromName: currentUser.name,
                      toId: reviewingProject.studentId,
                      rating: reviewRating,
                      comment: reviewComment
                    });
                    setReviewingProject(null);
                    setReviewComment('');
                    setReviewRating(5);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold text-sm shadow-md"
                >
                  Kirim Rating
                </button>
              </div>
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
            { id: 'katalog_jasa', icon: Search, label: 'Cari Jasa' },
            { id: 'profil', icon: Store, label: 'Profil Usaha' },
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
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard UMKM</h1>
            </div>
            <p className="text-slate-500 mt-1 font-medium text-xs">Kelola proyek, pelamar, dan transaksi usaha Anda</p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {currentUser.verified ? (
              <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                <CheckCircle2 size={14} className="mr-1.5" /> UMKM Terverifikasi
              </span>
            ) : currentUser.verificationDoc ? (
              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                className="flex items-center text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-xl transition-colors shadow-xs"
                title="Dokumen telah dikirim, klik untuk melihat atau mengubah"
              >
                <Clock size={14} className="mr-1.5" /> Verifikasi Ditinjau
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                className="flex items-center text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors shadow-xs"
                title="Ajukan verifikasi legalitas usaha"
              >
                <ShieldCheck size={14} className="mr-1.5" /> Ajukan Verifikasi
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('dompet')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
              title="Lihat Dompet & Saldo"
            >
              <CreditCard size={15} className="text-emerald-600" />
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
                if (notif.actionType === 'open_project' && notif.contextId) {
                  setActiveTab('project');
                  const targetProj = projects.find(p => p.id === notif.contextId);
                  if (targetProj) {
                    setSelectedProjectForApplicants(targetProj);
                  }
                } else if (notif.actionType === 'open_wallet') {
                  setActiveTab('dompet');
                } else if (notif.actionType === 'open_umkm_services') {
                  setActiveTab('katalog_jasa');
                } else if (notif.actionType === 'open_profile') {
                  setActiveTab('profil');
                  if (!currentUser.verified && notif.type === 'verification_rejected') {
                    setShowVerificationModal(true);
                  } else {
                    setShowVerificationModal(false);
                    setHighlightVerification(true);
                    setTimeout(() => {
                      const el = document.getElementById('verifikasi-identitas-umkm');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 100);
                    setTimeout(() => {
                      setHighlightVerification(false);
                    }, 3500);
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Verification banner for UMKM */}
        {!currentUser.verified && (
          currentUser.verificationStatus === 'Rejected' ? (
            <div className="mb-6 p-4 bg-red-50/90 border border-red-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-red-950">
                    Pengajuan Verifikasi Legalitas Ditolak
                  </p>
                  <p className="text-xs text-red-800 mt-0.5">
                    <strong>Alasan Admin:</strong> {currentUser.verificationRejectReason || 'Dokumen belum memenuhi kriteria verifikasi.'}
                  </p>
                  <p className="text-[11px] text-red-600 mt-0.5">
                    Anda dapat mengunggah berkas legalitas perbaikan kapan saja agar ditinjau ulang oleh Admin.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerificationModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-center shadow-xs flex items-center gap-1.5"
              >
                <Upload size={14} /> Ajukan Ulang Berkas
              </button>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-amber-950">
                    {currentUser.verificationDoc ? 'Dokumen Legalitas Usaha Sedang Ditinjau' : 'Tingkatkan Kepercayaan: Verifikasi Usaha Anda'}
                  </p>
                  <p className="text-xs text-amber-800">
                    {currentUser.verificationDoc
                      ? 'Berkas NIB / SIUP / surat keterangan Anda sedang dalam peninjauan oleh Tim Admin.'
                      : 'Unggah foto izin usaha (NIB/SIUP/foto toko) atau tautan Google Drive untuk mendapatkan lencana resmi dari Admin.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerificationModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-center shadow-xs flex items-center gap-1.5"
              >
                {currentUser.verificationDoc ? <Eye size={14} /> : <Upload size={14} />}
                {currentUser.verificationDoc ? 'Lihat / Ubah Berkas' : 'Kirim Berkas Verifikasi'}
              </button>
            </div>
          )
        )}

        {safeTab === 'dompet' && <DompetView role="umkm" currentUser={currentUser} onRequestTransaction={onRequestTransaction} transactions={transactions} />}
        <ChatView currentUser={currentUser} users={users} role="umkm" messages={messages} setMessages={setMessages} initialActiveChat={activeChatId} activeChatContext={activeChatContext} setActiveChatContext={setActiveChatContext} projects={projects} isChatOpen={isChatOpen || safeTab === 'pesan'} onClose={() => { setIsChatOpen(false); if(safeTab === 'pesan') setActiveTab('project'); }} sendNotification={sendNotification} />

        {safeTab === 'project' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Daftar Project Saya</h2>
                <p className="text-sm text-slate-500">Kelola dan tinjau seluruh proyek serta pelamar mahasiswa.</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'Semua', label: 'Semua' },
                  { key: 'open', label: 'Mencari Pelamar' },
                  { key: 'Aktif', label: 'Sedang Berjalan' },
                  { key: 'Menunggu Review', label: 'Perlu Ditinjau' },
                  { key: 'Selesai', label: 'Selesai' }
                ].map(filter => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setProjectStatusFilter(filter.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      projectStatusFilter === filter.key
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
              const filteredProjects = myProjects.filter(project => {
                if (projectStatusFilter === 'Semua') return true;
                if (projectStatusFilter === 'open') return project.status === 'open';
                if (projectStatusFilter === 'Aktif') {
                  return project.status === 'Mahasiswa Terpilih' || (project.status !== 'open' && project.status !== 'Selesai' && project.status !== 'Menunggu Review');
                }
                if (projectStatusFilter === 'Menunggu Review') {
                  return project.status === 'Menunggu Review' || project.status === 'Menunggu Banding' || project.status === 'Banding Berlangsung';
                }
                if (projectStatusFilter === 'Selesai') return project.status === 'Selesai';
                return true;
              });

              if (filteredProjects.length === 0) {
                return (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="font-bold text-slate-500 mb-4">
                      {projectStatusFilter === 'Semua' ? 'Belum ada project yang diposting.' : 'Tidak ada project dengan status ini.'}
                    </p>
                    {projectStatusFilter === 'Semua' ? (
                      <button onClick={() => setActiveTab('post')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Buat Project Pertama</button>
                    ) : (
                      <button onClick={() => setProjectStatusFilter('Semua')} className="text-xs font-bold text-blue-600 hover:underline">Tampilkan Semua Project</button>
                    )}
                  </div>
                );
              }

              return (
                <div className="grid gap-6">
                  {filteredProjects.map((project) => (
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
                              project.status === 'Dibatalkan' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                              'bg-green-100 text-green-700 border-green-200'
                            }`}>
                              {project.status === 'open' ? 'Mencari Pelamar' : 
                               project.status === 'Selesai' ? 'Project Selesai' : 
                               project.status === 'Menunggu Review' ? 'Menunggu Review' :
                               project.status === 'Menunggu Banding' ? 'Menunggu Banding' :
                               project.status === 'Banding Berlangsung' ? 'Banding Berlangsung' :
                               project.status === 'Dibatalkan' ? 'Project Dibatalkan' :
                               'Mahasiswa Terpilih'}
                            </span>
                            {project.status === 'open' && onCancelProject && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Batalkan lowongan project "${project.title}"? Dana escrow sebesar ${formatRupiah(project.budget)} akan dikembalikan penuh ke dompet Anda.`)) {
                                    onCancelProject(project.id, 'Dibatalkan oleh UMKM');
                                  }
                                }}
                                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg transition-all"
                              >
                                Batalkan Project & Refund
                              </button>
                            )}
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
                        const umkmHasReviewed = project.reviews && project.reviews.some(r => r.fromId === currentUser.id);

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
                              
                              <div className="flex items-center gap-2 flex-wrap">
                                {project.status === 'Menunggu Review' && (
                                  <>
                                    <button onClick={() => { setRejectForm(project.id); setRejectReason(''); }} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Tolak & Banding</button>
                                    <button onClick={() => onReviewProject(project.id, true)} className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">Terima & Selesaikan</button>
                                  </>
                                )}
                                {project.status === 'Selesai' && (
                                  <button
                                    onClick={() => setCertificateProject({
                                      ...project,
                                      student: users?.find(u => u.id === acceptedApplicant.studentId) || {
                                        id: acceptedApplicant.studentId,
                                        name: acceptedApplicant.studentName,
                                        univ: 'Mahasiswa Terverifikasi'
                                      }
                                    })}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                                  >
                                    <Award size={14} /> E-Sertifikat
                                  </button>
                                )}
                                {project.status === 'Selesai' && !umkmHasReviewed && (
                                  <button
                                    onClick={() => {
                                      setReviewingProject({
                                        projectId: project.id,
                                        projectTitle: project.title,
                                        studentId: acceptedApplicant.studentId,
                                        studentName: acceptedApplicant.studentName
                                      });
                                      setReviewRating(5);
                                      setReviewComment('');
                                    }}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                                  >
                                    <Star size={14} className="fill-white" /> Beri Rating Mahasiswa
                                  </button>
                                )}
                                {project.status === 'Selesai' && umkmHasReviewed && (
                                  <span className="inline-flex items-center text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                                    <CheckCircle2 size={13} className="mr-1" /> Sudah Diulas
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Offline PIN Information Banner for UMKM */}
                            {project.type === 'Offline' && (
                              <div className="mt-3.5 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs sm:text-sm">
                                      <Key size={15} className="text-amber-600 shrink-0" />
                                      <span>Kode PIN Serah Terima Fisik (Offline)</span>
                                    </div>
                                    <p className="text-[11px] text-amber-800 leading-relaxed max-w-xl">
                                      Berikan kode PIN 4-digit ini kepada <strong>{acceptedApplicant.studentName}</strong> di tempat setelah Anda selesai memeriksa langsung hasil pekerjaan fisiknya. Mahasiswa memerlukan kode ini untuk mengonfirmasi penyelesaian tugas.
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-center px-3.5 py-1.5 bg-white rounded-xl border border-amber-300 shadow-xs">
                                      <span className="text-lg font-mono font-extrabold tracking-widest text-amber-950">
                                        {project.offlineVerificationCode || '8492'}
                                      </span>
                                      <span className="block text-[9px] text-amber-600 font-bold uppercase tracking-wider">PIN Verifikasi</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard?.writeText(project.offlineVerificationCode || '8492');
                                        setCopiedPinProjectId(project.id);
                                        setTimeout(() => setCopiedPinProjectId(null), 2500);
                                      }}
                                      className="px-3 py-2 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                                      title="Salin PIN"
                                    >
                                      {copiedPinProjectId === project.id ? (
                                        <>
                                          <Check size={13} className="text-emerald-600" />
                                          <span className="text-emerald-700 font-bold">Tersalin!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={13} />
                                          <span>Salin</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Submission Preview if available */}
                            {project.submission && (
                              <div className="mt-3.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                                    {project.type === 'Offline' ? '📍 Bukti Dokumentasi Fisik Lapangan (Offline)' : '🌐 Bukti Hasil Kerja Digital (Online)'}
                                  </span>
                                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                                    Dikirim: {project.submission.submittedAt || 'Hari ini'}
                                  </span>
                                </div>

                                {project.type === 'Offline' ? (
                                  <div className="space-y-3">
                                    {/* PIN Verification Badge */}
                                    <div className="flex flex-wrap items-center gap-2">
                                      {(project.submission.pinVerified || project.submission.pin === (project.offlineVerificationCode || '8492')) ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl">
                                          <ShieldCheck size={14} className="text-emerald-600" />
                                          PIN Serah Terima Valid & Cocok: <span className="font-mono">{project.submission.pin || project.offlineVerificationCode || '8492'}</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl">
                                          <AlertCircle size={14} className="text-amber-600" />
                                          PIN Dimasukkan: <span className="font-mono">{project.submission.pin || '-'}</span> (Harap dicek kembali)
                                        </span>
                                      )}

                                      {project.submission.workDuration && (
                                        <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-xl">
                                          <Clock size={13} className="text-slate-400" /> {project.submission.workDuration}
                                        </span>
                                      )}

                                      {project.submission.picName && (
                                        <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-xl">
                                          <User size={13} className="text-slate-400" /> PIC: {project.submission.picName}
                                        </span>
                                      )}
                                    </div>

                                    {/* Photo Gallery of Field Work */}
                                    {project.submission.photos && project.submission.photos.length > 0 && (
                                      <div>
                                        <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                                          <Camera size={14} className="text-slate-500" />
                                          Foto Dokumentasi Lapangan ({project.submission.photos.length} Foto - Klik untuk Perbesar):
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                          {project.submission.photos.map((photoUrl, pIdx) => (
                                            <div
                                              key={pIdx}
                                              onClick={() => setPreviewPhoto(photoUrl)}
                                              className="group relative h-24 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:border-blue-500 transition-all"
                                            >
                                              <img src={photoUrl} alt={`Foto Lapangan ${pIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                                <ExternalLink size={14} /> Lihat
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Field Notes / Summary */}
                                    {project.submission.notes && (
                                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                                        <span className="font-bold text-slate-800 block mb-0.5">Laporan Aktivitas Pekerjaan:</span>
                                        <p className="italic leading-relaxed">"{project.submission.notes}"</p>
                                      </div>
                                    )}

                                    {/* Optional Drive Link */}
                                    {project.submission.link && (
                                      <div className="text-xs flex items-center gap-2">
                                        <span className="text-slate-500 font-bold">Link Tambahan:</span>
                                        <a href={project.submission.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline flex items-center gap-1">
                                          <ExternalLink size={12} /> {project.submission.link}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  /* Online Submission */
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={project.submission.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1 break-all"
                                      >
                                        <ExternalLink size={13} /> {project.submission.link}
                                      </a>
                                    </div>
                                    {project.submission.notes && (
                                      <p className="text-xs text-slate-600 mt-1 italic">Catatan: "{project.submission.notes}"</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

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
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <p className="font-bold text-slate-900">{applicant.studentName}</p>
                                          {applicant.status !== 'Menunggu' && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${applicant.status === 'Diterima' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                              {applicant.status}
                                            </span>
                                          )}
                                          {applicant.previouslyRejected && applicant.status === 'Menunggu' && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                              <RotateCcw size={10} /> Lamaran Ulang (Pernah Ditolak)
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-500">{studentInfo?.univ} • Melamar pada {applicant.date}</p>
                                      </div>
                                    </div>
                                    <button onClick={() => setShowStudentProfile(studentInfo)} className="text-xs font-bold text-blue-600 hover:underline">Lihat Profil Lengkap</button>
                                  </div>
                                  
                                  <div className="mt-3 bg-white p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                                    <span className="font-bold text-slate-700 block mb-1">
                                      {applicant.previouslyRejected ? 'Pesan / Proposal Baru (Pengajuan Ulang):' : 'Pesan / Proposal:'}
                                    </span>
                                    "{applicant.proposal}"
                                  </div>

                                  {applicant.previouslyRejected && applicant.status === 'Menunggu' && (
                                    <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-1.5">
                                      <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                      <div>
                                        <span className="font-bold">Keterangan Pelamar:</span> Pelamar ini sebelumnya pernah ditolak pada {applicant.lastRejectedDate || 'periode lalu'}, dan kini mengajukan kembali dengan proposal yang telah diperbarui.
                                      </div>
                                    </div>
                                  )}

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
            );
          })()}
        </div>
        )}

        {safeTab === 'post' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Posting Project Baru</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onPostProject({
                type: formData.get('type'),
                location: formData.get('type') === 'Offline' ? formData.get('location') : '',
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
              setBudgetInput('');
              setNewProjectLocation('');
              setActiveTab('project');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Judul Project</label>
                <input name="title" required type="text" placeholder="Cth: Desain Logo Toko" className="w-full p-3 rounded-xl border border-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tipe Project</label>
                  <select 
                    name="type" 
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Online">Online (Remote)</option>
                    <option value="Offline">Offline (On-site)</option>
                  </select>
                </div>
                {projectType === 'Offline' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi (Kota / Area)</label>
                    { /* use state for location so it can be managed by LocationPicker */ }
                    <LocationPicker name="location" value={newProjectLocation} onChange={setNewProjectLocation} />
                  </div>
                )}
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Budget Honor Mahasiswa (Rp)</label>
                  <input 
                    name="budget" 
                    required 
                    type="number" 
                    placeholder="Cth: 150000" 
                    value={budgetInput}
                    onChange={e => setBudgetInput(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200" 
                  />
                  {Number(budgetInput) > 0 && (() => {
                    const feeInfo = calculateProjectFee(Number(budgetInput));
                    const umkmBal = Number(currentUser?.balance || 0);
                    const isEnough = umkmBal >= feeInfo.totalUmkmDeposit;
                    return (
                      <div className={`mt-2 p-3 rounded-xl border text-xs ${feeInfo.isFree ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-blue-50 border-blue-200 text-blue-950'}`}>
                        {feeInfo.isFree ? (
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
                              <span className="bg-emerald-200 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                                Bebas Fee (Promo &le; Rp 100.000)
                              </span>
                            </div>
                            <p className="text-slate-600">
                              Proyek ini memenuhi syarat <strong>Bebas Biaya Platform (0% Fee)</strong>. Total deposit yang ditarik dari saldo UMKM: <strong>Rp {feeInfo.totalUmkmDeposit.toLocaleString('id-ID')}</strong> (Mahasiswa menerima honor utuh Rp {feeInfo.studentReceives.toLocaleString('id-ID')}).
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1">
                              <span className="bg-blue-200 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                                Ketentuan Fee Platform 10%
                              </span>
                            </div>
                            <div className="space-y-1 text-slate-700">
                              <div className="flex justify-between">
                                <span>Honor Mahasiswa:</span>
                                <span className="font-semibold">Rp {feeInfo.studentReceives.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Biaya Layanan Platform (10%):</span>
                                <span className="font-semibold text-blue-700">+ Rp {feeInfo.platformFee.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-blue-200 font-bold text-slate-900">
                                <span>Total Deposit yang Ditarik:</span>
                                <span className="text-blue-700 font-extrabold">Rp {feeInfo.totalUmkmDeposit.toLocaleString('id-ID')}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Saldo Anda: Rp {umkmBal.toLocaleString('id-ID')}</span>
                          {!isEnough ? (
                            <span className="text-red-600 font-bold">⚠️ Saldo tidak mencukupi</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">✓ Saldo mencukupi</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
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

        {safeTab === 'katalog_jasa' && (
          <UMKMServicesCatalog
            currentUser={currentUser}
            studentServices={studentServices}
            serviceOrders={serviceOrders}
            onOrderService={onOrderStudentService}
            onCompleteOrder={onCompleteServiceOrder}
            onCancelOrder={onCancelServiceOrder}
            onCancelServiceOrder={onCancelServiceOrder}
            onCreateService={onCreateStudentService}
            onDeleteService={onDeleteStudentService}
            onSubmitServiceWork={onSubmitServiceWork}
            onNavigateToWallet={() => setActiveTab('dompet')}
            onStartChat={handleStartChat}
            showToast={showToast}
          />
        )}

        {safeTab === 'profil' && (
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

              {/* Status Verifikasi Legalitas UMKM */}
              <div
                id="verifikasi-identitas-umkm"
                className={`p-5 rounded-2xl border transition-all duration-500 scroll-mt-24 ${
                  highlightVerification
                    ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200/70 shadow-lg'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        Status Verifikasi Legalitas Usaha
                        {currentUser.verified ? (
                          <span className="text-[11px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={12} /> Terverifikasi Resmi
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
                          ? 'Akun UMKM Anda telah diverifikasi resmi oleh Admin. Badge terverifikasi meningkatkan minat mahasiswa untuk melamar pada proyek Anda.'
                          : currentUser.verificationDoc
                          ? `Berkas verifikasi telah dikirim (${currentUser.verificationDoc.type === 'photo' ? 'Foto Dokumen' : 'Tautan Drive'}). Admin sedang meninjau kelengkapan berkas.`
                          : 'Kirimkan foto NIB / SIUP / Surat Keterangan Usaha atau tautan Google Drive untuk verifikasi legalitas.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-center shadow-xs flex items-center gap-1.5"
                  >
                    {currentUser.verified ? 'Lihat Berkas Terverifikasi' : currentUser.verificationDoc ? 'Periksa / Ubah Berkas' : 'Unggah Legalitas UMKM'}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Ulasan & Reputasi Mahasiswa</h3>
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
                    <p className="text-slate-400 text-sm">Belum ada ulasan dari mahasiswa. Selesaikan proyek bersama mahasiswa untuk membangun reputasi!</p>
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

      {/* Certificate Modal for UMKM */}
      {certificateProject && (
        <CertificateModal
          project={certificateProject}
          student={certificateProject.student || { name: 'Mahasiswa Terpilih', univ: 'Mahasiswa Terverifikasi' }}
          umkm={currentUser}
          onClose={() => setCertificateProject(null)}
        />
      )}
    </div>
  );
}