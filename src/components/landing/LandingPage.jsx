import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LandingPage({ navigateTo }) {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 pt-20 pb-24 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/30 blur-3xl rounded-full pointer-events-none"></div>

        <div className="text-center max-w-4xl mx-auto z-10 relative">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-slate-200 shadow-sm px-4 py-2 rounded-full text-sm font-semibold mb-8 cursor-default">
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>

            <span className="text-slate-600">
              Project Beta Tester
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Hubungkan Talenta.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Bangun Pengalaman.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            GigSkill adalah platform micro-project yang
            dirancang untuk membantu mahasiswa membangun
            portofolio nyata, sekaligus membantu UMKM
            bertransformasi secara digital.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => navigateTo('register')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-1 flex items-center justify-center"
            >
              Mulai Sekarang
              <ArrowRight
                className="ml-2"
                size={20}
              />
            </button>

            <button
              onClick={() => navigateTo('login')}
              className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Masuk
            </button>
          </div>
        </div>

        <div className="mt-20 max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>

            <div className="ml-4 bg-white px-3 py-1 rounded-md text-xs font-medium text-slate-400">
              gigskill.web.id/dashboard
            </div>
          </div>

          <div className="p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80 pointer-events-none">
            <div className="col-span-1 space-y-4">
              <div className="h-32 bg-white rounded-2xl border border-slate-200 p-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full mb-3"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
              </div>

              <div className="h-48 bg-white rounded-2xl border border-slate-200"></div>
            </div>

            <div className="col-span-2 space-y-4">
              <div className="h-16 bg-white rounded-2xl border border-slate-200 flex items-center px-4">
                <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
              </div>

              <div className="h-24 bg-white rounded-2xl border border-slate-200"></div>

              <div className="h-24 bg-white rounded-2xl border border-slate-200"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
