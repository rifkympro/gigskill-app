export const initialUsers = [
  {
    id: 'u1',
    role: 'student',
    name: 'Joko Subianto',
    email: 'jokosubianto@student.com',
    password: '123',
    univ: 'Universitas Pamulang',
    location: 'Tangerang Selatan',
    semester: 5,
    bio: 'Mahasiswa desain grafis yang suka tantangan.',
    skills: ['Graphic Design', 'Figma', 'Adobe Illustrator'],
    rating: 4.8,
    portfolios: [{ title: 'Desain Logo Startup', link: '#' }, { title: 'Redesign UI/UX Web', link: '#' }],
    balance: 300000,
    verified: true,
    isDummy: true,
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
    verified: true,
    isDummy: true
  },
  {
    id: 'u3',
    role: 'admin',
    name: 'Super Admin',
    email: 'admin@gigskill.web.id',
    password: '123'
  },
  {
    id: 'u4',
    role: 'student',
    name: 'Rian Pratama',
    email: 'rian@student.ac.id',
    password: '123',
    univ: 'Universitas Indonesia',
    location: 'Depok',
    semester: 4,
    bio: 'Mahasiswa Sistem Informasi siap magang & freelance.',
    skills: ['Web Development', 'Content Writing'],
    balance: 0,
    verified: false,
    verificationDoc: {
      type: 'photo',
      value: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      notes: 'KTM Mahasiswa Aktif UI - NIM: 2022019482',
      submittedAt: '21/09/2026'
    }
  },
  {
    id: 'u5',
    role: 'umkm',
    name: 'Warung Kopi Nusantara',
    email: 'kopi@nusantara.com',
    password: '123',
    phone: '085712345678',
    category: 'Kuliner & Kafe',
    desc: 'Coffee shop lokal dengan biji kopi Nusantara.',
    balance: 0,
    verified: false,
    verificationDoc: {
      type: 'link',
      value: 'https://drive.google.com/file/d/nib_warung_kopi_nusantara/view',
      notes: 'Nomor Induk Berusaha (NIB): 022010928374 & Foto Surat Keterangan Usaha Kelurahan',
      submittedAt: '21/09/2026'
    }
  }
];

export const initialProjects = [
  {
    id: 'p1',
    umkmId: 'u2',
    umkmName: 'Toko Kue Ibu Tin',
    type: 'Online',
    location: '',
    title: 'Desain Logo & Banner Toko Kue',
    budget: '150000',
    deadline: '3 Hari',
    category: 'Desain',
    status: 'open',
    desc: 'Pekerjaan remote digital: Kami membutuhkan desain logo baru yang minimalis dan banner promosi. Pengiriman hasil kerja berupa file master vektor (.AI/.EPS) dan preview format PNG/PDF melalui Google Drive.',
    tags: ['Graphic Design', 'Illustrator', 'Remote'],
    verified: true,
    applicants: [
      {
        studentId: 'u1',
        studentName: 'Joko Subianto',
        proposal: 'Halo Bu Tin, saya tertarik untuk mendesain logo dan banner toko kue Ibu.',
        date: '19/09/2026',
        status: 'Ditolak',
        lastRejectedDate: '19/09/2026'
      }
    ]
  },
  {
    id: 'p2',
    umkmId: 'u2',
    umkmName: 'Toko Kue Ibu Tin',
    type: 'Online',
    location: '',
    title: 'Admin Instagram untuk 1 Minggu',
    budget: '250000',
    deadline: '7 Hari',
    category: 'Pemasaran',
    status: 'open',
    desc: 'Tugas meliputi upload feed 1x sehari, membalas DM/Komen, dan buat 3 reels sederhana.',
    tags: ['Social Media', 'Copywriting'],
    verified: true,
    applicants: []
  },
  {
    id: 'p3',
    umkmId: 'u2',
    umkmName: 'Toko Kue Ibu Tin',
    type: 'Offline',
    location: 'Toko Ibu Tin, Pasar Modern BSD Blok R-12',
    title: 'Penataan Display Etalase & Foto Produk On-Site',
    budget: '200000',
    deadline: '2 Hari',
    category: 'Operasional & Foto On-Site',
    status: 'Mahasiswa Terpilih',
    desc: 'Membantu menata etalase kue kering di toko fisik serta mengambil foto produk langsung di tempat untuk materi promosi.',
    tags: ['Display Produk', 'Fotografi On-Site'],
    verified: true,
    offlineVerificationCode: '8492',
    applicants: [
      {
        studentId: 'u1',
        studentName: 'Joko Subianto',
        proposal: 'Halo Bu Tin, saya siap datang langsung ke toko fisik untuk membantu menata etalase dan membawa kamera untuk sesi foto produk kue.',
        date: '20/09/2026',
        status: 'Diterima'
      }
    ]
  },
  {
    id: 'p4',
    umkmId: 'u2',
    umkmName: 'Toko Kue Ibu Tin',
    type: 'Online',
    location: '',
    title: 'Desain Kemasan Stiker Kue Lebaran & Logo Varian',
    budget: '250000',
    deadline: 'Selesai',
    completedDate: '21 September 2026',
    category: 'Desain',
    status: 'Selesai',
    desc: 'Pembuatan desain stiker toples kue kering edisi hampers Lebaran dengan konsep floral vintage.',
    tags: ['Graphic Design', 'Packaging', 'Branding'],
    verified: true,
    submission: {
      link: 'https://drive.google.com/drive/folders/kemasan_kue_ibu_tin_final',
      notes: 'File master cetak format PDF High-Res dan file vektor .AI telah diunggah lengkap.'
    },
    reviews: [
      {
        fromId: 'u2',
        fromName: 'Toko Kue Ibu Tin',
        rating: 5,
        comment: 'Pengerjaan sangat cepat dan desainnya cantik sekali! Penjualan toples kue kami langsung meningkat.',
        date: '21/09/2026'
      },
      {
        fromId: 'u1',
        fromName: 'Joko Subianto',
        rating: 5,
        comment: 'Terima kasih banyak Bu Tin atas kepercayaannya! Senang sekali bisa membantu.',
        date: '21/09/2026'
      }
    ],
    applicants: [
      {
        studentId: 'u1',
        studentName: 'Joko Subianto',
        proposal: 'Halo Bu Tin, saya memiliki pengalaman mendesain kemasan makanan dan stiker toples kue.',
        date: '18/09/2026',
        status: 'Diterima'
      }
    ]
  }
];

export const initialMessages = [
  { id: 'm_1', chatId: 'chat_u1_u2_p1', senderId: 'u1', text: 'Halo kak, saya tertarik dengan project desain logo yang diposting. Boleh saya tanya-tanya?', timestamp: '10:00' },
  { id: 'm_2', chatId: 'chat_u1_u2_p1', senderId: 'u2', text: 'Halo Joko! Boleh, silakan, mau tanya apa?', timestamp: '10:05' }
];

export const initialNotifications = [
  {
    id: 'notif_1',
    userId: 'u1',
    type: 'project_completed',
    title: 'E-Sertifikat Diterbitkan & Honor Masuk!',
    message: 'Proyek "Desain Kemasan Stiker Kue Lebaran" telah diselesaikan oleh Toko Kue Ibu Tin. Honor Rp 250.000 telah masuk ke dompet Anda.',
    date: '21/09/2026',
    time: '14:30',
    read: false,
    actionType: 'open_certificate',
    contextId: 'p4'
  },
  {
    id: 'notif_2',
    userId: 'u1',
    type: 'verification_approved',
    title: 'Verifikasi KTM Berhasil',
    message: 'Selamat! Kartu Tanda Mahasiswa (KTM) Anda telah diverifikasi resmi oleh Admin GigSkill.',
    date: '20/09/2026',
    time: '09:15',
    read: true,
    actionType: 'open_profile'
  },
  {
    id: 'notif_3',
    userId: 'u2',
    type: 'application_received',
    title: 'Pelamar Baru pada Proyek Anda',
    message: 'Joko Subianto baru saja melamar lowongan "Desain Feed Instagram Promosi Ramadan".',
    date: '21/09/2026',
    time: '11:20',
    read: false,
    actionType: 'open_project',
    contextId: 'p1'
  },
  {
    id: 'notif_4',
    userId: 'u2',
    type: 'verification_approved',
    title: 'Legalitas Usaha Terverifikasi',
    message: 'Dokumen legalitas UMKM Anda telah disetujui. Lencana terverifikasi kini aktif di profil usaha Anda.',
    date: '19/09/2026',
    time: '16:00',
    read: true,
    actionType: 'open_profile'
  },
  {
    id: 'notif_5',
    userId: 'u3',
    type: 'verification_submitted',
    title: 'Pengajuan Berkas Baru',
    message: 'Rian Pratama (Mahasiswa UI) dan Warung Kopi Mas Bro telah mengirimkan dokumen baru untuk verifikasi.',
    date: '21/09/2026',
    time: '13:00',
    read: false,
    actionType: 'open_admin_verifikasi'
  },
  {
    id: 'notif_6',
    userId: 'u3',
    type: 'withdraw_requested',
    title: 'Permintaan Penarikan Dana Baru',
    message: 'Joko Subianto mengajukan penarikan dana (WD) sebesar Rp 150.000 ke rekening BCA.',
    date: '21/09/2026',
    time: '15:10',
    read: false,
    actionType: 'open_admin_finance'
  }
];
