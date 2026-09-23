import React from 'react';

export default function Footer({ onOpenPopup, navigateTo }) {
  return (
    <footer className="bg-[#0f172a] text-slate-400 py-12 px-6 md:px-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center">
            Gig<span className="text-blue-500">Skill</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Empowering Students & Local Businesses.</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-bold text-slate-300">
          <button onClick={() => onOpenPopup('tentang')} className="hover:text-blue-400 transition-colors">Tentang Kami</button>
          <button onClick={() => onOpenPopup('panduan')} className="hover:text-blue-400 transition-colors">Panduan</button>
          <button onClick={() => onOpenPopup('syarat')} className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</button>
          {navigateTo && (
            <button onClick={() => navigateTo('verify-cert')} className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">
              Verifikasi Sertifikat
            </button>
          )}
        </div>

        <div className="text-sm font-medium text-slate-500">
          &copy; 2026 GigSkill.web.id Platform
        </div>
      </div>
    </footer>
  );
}
