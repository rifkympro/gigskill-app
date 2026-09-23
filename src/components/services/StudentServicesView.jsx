import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Layers,
  FileCheck,
  Send,
  AlertCircle,
  Tag,
  DollarSign,
  Info,
  Package
} from 'lucide-react';
import { calculateServiceFee, FREE_FEE_THRESHOLD } from '../../utils/feeCalculator.js';

export default function StudentServicesView({
  currentUser,
  studentServices = [],
  onCreateStudentService,
  onDeleteStudentService,
  serviceOrders = [],
  onSubmitServiceWork,
  onCancelServiceOrder,
  showToast,
  onNavigateToPost
}) {
  const [subTab, setSubTab] = useState('services'); // 'services' | 'orders'
  const [submittingOrder, setSubmittingOrder] = useState(null); // Order yang sedang dikirim hasil kerjanya
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Preset demo image samples
  const presetImages = [
    { label: 'Template Web', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Desain Grafis & Feed', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
    { label: 'Menu & Branding Cafe', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' },
    { label: 'Stiker & Kemasan Produk', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80' }
  ];

  // My services & orders
  const myServices = studentServices.filter(s => s.studentId === currentUser?.id);
  const myOrders = serviceOrders.filter(o => o.studentId === currentUser?.id);
  const activeOrdersCount = myOrders.filter(o => o.status !== 'Selesai').length;

  const handleSendSubmission = (e) => {
    e.preventDefault();
    if (!submissionLink) {
      if (showToast) showToast('Tautan hasil pekerjaan (misal Google Drive / link file) wajib diisi!', 'error');
      return;
    }

    onSubmitServiceWork(submittingOrder.id, {
      submissionLink,
      submissionNotes,
      submittedAt: new Date().toLocaleDateString('id-ID')
    });

    setSubmittingOrder(null);
    setSubmissionLink('');
    setSubmissionNotes('');
  };

  const handleGoToPost = () => {
    if (onNavigateToPost) {
      onNavigateToPost();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Clean, informative & responsive */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
              <ShoppingBag size={14} className="text-blue-600" />
              <span>Katalog Jasa &amp; Produk Digital Mahasiswa</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Kelola Penawaran Jasa &amp; Pesanan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Tawarkan keahlian seperti desain feed, template web, rekap data, atau konsultasi ke ratusan mitra UMKM yang aktif.
            </p>
          </div>

          <button
            onClick={handleGoToPost}
            className="self-start md:self-center bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 shrink-0 text-sm"
          >
            <Plus size={18} />
            <span>+ Buat Penawaran Jasa</span>
          </button>
        </div>

        {/* Info Aturan Fee Transparan */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-extrabold text-xs">
              0%
            </div>
            <div>
              <p className="font-extrabold text-emerald-900">Bebas Fee Platform (&le; Rp 100.000)</p>
              <p className="text-emerald-800 text-[11px]">Harga jasa sampai Rp 100.000 bebas komisi platform (Anda terima 100% utuh).</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-50/70 border border-blue-200/80 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-extrabold text-xs">
              10%
            </div>
            <div>
              <p className="font-extrabold text-blue-900">Fee Platform Flat 10% (&gt; Rp 100.000)</p>
              <p className="text-blue-800 text-[11px]">Fee 10% hanya dipotong saat jasa Anda berhasil disetujui &amp; dibeli UMKM.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tab */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setSubTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              subTab === 'services'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={15} />
            <span>Penawaran Jasa Saya ({myServices.length})</span>
          </button>
          <button
            onClick={() => setSubTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              subTab === 'orders'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag size={15} />
            <span>Pesanan Masuk dari UMKM</span>
            {activeOrdersCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={handleGoToPost}
          className="text-xs font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus size={14} /> Buat Penawaran Jasa Baru
        </button>
      </div>

      {/* Tab 1: Daftar Penawaran Jasa Mahasiswa */}
      {subTab === 'services' && (
        <div>
          {myServices.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 space-y-3">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
                <Package size={30} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Belum Ada Penawaran Jasa yang Dibuat</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Mulai pajang keahlian Anda! Buat penawaran jasa seperti desain feed Instagram, pembuatan template web, rekap data Excel, atau konsultasi sosmed untuk UMKM.
              </p>
              <button
                onClick={handleGoToPost}
                className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <Plus size={16} /> Buat Penawaran Jasa Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myServices.map((service) => {
                const feeInfo = calculateServiceFee(service.price);
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 transition-all group"
                  >
                    {/* Thumbnail Preview */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={service.previewUrl || presetImages[0].url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {service.category}
                        </span>
                        <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {service.type}
                        </span>
                      </div>

                      {feeInfo.isFree ? (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                          Free Fee (0%)
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                          Fee 10%
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
                          <Clock size={13} />
                          <span>Pengerjaan: {service.deliveryTime}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base line-clamp-2 leading-snug">
                          {service.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {service.desc}
                        </p>
                      </div>

                      {/* Tags */}
                      {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {service.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Fee Breakdown Box */}
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1">
                        <div className="flex justify-between items-center text-slate-600">
                          <span>Harga Jual:</span>
                          <span className="font-extrabold text-slate-900">
                            Rp {Number(service.price).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 text-[11px]">
                          <span>Potongan Platform:</span>
                          <span className={feeInfo.isFree ? 'text-emerald-600 font-bold' : 'text-blue-600 font-bold'}>
                            {feeInfo.isFree ? 'Rp 0 (0% Promo)' : `-Rp ${feeInfo.platformFee.toLocaleString('id-ID')} (10%)`}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-200/80 flex justify-between items-center font-extrabold text-emerald-700">
                          <span>Pendapatan Bersih:</span>
                          <span>Rp {feeInfo.studentEarnings.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Dibuat: {service.createdAt || 'Baru'}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus penawaran jasa "${service.title}"?`)) {
                              onDeleteStudentService(service.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Hapus Penawaran Jasa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pesanan Jasa Masuk dari UMKM */}
      {subTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Pesanan Jasa dari UMKM</h3>
            <p className="text-xs text-slate-500 mt-1">
              Kelola pesanan jasa dan produk digital yang dibeli oleh UMKM. Kirimkan hasil pekerjaan untuk disetujui.
            </p>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ShoppingBag size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700">Belum Ada Pesanan Masuk</p>
              <p className="text-xs text-slate-400 mt-1">
                Ketika UMKM memesan salah satu jasa Anda, pesanan dan rincian instruksinya akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const isCompleted = order.status === 'Selesai';
                const isUnderReview = order.status === 'Menunggu Review UMKM' || order.status === 'Menunggu Review';
                const isProcessing = order.status === 'Sedang Dikerjakan';
                const isCancelled = order.status === 'Dibatalkan';

                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-2xl space-y-4 border transition-all ${
                      isCancelled ? 'bg-slate-100/60 border-slate-200 opacity-75' : 'bg-slate-50 border-slate-200/90 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCancelled
                                ? 'bg-rose-100 text-rose-800'
                                : isUnderReview
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={12} /> : isCancelled ? <AlertCircle size={12} /> : <Clock size={12} />}
                            {order.status}
                          </span>
                          <span className="text-xs text-slate-400">Order ID: #{order.id}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900">{order.serviceTitle}</h4>
                        <p className="text-xs text-slate-500">
                          Pemesan: <strong className="text-slate-800">{order.umkmName} (UMKM)</strong> • Tanggal Order: {order.createdAt}
                        </p>
                      </div>

                      {/* Price & Earnings Badge */}
                      <div className="text-left sm:text-right bg-white p-3 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                          Pendapatan Bersih
                        </span>
                        <span className={`text-lg font-extrabold ${isCancelled ? 'text-slate-400 line-through' : 'text-emerald-600'}`}>
                          Rp {Number(order.studentEarnings).toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Harga: Rp {Number(order.price).toLocaleString('id-ID')} ({order.isFreeFee ? 'Free Fee 0%' : 'Fee Platform 10%'})
                        </span>
                      </div>
                    </div>

                    {/* Brief Catatan dari UMKM */}
                    {order.brief && (
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                        <span className="font-extrabold text-slate-700 flex items-center gap-1">
                          <Info size={13} className="text-blue-600" /> Catatan & Kebutuhan dari UMKM:
                        </span>
                        <p className="text-slate-600 italic leading-relaxed">"{order.brief}"</p>
                      </div>
                    )}

                    {/* Cancelled notes if cancelled */}
                    {isCancelled && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                        Pesanan ini telah dibatalkan ({order.cancelReason || 'Dibatalkan'}). Dana telah dikembalikan ke pembeli UMKM.
                      </div>
                    )}

                    {/* Hasil Pekerjaan yang sudah dikirim */}
                    {order.submissionLink && (
                      <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs space-y-1">
                        <span className="font-extrabold text-blue-900 flex items-center gap-1">
                          <FileCheck size={13} className="text-blue-600" /> Hasil Kerja Terkirim:
                        </span>
                        <a
                          href={order.submissionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-600 hover:underline flex items-center gap-1 break-all"
                        >
                          <ExternalLink size={12} /> {order.submissionLink}
                        </a>
                        {order.submissionNotes && (
                          <p className="text-slate-600 mt-1">Catatan Anda: "{order.submissionNotes}"</p>
                        )}
                      </div>
                    )}

                    {/* Tombol Aksi */}
                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">
                        {isCompleted
                          ? '🎉 Pesanan telah disetujui UMKM. Saldo telah masuk ke dompet Anda.'
                          : isCancelled
                          ? '❌ Pesanan dibatalkan.'
                          : isUnderReview
                          ? '⏳ Hasil pekerjaan telah diserahkan. Menunggu konfirmasi persetujuan dari UMKM.'
                          : '⚡ Silakan kerjakan pesanan sesuai brief dan kirimkan hasilnya.'}
                      </span>

                      {!isCompleted && !isCancelled && (
                        <div className="flex items-center gap-2">
                          {onCancelServiceOrder && isProcessing && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Batalkan pesanan "${order.serviceTitle}"? Dana akan dikembalikan otomatis ke UMKM pemesan.`)) {
                                  onCancelServiceOrder(order.id, 'Dibatalkan oleh Mahasiswa');
                                }
                              }}
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                            >
                              Tolak / Batalkan
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSubmittingOrder(order);
                              setSubmissionLink(order.submissionLink || '');
                              setSubmissionNotes(order.submissionNotes || '');
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Send size={13} />
                            {order.submissionLink ? 'Perbarui Hasil Kerja' : 'Kirim Hasil Pekerjaan'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Kirim Hasil Kerja Pesanan */}
      {submittingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[160]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Serahkan Hasil Pekerjaan</h3>
                <p className="text-xs text-slate-500">Order: {submittingOrder.serviceTitle}</p>
              </div>
              <button
                onClick={() => setSubmittingOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Tautan File Hasil Kerja (Google Drive / GitHub / Figma / Dropbox) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/... atau https://..."
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Pastikan akses link Google Drive telah diset ke <strong>"Anyone with the link can view/download"</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Catatan untuk UMKM Pemesan
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Halo Bu/Pak, berikut file desain feed dan link canva yang bisa diedit. Terima kasih!"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSubmittingOrder(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send size={15} /> Serahkan ke UMKM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
