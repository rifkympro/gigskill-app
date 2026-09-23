import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Star,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Send,
  AlertCircle,
  FileCheck,
  Tag,
  ArrowRight,
  Info,
  Plus,
  Trash2,
  Store,
  GraduationCap,
  Users,
  ArrowLeft,
  Check,
  X,
  Briefcase,
  MessageCircle
} from 'lucide-react';
import { calculateServiceFee, FREE_FEE_THRESHOLD } from '../../utils/feeCalculator.js';

export default function UMKMServicesCatalog({
  currentUser,
  studentServices = [],
  serviceOrders = [],
  onOrderService,
  onOrderStudentService,
  onCompleteOrder,
  onCompleteServiceOrder,
  onCancelOrder,
  onCancelServiceOrder,
  onCreateService,
  onDeleteService,
  onSubmitServiceWork,
  onNavigateToWallet,
  onStartChat,
  showToast
}) {
  const [subTab, setSubTab] = useState('cari'); // 'cari' | 'pesanan' | 'jasa_saya' | 'post_jasa'
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('all'); // 'all' | 'student' | 'umkm'
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [budgetFilter, setBudgetFilter] = useState('Semua');

  // Selected Service for Detail & Ordering Modal (Matching selectedProject in StudentDashboard)
  const [selectedService, setSelectedService] = useState(null);
  const [orderBrief, setOrderBrief] = useState('');

  // Reviewing Completed Order modal state
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Submission Modal state (when this UMKM is the provider and delivering work to another UMKM)
  const [submittingOrder, setSubmittingOrder] = useState(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // New Service Form State (Posting new service offer)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Desain Grafis');
  const [newType, setNewType] = useState('Online');
  const [newPrice, setNewPrice] = useState('');
  const [newDeliveryTime, setNewDeliveryTime] = useState('2-3 Hari');
  const [newDesc, setNewDesc] = useState('');
  const [newPreviewUrl, setNewPreviewUrl] = useState('');
  const [newTagsInput, setNewTagsInput] = useState('');

  const sampleCoverOptions = [
    { label: 'Sablon & Kemasan', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Foto Produk E-Commerce', url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop&q=80' },
    { label: 'Suplai Bahan Baku / Kopi', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' },
    { label: 'Catering & Snack Box', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' },
    { label: 'Website & IT Toko', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Desain Promosi Sosial', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' }
  ];

  const orderAction = onOrderService || onOrderStudentService;
  const completeAction = onCompleteOrder || onCompleteServiceOrder;
  const onCancelAction = onCancelOrder || onCancelServiceOrder;

  // Filtered Services for Cari Jasa
  const filteredServices = studentServices.filter((service) => {
    const pRole = service.providerRole || (service.studentId ? 'student' : 'umkm');
    const pName = service.providerName || service.studentName || '';

    const matchesProvider =
      providerFilter === 'all' ||
      (providerFilter === 'student' && pRole === 'student') ||
      (providerFilter === 'umkm' && pRole === 'umkm');

    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.tags && service.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      categoryFilter === 'Semua' ||
      service.category?.toLowerCase().includes(categoryFilter.toLowerCase());

    let matchesBudget = true;
    const priceNum = Number(service.price) || 0;
    if (budgetFilter === '< 100k') matchesBudget = priceNum < 100000;
    else if (budgetFilter === '100k - 500k') matchesBudget = priceNum >= 100000 && priceNum <= 500000;
    else if (budgetFilter === '> 500k') matchesBudget = priceNum > 500000;

    return matchesProvider && matchesSearch && matchesCategory && matchesBudget;
  });

  // Orders placed by this UMKM (buying services)
  const myOrders = serviceOrders.filter((o) => o.umkmId === currentUser?.id);
  const pendingReviewOrdersCount = myOrders.filter((o) => o.status === 'Menunggu Review UMKM').length;

  // Services offered by THIS UMKM (my posted services)
  const myOfferedServices = studentServices.filter(
    (s) => (s.providerId === currentUser?.id || s.umkmId === currentUser?.id)
  );

  // Incoming orders received by THIS UMKM from other buyers
  const incomingOrders = serviceOrders.filter(
    (o) => (o.providerId === currentUser?.id && o.providerRole === 'umkm')
  );
  const incomingActiveCount = incomingOrders.filter(o => o.status === 'Sedang Dikerjakan').length;

  const currentBalance = Number(currentUser?.balance || 0);

  // Live fee calculator for new service posting
  const newPriceNum = Number(newPrice) || 0;
  const newFeeInfo = calculateServiceFee(newPriceNum);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!selectedService) return;

    if (currentBalance < Number(selectedService.price)) {
      if (showToast) {
        showToast(
          `Saldo dompet Anda (${formatRupiah(currentBalance)}) tidak mencukupi untuk memesan jasa ini (${formatRupiah(selectedService.price)}). Silakan top up terlebih dahulu.`,
          'error'
        );
      }
      return;
    }

    if (orderAction) {
      orderAction(selectedService.id, orderBrief);
    }
    setSelectedService(null);
    setOrderBrief('');
    setSubTab('pesanan');
  };

  const handleConfirmReview = (e) => {
    e.preventDefault();
    if (!reviewingOrder) return;

    const targetProviderId = reviewingOrder.providerId || reviewingOrder.studentId;

    if (completeAction) {
      completeAction(reviewingOrder.id, {
        fromRole: 'umkm',
        fromId: currentUser.id,
        fromName: currentUser.name,
        toId: targetProviderId,
        rating: Number(rating),
        comment: reviewComment || 'Pekerjaan sangat memuaskan dan tepat waktu!'
      });
    }

    setReviewingOrder(null);
    setRating(5);
    setReviewComment('');
  };

  const handleConfirmSubmission = (e) => {
    e.preventDefault();
    if (!submittingOrder || !onSubmitServiceWork) return;

    onSubmitServiceWork(submittingOrder.id, {
      submissionLink: submissionLink.trim(),
      submissionNotes: submissionNotes.trim(),
      submittedAt: new Date().toLocaleDateString('id-ID')
    });

    setSubmittingOrder(null);
    setSubmissionLink('');
    setSubmissionNotes('');
  };

  const handleCreateNewService = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || Number(newPrice) <= 0) {
      if (showToast) showToast('Harap lengkapi judul dan tarif jasa yang valid!', 'error');
      return;
    }

    const tagsArray = newTagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const serviceData = {
      title: newTitle.trim(),
      category: newCategory,
      type: newType,
      price: Number(newPrice),
      deliveryTime: newDeliveryTime,
      desc: newDesc.trim() || 'Layanan profesional langsung dari mitra UMKM.',
      previewUrl: newPreviewUrl.trim() || sampleCoverOptions[0].url,
      tags: tagsArray.length > 0 ? tagsArray : ['B2B UMKM', newCategory]
    };

    if (onCreateService) {
      onCreateService(serviceData);
    }

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setNewTagsInput('');
    setSubTab('jasa_saya');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1">
          <button
            onClick={() => setSubTab('cari')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              subTab === 'cari'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search size={15} />
            <span>Cari Jasa</span>
          </button>

          <button
            onClick={() => setSubTab('pesanan')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              subTab === 'pesanan'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase size={15} />
            <span>Pesanan Jasa Saya</span>
            {pendingReviewOrdersCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                {pendingReviewOrdersCount}
              </span>
            )}
            {myOrders.length > 0 && pendingReviewOrdersCount === 0 && (
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${subTab === 'pesanan' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {myOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('jasa_saya')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              subTab === 'jasa_saya'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store size={15} />
            <span>Jasa Saya</span>
            {myOfferedServices.length > 0 && (
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${subTab === 'jasa_saya' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {myOfferedServices.length}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => setSubTab('post_jasa')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Buat Penawaran Jasa</span>
        </button>
      </div>

      {/* VIEW 1: CARI JASA (Matches Cari Project in StudentDashboard exactly) */}
      {subTab === 'cari' && (
        <div className="space-y-6">
          {/* Search & Filter Bar (Matching screenshot 2) */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-2 w-full">
              <Search className="text-slate-400 mr-2" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari judul, tag, atau penyedia..."
                className="w-full p-2 outline-none text-sm font-medium bg-transparent"
              />
            </div>

            <select
              value={providerFilter}
              onChange={e => setProviderFilter(e.target.value)}
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none w-full md:w-auto"
            >
              <option value="all">Semua Penyedia</option>
              <option value="student">Mahasiswa</option>
              <option value="umkm">Sesama UMKM</option>
            </select>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none w-full md:w-auto"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Desain">Desain Grafis</option>
              <option value="Web">Web & IT</option>
              <option value="Pemasaran">Pemasaran & Medsos</option>
              <option value="Administrasi">Administrasi & Suplai</option>
              <option value="Video">Video & Animasi</option>
              <option value="Penulisan">Penulisan</option>
            </select>

            <select
              value={budgetFilter}
              onChange={e => setBudgetFilter(e.target.value)}
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none w-full md:w-auto"
            >
              <option value="Semua">Semua Budget</option>
              <option value="< 100k">&lt; Rp 100.000</option>
              <option value="100k - 500k">Rp 100k - 500k</option>
              <option value="> 500k">&gt; Rp 500.000</option>
            </select>
          </div>

          {/* Cards List (Matching screenshot 2) */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <Search className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="font-bold text-slate-500">Tidak ada penawaran jasa yang sesuai dengan filter Anda.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setProviderFilter('all');
                  setCategoryFilter('Semua');
                  setBudgetFilter('Semua');
                }}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => {
                const pRole = service.providerRole || (service.studentId ? 'student' : 'umkm');
                const isUmkm = pRole === 'umkm';
                const pName = service.providerName || service.studentName || 'Penyedia Jasa';
                const isMyOwn = (service.providerId === currentUser?.id || service.umkmId === currentUser?.id);
                const myActiveOrder = myOrders.find(o => o.serviceId === service.id && o.status !== 'Selesai');

                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setOrderBrief('');
                    }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
                          <span>{pName}</span>
                          <span className="text-slate-300">•</span>
                          {isUmkm ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-extrabold text-[10px] border border-emerald-100 flex items-center gap-1">
                              <Store size={11} /> Mitra UMKM
                            </span>
                          ) : (
                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-extrabold text-[10px] border border-blue-100 flex items-center gap-1">
                              <GraduationCap size={11} /> Mahasiswa
                            </span>
                          )}
                        </p>
                        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      <div className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 shrink-0 ml-3">
                        <p className="text-sm font-extrabold text-green-700">{formatRupiah(service.price)}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.type === 'Offline' ? (
                        <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                          📍 Offline - {service.location || 'Di Lokasi'}
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                          🌐 Online
                        </span>
                      )}
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">
                        {service.category}
                      </span>
                      {service.tags && service.tags.map((tag) => (
                        <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                        <Clock size={13} className="text-blue-600" />
                        <span>Estimasi {service.deliveryTime}</span>
                      </div>

                      {isMyOwn ? (
                        <span className="inline-flex items-center text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          Jasa Milik Anda
                        </span>
                      ) : myActiveOrder ? (
                        <span className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          <Clock size={13} className="mr-1.5 text-blue-500" /> Sudah Dipesan ({myActiveOrder.status})
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                          Lihat & Pesan Jasa &rarr;
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

      {/* VIEW 2: PESANAN JASA SAYA */}
      {subTab === 'pesanan' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Pesanan Jasa Saya</h2>
              <p className="text-slate-500 text-xs mt-1">Daftar layanan jasa yang telah Anda pesan dari mahasiswa dan sesama UMKM</p>
            </div>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="font-bold text-slate-500">Anda belum pernah memesan jasa apa pun.</p>
              <button
                onClick={() => setSubTab('cari')}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline"
              >
                Cari Jasa Sekarang &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const isCompleted = order.status === 'Selesai';
                const isUnderReview = order.status === 'Menunggu Review UMKM' || order.status === 'Menunggu Review';
                const isProcessing = order.status === 'Sedang Dikerjakan';
                const isCancelled = order.status === 'Dibatalkan';
                const isUmkm = order.providerRole === 'umkm';
                const pName = order.providerName || order.studentName || 'Penyedia Jasa';

                return (
                  <div
                    key={order.id}
                    className={`bg-white p-6 rounded-2xl border transition-all ${
                      isCancelled
                        ? 'border-slate-200 bg-slate-50/60 opacity-80'
                        : isUnderReview
                        ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                        : 'border-slate-200'
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
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={12} /> : isCancelled ? <AlertCircle size={12} /> : <Clock size={12} />}
                            {order.status}
                          </span>
                          <span className="text-xs text-slate-400">Order ID: #{order.id}</span>
                        </div>
                        <h4 className="text-lg font-extrabold text-slate-900">{order.serviceTitle}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          Penyedia: <strong className="text-slate-800">{pName}</strong>
                          {isUmkm ? (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded text-[10px] font-bold border border-emerald-100">Mitra UMKM</span>
                          ) : (
                            <span className="bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded text-[10px] font-bold border border-blue-100">Mahasiswa</span>
                          )}
                          • Tanggal: {order.createdAt}
                        </p>
                      </div>

                      <div className="text-left sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                          Biaya Pesanan
                        </span>
                        <span className={`text-base font-extrabold ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          {formatRupiah(order.price)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block">
                          {isCancelled ? 'Dana Dikembalikan' : 'Dana Aman di Escrow'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Biaya Layanan UMKM: Rp 0
                        </span>
                      </div>
                    </div>

                    {/* Brief Catatan */}
                    {order.brief && (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <span className="font-extrabold text-slate-700 flex items-center gap-1">
                          <Info size={13} className="text-blue-600" /> Catatan Kebutuhan Anda:
                        </span>
                        <p className="text-slate-600 italic">"{order.brief}"</p>
                      </div>
                    )}

                    {/* Hasil Pekerjaan dari Penyedia */}
                    {order.submissionLink && (
                      <div className="mt-3 p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <FileCheck size={16} className="text-emerald-600" />
                            Hasil Pekerjaan Telah Diserahkan
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Diserahkan: {order.submittedAt || 'Baru Saja'}
                          </span>
                        </div>

                        <div className="p-3 bg-white border border-emerald-200/80 rounded-xl space-y-1">
                          <span className="text-slate-500 font-bold">Link Akses File:</span>
                          <a
                            href={order.submissionLink}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-blue-600 hover:underline flex items-center gap-1 break-all"
                          >
                            <ExternalLink size={13} /> {order.submissionLink}
                          </a>
                          {order.submissionNotes && (
                            <p className="text-slate-600 pt-1">
                              <strong>Catatan Pengiriman:</strong> "{order.submissionNotes}"
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">
                        {isCompleted
                          ? '✅ Pesanan selesai. Pembayaran telah diteruskan ke penyedia.'
                          : isCancelled
                          ? `❌ Pesanan dibatalkan (${order.cancelReason || 'Dibatalkan'}). Saldo telah dikembalikan.`
                          : isUnderReview
                          ? '📢 Penyedia telah mengirim hasil kerja. Silakan periksa link di atas dan konfirmasi penyelesaian.'
                          : '⏳ Penyedia sedang mengerjakan pesanan Anda.'}
                      </span>

                      <div className="flex items-center gap-2">
                        {isProcessing && onCancelAction && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Batalkan pesanan "${order.serviceTitle}"? Saldo Rp ${Number(order.price).toLocaleString('id-ID')} akan langsung dikembalikan ke dompet UMKM Anda.`)) {
                                onCancelAction(order.id, 'Dibatalkan oleh UMKM');
                              }
                            }}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                          >
                            Batalkan & Refund Saldo
                          </button>
                        )}

                        {isUnderReview && (
                          <button
                            onClick={() => {
                              setReviewingOrder(order);
                              setRating(5);
                              setReviewComment('');
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={15} /> Setujui & Selesaikan Pesanan
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

      {/* VIEW 3: JASA SAYA (Services offered by THIS UMKM) */}
      {subTab === 'jasa_saya' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Jasa UMKM Saya</h2>
              <p className="text-slate-500 text-xs mt-1">Layanan B2B yang Anda tawarkan ke sesama mitra UMKM dan mahasiswa</p>
            </div>
            <button
              onClick={() => setSubTab('post_jasa')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={15} /> Buat Penawaran Jasa
            </button>
          </div>

          {/* List of my offered services */}
          {myOfferedServices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <Store className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="font-bold text-slate-500">Anda belum memiliki penawaran jasa aktif.</p>
              <button
                onClick={() => setSubTab('post_jasa')}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline"
              >
                + Buat Penawaran Jasa Baru
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOfferedServices.map((service) => {
                const feeInfo = calculateServiceFee(service.price);
                return (
                  <div
                    key={service.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {service.category}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Estimasi: {service.deliveryTime}
                        </span>
                        {feeInfo.isFree && (
                          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                            Bebas Fee Platform (0%)
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900">{service.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xl">{service.desc}</p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <p className="text-base font-extrabold text-slate-900">{formatRupiah(service.price)}</p>
                        <p className="text-[11px] text-emerald-600 font-bold">
                          {feeInfo.isFree ? 'Bersih 100%' : `Bersih: ${formatRupiah(feeInfo.studentEarnings)}`}
                        </p>
                      </div>

                      {onDeleteService && (
                        <button
                          onClick={() => onDeleteService(service.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Hapus Jasa"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Incoming orders from other buyers */}
          {incomingOrders.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" />
                Pesanan Masuk dari Mitra Lain ({incomingOrders.length})
              </h3>

              <div className="space-y-3">
                {incomingOrders.map((order) => {
                  const isProcessing = order.status === 'Sedang Dikerjakan';
                  const isUnderReview = order.status === 'Menunggu Review UMKM';
                  const isCompleted = order.status === 'Selesai';
                  const feeInfo = calculateServiceFee(order.price);

                  return (
                    <div
                      key={order.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {order.status}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 mt-1">{order.serviceTitle}</h4>
                          <p className="text-xs text-slate-500">
                            Pemesan: <strong className="text-slate-800">{order.umkmName}</strong> • {order.createdAt}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-emerald-700">
                            {formatRupiah(order.studentEarnings || feeInfo.studentEarnings)}
                          </p>
                          <span className="text-[10px] text-slate-400 block">Estimasi Saldo Masuk</span>
                        </div>
                      </div>

                      {order.brief && (
                        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                          <strong>Catatan Pemesan:</strong> "{order.brief}"
                        </div>
                      )}

                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        {isProcessing && (
                          <button
                            onClick={() => {
                              setSubmittingOrder(order);
                              setSubmissionLink(order.submissionLink || '');
                              setSubmissionNotes(order.submissionNotes || '');
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Send size={14} /> Serahkan Hasil Pekerjaan
                          </button>
                        )}
                        {isUnderReview && (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl">
                            Menunggu konfirmasi review dari pemesan
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                            Pesanan Selesai & Saldo Masuk
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: BUAT PENAWARAN JASA (Matching clean post project in UMKM dashboard) */}
      {subTab === 'post_jasa' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSubTab('jasa_saya')}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Posting Penawaran Jasa Baru</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tawarkan keahlian atau pasokan B2B Anda kepada sesama UMKM dan mahasiswa</p>
            </div>
          </div>

          <form onSubmit={handleCreateNewService} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Penawaran Jasa</label>
              <input
                required
                type="text"
                placeholder="Cth: Jasa Cetak Sablon Box Kemasan Kraft Min 50 Pcs"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Jasa</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  <option value="Desain Grafis">Desain Grafis & Kemasan</option>
                  <option value="Web & IT">Web & IT</option>
                  <option value="Pemasaran & Media Sosial">Pemasaran & Foto Produk</option>
                  <option value="Administrasi & Data">Suplai Bahan Baku & Kemasan</option>
                  <option value="Video & Animasi">Video & Konten Promosi</option>
                  <option value="Penulisan & Terjemahan">Penulisan Naskah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipe Jasa</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  <option value="Online">Online (Digital / Pengiriman)</option>
                  <option value="Offline">Offline (Di Tempat / On-site)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tarif Jasa (Rp)</label>
              <input
                required
                type="number"
                min="10000"
                step="5000"
                placeholder="Cth: 150000"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold"
              />
              {newPriceNum > 0 && (
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Potongan Platform:</span>
                    <span className="font-bold text-slate-900">
                      {newFeeInfo.isFree ? 'Rp 0 (Bebas Biaya Platform <= 100k)' : `Rp ${newFeeInfo.platformFee.toLocaleString('id-ID')} (Flat 10%)`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-emerald-700 pt-1 border-t border-slate-200">
                    <span>Estimasi Saldo Masuk ke Dompet:</span>
                    <span>{formatRupiah(newFeeInfo.studentEarnings)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Estimasi Pengerjaan</label>
                <select
                  value={newDeliveryTime}
                  onChange={e => setNewDeliveryTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  <option value="1 Hari">1 Hari</option>
                  <option value="2-3 Hari">2-3 Hari</option>
                  <option value="5-7 Hari">5-7 Hari</option>
                  <option value="1-2 Minggu">1-2 Minggu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tags (Pisahkan koma)</label>
                <input
                  type="text"
                  placeholder="Kemasan, Sablon, B2B, Siap Kirim"
                  value={newTagsInput}
                  onChange={e => setNewTagsInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Penawaran Jasa</label>
              <textarea
                required
                rows={4}
                placeholder="Ceritakan detail layanan yang ditawarkan, apa saja yang didapatkan klien, dan ketentuan pengerjaan..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md text-sm"
            >
              Posting Penawaran Jasa
            </button>
          </form>
        </div>
      )}

      {/* MODAL: DETAIL & PESAN JASA (Matching selectedProject in StudentDashboard lines 1061-1100) */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  {selectedService.status === 'active' || !selectedService.status ? 'Tersedia untuk Dipesan' : 'Jasa Ditutup'}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-3">{selectedService.title}</h2>
                <div className="flex items-center mt-2 text-sm font-bold text-slate-500 gap-1.5">
                  <span>{selectedService.providerName || selectedService.studentName}</span>
                  {(selectedService.providerRole === 'umkm') ? (
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold border border-emerald-100 flex items-center gap-1">
                      <Store size={11} /> Mitra UMKM
                    </span>
                  ) : (
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold border border-blue-100 flex items-center gap-1">
                      <GraduationCap size={11} /> Mahasiswa
                    </span>
                  )}
                  <CheckCircle2 size={16} className="text-blue-500 ml-1" />
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded">
                {selectedService.category || 'Lainnya'}
              </span>
              {selectedService.type === 'Offline' ? (
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded border border-amber-200">
                  📍 Offline - {selectedService.location || 'Di Tempat'}
                </span>
              ) : (
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded border border-blue-100">
                  🌐 Online Remote
                </span>
              )}
              {selectedService.tags && selectedService.tags.map((t) => (
                <span key={t} className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>

            {selectedService.previewUrl && (
              <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={selectedService.previewUrl}
                  alt={selectedService.title}
                  className="w-full h-44 object-cover"
                />
              </div>
            )}

            <p className="text-slate-600 leading-relaxed mb-6 text-sm">{selectedService.desc}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-green-700 mb-1">Tarif Jasa</p>
                <p className="text-lg font-extrabold text-green-700">{formatRupiah(selectedService.price)}</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Bebas Biaya Layanan (Rp 0)</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-500 mb-1">Estimasi Pengerjaan</p>
                <p className="text-lg font-extrabold text-slate-700">{selectedService.deliveryTime}</p>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Garansi dana tersimpan</span>
              </div>
            </div>

            {/* Saldo Warning if insufficient */}
            {currentBalance < Number(selectedService.price) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle size={15} className="text-red-600 shrink-0" />
                  <span>Saldo Anda ({formatRupiah(currentBalance)}) kurang.</span>
                </div>
                {onNavigateToWallet && (
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      onNavigateToWallet();
                    }}
                    className="text-xs font-bold text-red-700 underline"
                  >
                    Top Up
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Kebutuhan untuk Penyedia Jasa
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan kebutuhan spesifik Anda (warna tema, format file, materi konten, atau referensi)..."
                  value={orderBrief}
                  onChange={e => setOrderBrief(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {onStartChat && (selectedService.providerId || selectedService.studentId) && (
                  <button
                    type="button"
                    onClick={() => {
                      const pId = selectedService.providerId || selectedService.studentId;
                      setSelectedService(null);
                      onStartChat(pId, selectedService.id);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold border border-slate-200 flex items-center justify-center transition-colors"
                    title="Chat Penyedia Jasa"
                  >
                    <MessageCircle size={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={currentBalance < Number(selectedService.price)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm shadow-md"
                >
                  Pesan Jasa Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Review Order (Buyer review) */}
      {reviewingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Setujui & Selesaikan Pesanan</h2>
                <p className="text-slate-500 text-sm mt-1">{reviewingOrder.serviceTitle}</p>
              </div>
              <button onClick={() => setReviewingOrder(null)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Dengan menyetujui, Anda mengonfirmasi pekerjaan telah diterima. Dana akan diteruskan ke penyedia jasa.
            </p>

            <form onSubmit={handleConfirmReview} className="space-y-4">
              <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Rating Kepuasan</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-extrabold text-amber-600 mt-1 inline-block">
                  {rating === 5 && 'Sangat Memuaskan (5/5)'}
                  {rating === 4 && 'Hasil Bagus (4/5)'}
                  {rating === 3 && 'Cukup Sesuai (3/5)'}
                  {rating === 2 && 'Perlu Peningkatan (2/5)'}
                  {rating === 1 && 'Kurang Memuaskan (1/5)'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ulasan / Testimoni</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Tulis ulasan pengalaman Anda bekerja sama dengan penyedia ini..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingOrder(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-md"
                >
                  Setujui & Selesaikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Submit Work (When THIS UMKM delivers work to another UMKM) */}
      {submittingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Serahkan Hasil Pekerjaan</h2>
                <p className="text-slate-500 text-sm mt-1">{submittingOrder.serviceTitle}</p>
              </div>
              <button onClick={() => setSubmittingOrder(null)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan File / Hasil Pekerjaan (Drive, Dropbox, atau Web) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={submissionLink}
                  onChange={e => setSubmissionLink(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan untuk Pemesan
                </label>
                <textarea
                  rows={3}
                  placeholder="Catatan penggunaan, nomor resi pengiriman, atau detail berkas..."
                  value={submissionNotes}
                  onChange={e => setSubmissionNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingOrder(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-md"
                >
                  Kirim Hasil Kerja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
