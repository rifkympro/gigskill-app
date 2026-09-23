import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Camera, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Building2, 
  User, 
  Calendar, 
  Star, 
  ExternalLink, 
  ArrowLeft, 
  RefreshCw,
  AlertTriangle,
  QrCode,
  FileCheck
} from 'lucide-react';
import jsQR from 'jsqr';

export default function VerifyCertificatePage({ 
  projects, 
  users, 
  initialCertCode = '', 
  onBack, 
  onViewCertificate 
}) {
  const [certInput, setCertInput] = useState(initialCertCode);
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);

  // Camera & QR Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [scanMethod, setScanMethod] = useState('input'); // 'input' | 'camera' | 'upload'
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper: Verify cert code against projects & users database
  const verifyCode = (codeToVerify) => {
    if (!codeToVerify || !codeToVerify.trim()) {
      setSearchResult(null);
      setSearched(false);
      return;
    }

    const cleanCode = codeToVerify.trim();
    setSearched(true);

    // Extract project ID from cert format: GS-CERT/2026/P4-U1 or direct query
    // Matches patterns like GS-CERT/2026/P4-U1 or simply P4
    let matchedProjectId = null;
    let matchedStudentId = null;

    const certRegex = /GS-CERT\/\d{4}\/([A-Za-z0-9_-]+)(?:-([A-Za-z0-9_-]+))?/i;
    const match = cleanCode.match(certRegex);

    if (match) {
      matchedProjectId = match[1]?.toLowerCase();
      matchedStudentId = match[2]?.toLowerCase();
    } else {
      matchedProjectId = cleanCode.toLowerCase();
    }

    // Find in projects
    const foundProject = projects.find(p => 
      p.id.toLowerCase() === matchedProjectId ||
      `gs-cert/2026/${p.id.toLowerCase()}` === cleanCode.toLowerCase() ||
      (p.status === 'Selesai' && cleanCode.toUpperCase().includes(p.id.toUpperCase()))
    );

    if (foundProject && foundProject.status === 'Selesai') {
      const acceptedApplicant = foundProject.applicants?.find(a => a.status === 'Diterima' || a.status === 'Selesai') || foundProject.applicants?.[0];
      const student = users.find(u => u.id === acceptedApplicant?.studentId || u.id === matchedStudentId) || {
        name: acceptedApplicant?.studentName || 'Joko Subianto',
        univ: 'Universitas Pamulang',
        semester: 5
      };

      setSearchResult({
        isValid: true,
        project: foundProject,
        student: student,
        certNumber: `GS-CERT/2026/${foundProject.id.toUpperCase()}-${student.id?.toUpperCase() || 'STD'}`,
        completionDate: foundProject.completedDate || '21 September 2026',
        rating: foundProject.reviews?.[0]?.rating || 5,
        reviewText: foundProject.reviews?.[0]?.comment || 'Pengerjaan sangat memuaskan, komunikasi aktif dan profesional.'
      });
    } else {
      setSearchResult({
        isValid: false,
        inputCode: cleanCode
      });
    }
  };

  // Check URL query parameters or initialCertCode on mount
  useEffect(() => {
    if (initialCertCode) {
      setCertInput(initialCertCode);
      verifyCode(initialCertCode);
    }
  }, [initialCertCode]);

  // Clean up camera on unmount or mode change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startCamera = async () => {
    setScannerError('');
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestAnimationFrame(tickScan);
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setScannerError('Tidak dapat membuka kamera. Pastikan izin kamera aktif atau gunakan metode unggah gambar / ketik kode sertifikat.');
      setIsScanning(false);
    }
  };

  const tickScan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          handleDetectedCode(code.data);
          stopCamera();
          return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tickScan);
  };

  const handleDetectedCode = (rawQrData) => {
    let extractedCert = rawQrData;
    try {
      if (rawQrData.includes('cert=')) {
        const urlObj = new URL(rawQrData);
        extractedCert = urlObj.searchParams.get('cert') || rawQrData;
      }
    } catch (e) {
      const match = rawQrData.match(/cert=([^&]+)/);
      if (match) extractedCert = decodeURIComponent(match[1]);
    }
    setCertInput(extractedCert);
    verifyCode(extractedCert);
    setScanMethod('input');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleDetectedCode(code.data);
          } else {
            setScannerError('Tidak dapat mendeteksi kode QR pada foto ini. Pastikan foto QR Code terlihat jelas dan memiliki pencahayaan cukup.');
          }
        }
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-800/40 relative overflow-hidden mb-8">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} className="text-emerald-400" /> Sistem Verifikasi Keaslian Terbuka
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Verifikasi E-Sertifikat GigSkill
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Periksa keabsahan micro-credential dan rekam jejak pengalaman kerja nyata mahasiswa yang diterbitkan resmi oleh platform GigSkill bersama mitra UMKM.
            </p>
          </div>
        </div>

        {/* Verification Controls Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          
          {/* Method Selector Tabs */}
          <div className="flex border-b border-slate-200 mb-6 gap-2 sm:gap-4 overflow-x-auto pb-1">
            <button
              onClick={() => {
                stopCamera();
                setScanMethod('input');
              }}
              className={`pb-3 px-3 font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                scanMethod === 'input'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Search size={16} /> Input Nomor Sertifikat
            </button>
            <button
              onClick={() => {
                setScanMethod('camera');
                startCamera();
              }}
              className={`pb-3 px-3 font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                scanMethod === 'camera'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Camera size={16} /> Scan via Kamera HP / Web
            </button>
            <button
              onClick={() => {
                stopCamera();
                setScanMethod('upload');
              }}
              className={`pb-3 px-3 font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                scanMethod === 'upload'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload size={16} /> Unggah Foto QR Code
            </button>
          </div>

          {/* METHOD 1: Input Code */}
          {scanMethod === 'input' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Nomor Seri Sertifikat
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    placeholder="Contoh: GS-CERT/2026/P4-U1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all uppercase placeholder:normal-case placeholder:font-sans"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') verifyCode(certInput);
                    }}
                  />
                  {certInput && (
                    <button
                      onClick={() => {
                        setCertInput('');
                        setSearchResult(null);
                        setSearched(false);
                      }}
                      className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <button
                  onClick={() => verifyCode(certInput)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Search size={16} /> Periksa Keaslian
                </button>
              </div>

              {/* Sample Code Quick Pill */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Coba contoh kode terdaftar:</span>
                <button
                  onClick={() => {
                    const sampleCode = 'GS-CERT/2026/P4-U1';
                    setCertInput(sampleCode);
                    verifyCode(sampleCode);
                  }}
                  className="bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-mono px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                >
                  GS-CERT/2026/P4-U1
                </button>
              </div>
            </div>
          )}

          {/* METHOD 2: Live Camera Scanner */}
          {scanMethod === 'camera' && (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                
                {/* Scanner Framing Overlay */}
                <div className="absolute inset-0 border-2 border-transparent flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 border-2 border-emerald-400/90 rounded-2xl relative shadow-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400"></div>
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-emerald-400/70 animate-pulse"></div>
                  </div>
                </div>

                {!isScanning && (
                  <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center text-white">
                    <Camera size={40} className="text-slate-400 mb-3" />
                    <p className="text-sm font-bold mb-4">Kamera Sedang Tidak Aktif</p>
                    <button
                      onClick={startCamera}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors"
                    >
                      <Camera size={14} /> Aktifkan Kamera Scanner
                    </button>
                  </div>
                )}
              </div>

              {scannerError && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs max-w-md text-center">
                  {scannerError}
                </div>
              )}

              <p className="text-xs text-slate-500 mt-4 text-center max-w-sm">
                Arahkan kamera ke QR Code yang ada pada sertifikat fisik atau layar. Sistem akan mendeteksi kode verifikasi secara otomatis.
              </p>
            </div>
          )}

          {/* METHOD 3: Upload Photo */}
          {scanMethod === 'upload' && (
            <div className="text-center py-6">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 max-w-md mx-auto cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/40"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Klik untuk Memilih Foto QR Code
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Format gambar JPG, PNG, atau screenshot sertifikat
                </p>
              </div>

              {scannerError && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs max-w-md mx-auto">
                  {scannerError}
                </div>
              )}
            </div>
          )}

        </div>

        {/* VERIFICATION RESULT DISPLAY */}
        {searched && searchResult && (
          <div className="transition-all animate-in fade-in duration-300">
            {searchResult.isValid ? (
              /* VALID CERTIFICATE CARD */
              <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl overflow-hidden">
                
                {/* Status Bar */}
                <div className="bg-emerald-600 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-base tracking-wide">
                        SERTIFIKAT RESMI & TERVERIFIKASI
                      </h2>
                      <p className="text-xs text-emerald-100 font-mono">
                        {searchResult.certNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs bg-emerald-700/80 px-3 py-1.5 rounded-lg border border-emerald-400/40 font-bold self-start sm:self-center">
                    Status: Sah & Tercatat di GigSkill
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Student & Project Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    
                    {/* Student Info */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Penerima Sertifikat
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <User size={18} className="text-blue-600" />
                        {searchResult.student?.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {searchResult.student?.univ || 'Mahasiswa Terdaftar'} 
                        {searchResult.student?.semester ? ` • Semester ${searchResult.student.semester}` : ''}
                      </p>
                    </div>

                    {/* UMKM Partner Info */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Mitra UMKM Pemberi Kerja
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Building2 size={18} className="text-amber-600" />
                        {searchResult.project?.umkmName}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Mitra Usaha Terverifikasi GigSkill
                      </p>
                    </div>

                  </div>

                  {/* Project Info */}
                  <div className="border border-slate-200 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          {searchResult.project?.category} • {searchResult.project?.type}
                        </span>
                        <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                          {searchResult.project?.title}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block font-medium">Tanggal Penyelesaian</span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mt-0.5 sm:justify-end">
                          <Calendar size={13} className="text-slate-400" /> {searchResult.completionDate}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {searchResult.project?.desc}
                    </p>

                    {/* Rating & Review Box */}
                    <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                        {[...Array(searchResult.rating)].map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-slate-800 ml-1">{searchResult.rating}.0 / 5.0 (Penilaian UMKM)</span>
                      </div>
                      <p className="text-slate-600 italic">
                        "{searchResult.reviewText}"
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-slate-400">
                      ID Bukti Transaksi: <span className="font-mono text-slate-600">{searchResult.project?.id}</span>
                    </p>
                    {onViewCertificate && (
                      <button
                        onClick={() => onViewCertificate(searchResult.project, searchResult.student)}
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <Award size={15} className="text-amber-400" /> Buka Tampilan Sertifikat Lengkap
                      </button>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              /* INVALID / NOT FOUND CERTIFICATE CARD */
              <div className="bg-white rounded-3xl border-2 border-rose-300 shadow-md p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                  <XCircle size={36} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Sertifikat Tidak Ditemukan
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                  Nomor dokumen <strong className="font-mono text-rose-600">"{searchResult.inputCode}"</strong> tidak terdaftar dalam basis data resmi GigSkill.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 max-w-md mx-auto space-y-1">
                  <p>• Pastikan nomor seri sertifikat diketik dengan benar tanpa spasi ekstra.</p>
                  <p>• Hanya proyek yang telah berstatus <strong>"Selesai"</strong> dan disetujui UMKM yang memiliki e-sertifikat resmi.</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
