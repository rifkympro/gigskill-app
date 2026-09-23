import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, Share2, X, Star, ShieldCheck, Building2, User, Calendar, Image as ImageIcon } from 'lucide-react';
import QRCode from 'qrcode';

export default function CertificateModal({ project, student, umkm, onClose }) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  if (!project) return null;

  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://www.gigskill.web.id';
  const certNumber = `GS-CERT/2026/${project.id.toUpperCase()}-${student?.id?.toUpperCase() || 'STD'}`;
  const verifyUrl = `${origin}/?cert=${encodeURIComponent(certNumber)}`;
  const completionDate = project.completedDate || '21 September 2026';
  const studentName = student?.name || 'Mahasiswa GigSkill';
  const studentUniv = student?.univ || 'Mahasiswa Terverifikasi';
  const umkmName = project.umkmName || umkm?.name || 'Mitra UMKM';

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      width: 250,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR:', err));
  }, [verifyUrl]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Export sertifikat langsung sebagai Gambar HD (PNG) menggunakan Canvas
  const handleDownloadImage = async () => {
    try {
      setIsExporting(true);

      const canvas = document.createElement('canvas');
      // Resolusi tinggi 1920 x 1280 (3:2 landscape)
      canvas.width = 1920;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // 1. Background Cream Elegan
      const bgGrad = ctx.createLinearGradient(0, 0, 1920, 1280);
      bgGrad.addColorStop(0, '#fdfbf7');
      bgGrad.addColorStop(0.5, '#ffffff');
      bgGrad.addColorStop(1, '#f8f4ec');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1920, 1280);

      // 2. Border Ganda Emas/Amber
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, 1840, 1200);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.strokeRect(65, 65, 1790, 1150);

      // Ornamen Sudut
      const cornerSize = 50;
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#92400e';
      // Kiri Atas
      ctx.beginPath(); ctx.moveTo(50, 50 + cornerSize); ctx.lineTo(50, 50); ctx.lineTo(50 + cornerSize, 50); ctx.stroke();
      // Kanan Atas
      ctx.beginPath(); ctx.moveTo(1870 - cornerSize, 50); ctx.lineTo(1870, 50); ctx.lineTo(1870, 50 + cornerSize); ctx.stroke();
      // Kiri Bawah
      ctx.beginPath(); ctx.moveTo(50, 1230 - cornerSize); ctx.lineTo(50, 1230); ctx.lineTo(50 + cornerSize, 1230); ctx.stroke();
      // Kanan Bawah
      ctx.beginPath(); ctx.moveTo(1870 - cornerSize, 1230); ctx.lineTo(1870, 1230); ctx.lineTo(1870, 1230 - cornerSize); ctx.stroke();

      // 3. Watermark
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
      ctx.font = '900 240px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GIGSKILL', 960, 640);
      ctx.restore();

      // 4. Header Badge
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.roundRect(710, 100, 500, 46, 23);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ GIGSKILL VERIFIED MICRO-CREDENTIAL ★', 960, 131);

      // 5. Judul Sertifikat
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 58px serif';
      ctx.textAlign = 'center';
      ctx.fillText('SERTIFIKAT PENGALAMAN KERJA', 960, 220);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`NO. DOKUMEN: ${certNumber}`, 960, 265);

      // 6. Nama Penerima
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 24px serif';
      ctx.fillText('Sertifikat ini secara sah dan resmi diberikan kepada:', 960, 340);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 64px serif';
      ctx.fillText(studentName, 960, 430);

      // Garis bawah nama
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(560, 455);
      ctx.lineTo(1360, 455);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.font = '600 24px sans-serif';
      ctx.fillText(`${studentUniv} ${student?.semester ? `• Semester ${student.semester}` : ''}`, 960, 495);

      // 7. Narasi
      ctx.fillStyle = '#475569';
      ctx.font = '22px sans-serif';
      ctx.fillText('Atas dedikasi dan keberhasilan dalam menyelesaikan proyek kerja nyata secara profesional pada platform GigSkill', 960, 555);
      ctx.fillText(`bekerja sama dengan mitra usaha: ${umkmName}`, 960, 590);

      // 8. Box Proyek
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(460, 630, 1000, 190, 20);
      ctx.fill();
      ctx.stroke();

      // Kategori Proyek
      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${(project.category || 'Pekerjaan Jasa').toUpperCase()} • ${(project.type || 'Online').toUpperCase()}`, 500, 675);

      // Judul Proyek
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px sans-serif';
      const truncatedTitle = project.title && project.title.length > 55 ? project.title.substring(0, 52) + '...' : project.title;
      ctx.fillText(truncatedTitle, 500, 720);

      // Mitra UMKM
      ctx.fillStyle = '#475569';
      ctx.font = '22px sans-serif';
      ctx.fillText(`Mitra UMKM: ${umkmName}`, 500, 765);

      // Status Badge di dalam box
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(1260, 665, 160, 40, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ Sukses Selesai', 1340, 691);

      // 9. QR Code
      if (qrDataUrl) {
        const qrImg = new Image();
        await new Promise((res) => {
          qrImg.onload = res;
          qrImg.onerror = res;
          qrImg.src = qrDataUrl;
        });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(890, 870, 140, 140);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.strokeRect(890, 870, 140, 140);
        ctx.drawImage(qrImg, 895, 875, 130, 130);

        ctx.fillStyle = '#64748b';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Scan to Verify', 960, 1035);
        ctx.fillStyle = '#2563eb';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('www.gigskill.web.id', 960, 1060);
      }

      // 10. Tanda Tangan GigSkill (Kiri)
      ctx.save();
      // Cap bulat
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(600, 930, 45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VERIFIED', 600, 925);
      ctx.fillText('GIGSKILL', 600, 945);

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(480, 1000);
      ctx.lineTo(720, 1000);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Direksi GigSkill', 600, 1030);
      ctx.fillStyle = '#64748b';
      ctx.font = '18px sans-serif';
      ctx.fillText('Platform Verifikasi', 600, 1058);
      ctx.restore();

      // 11. Tanda Tangan UMKM (Kanan)
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 32px serif';
      ctx.textAlign = 'center';
      ctx.fillText(umkmName, 1320, 950);

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(1200, 1000);
      ctx.lineTo(1440, 1000);
      ctx.stroke();

      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(umkmName, 1320, 1030);
      ctx.fillStyle = '#64748b';
      ctx.font = '18px sans-serif';
      ctx.fillText('Pemberi Kerja (Mitra UMKM)', 1320, 1058);
      ctx.restore();

      // 12. Footer Copyright
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 1140);
      ctx.lineTo(1820, 1140);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Tanggal Penerbitan: ${completionDate}`, 120, 1180);
      ctx.textAlign = 'right';
      ctx.fillText('Hak Cipta © 2026 GigSkill Indonesia • Pemberdayaan UMKM & Mahasiswa', 1800, 1180);

      // Download file PNG
      const link = document.createElement('a');
      link.download = `Sertifikat_${studentName.replace(/\s+/g, '_')}_GigSkill.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download certificate image error:', err);
      // Fallback ke window.print jika canvas gagal
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none print:m-0">
        
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center font-black text-sm">
              GS
            </div>
            <div>
              <h2 className="text-sm font-bold">E-Sertifikat Pengalaman Kerja Terverifikasi</h2>
              <p className="text-xs text-slate-400">GigSkill Official Micro-Credential Certificate</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Unduh Gambar HD (PNG)"
            >
              <Download size={14} /> {isExporting ? 'Memproses...' : 'Unduh PNG HD'}
            </button>
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Cetak atau Simpan sebagai PDF"
            >
              <Printer size={14} /> Cetak / PDF
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Share2 size={14} /> {copied ? 'Tersalin!' : 'Bagikan'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Paper Canvas */}
        <div className="p-5 sm:p-8 bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
          <div className="relative border-4 border-double border-amber-600/60 rounded-2xl p-6 sm:p-10 bg-white shadow-inner overflow-hidden text-center">
            
            {/* Watermark Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <div className="text-[180px] font-black text-slate-900 tracking-tighter">GIGSKILL</div>
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600"></div>

            {/* Header / Brand */}
            <div className="flex flex-col items-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3 shadow-xs">
                <ShieldCheck size={14} className="text-amber-300" /> GigSkill Verified Micro-Credential
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-slate-900 uppercase">
                Sertifikat Pengalaman Kerja
              </h1>
              <p className="text-xs font-mono text-slate-500 mt-1 tracking-wider">
                NO. DOKUMEN: {certNumber}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 my-6">
              <p className="text-xs sm:text-sm text-slate-600 italic">
                Sertifikat ini secara sah diberikan kepada:
              </p>
              
              <div className="py-2 border-b-2 border-slate-200 inline-block min-w-[280px] sm:min-w-[420px]">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 font-serif">
                  {studentName}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                  {studentUniv} {student?.semester ? `• Semester ${student.semester}` : ''}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mt-2">
                Atas dedikasi dan keberhasilan dalam menyelesaikan proyek kerja nyata secara profesional dan tuntas pada platform <strong>GigSkill</strong> bekerja sama dengan mitra usaha:
              </p>

              {/* Project Card in Certificate */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-lg mx-auto text-left shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-100/70 px-2 py-0.5 rounded">
                      {project.category || 'Pekerjaan Jasa'} • {project.type || 'Online'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5 font-medium">
                      <Building2 size={13} className="text-slate-400" />
                      Mitra UMKM: <strong>{umkmName}</strong>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 size={13} className="text-emerald-600" /> Sukses Selesai
                    </span>
                  </div>
                </div>

                {project.reviews && project.reviews.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 bg-white p-2.5 rounded-xl border">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                      <span className="font-bold text-slate-700 text-[11px] ml-1">5.0 / 5.0 (Review UMKM)</span>
                    </div>
                    <p className="italic text-slate-500">
                      "{project.reviews[0].comment || 'Hasil kerja sangat memuaskan, komunikasi aktif, dan tepat waktu.'}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Signatures & QR Code */}
            <div className="grid grid-cols-3 items-end pt-8 mt-6 border-t border-slate-200 gap-4 text-center">
              
              {/* Signature 1: GigSkill Official */}
              <div className="flex flex-col items-center">
                <div className="h-14 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-double border-blue-700 bg-blue-50/80 flex items-center justify-center text-[9px] font-black text-blue-900 uppercase tracking-tighter text-center leading-tight">
                    VERIFIED<br/>GIGSKILL
                  </div>
                </div>
                <div className="border-t border-slate-400 w-32 mt-2 pt-1">
                  <p className="text-xs font-bold text-slate-800">Direksi GigSkill</p>
                  <p className="text-[10px] text-slate-500">Platform Verifikasi</p>
                </div>
              </div>

              {/* QR Code & Verification Link */}
              <div className="flex flex-col items-center">
                <div className="p-1.5 bg-white border border-slate-300 rounded-xl shadow-xs">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="QR Code Verifikasi Sertifikat" 
                      className="w-18 h-18 object-contain" 
                    />
                  ) : (
                    <div className="w-18 h-18 bg-slate-100 animate-pulse flex items-center justify-center text-[10px] text-slate-400">
                      Generating...
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-1">Scan to Verify</p>
                <p className="text-[9px] text-blue-600 font-bold">www.gigskill.web.id</p>
              </div>

              {/* Signature 2: UMKM Partner */}
              <div className="flex flex-col items-center">
                <div className="h-14 flex items-center justify-center">
                  <div className="italic font-serif text-slate-800 text-lg font-bold">
                    {umkmName}
                  </div>
                </div>
                <div className="border-t border-slate-400 w-32 mt-2 pt-1">
                  <p className="text-xs font-bold text-slate-800">{umkmName}</p>
                  <p className="text-[10px] text-slate-500">Pemberi Kerja</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
              <span>Tanggal Penerbitan: {completionDate}</span>
              <span>Hak Cipta © 2026 GigSkill Indonesia • Pemberdayaan UMKM & Mahasiswa</span>
            </div>
          </div>
        </div>

        {/* Modal Actions Bottom (Hidden on Print) */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            💡 Sertifikat dapat diunduh langsung sebagai Gambar HD (PNG) atau dicetak sebagai format PDF resmi.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Download size={14} /> {isExporting ? 'Memproses...' : 'Unduh Gambar HD (PNG)'}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer size={14} /> Cetak / PDF
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
