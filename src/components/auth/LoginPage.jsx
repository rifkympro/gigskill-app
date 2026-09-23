import React, { useState } from 'react';
import {
  Mail,
  Lock,
  GraduationCap,
  Store
} from 'lucide-react';

export default function LoginPage({
  handleLogin,
  handleQuickLogin,
  navigateTo
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Selamat Datang
          </h1>

          <p className="text-slate-500 font-medium">
            Silakan masuk menggunakan akun Anda.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 mb-8"
        >
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email Anda"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2"
          >
            Masuk
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">
              Atau Gunakan Demo Akun
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              handleQuickLogin('student')
            }
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <GraduationCap
              className="text-slate-400 group-hover:text-blue-600 mb-1"
              size={20}
            />

            <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">
              Mahasiswa
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickLogin('umkm')
            }
            className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <Store
              className="text-slate-400 group-hover:text-green-600 mb-1"
              size={20}
            />

            <span className="text-xs font-bold text-slate-600 group-hover:text-green-700">
              UMKM
            </span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Belum memiliki akun?{' '}
          <button
            onClick={() => navigateTo('register')}
            className="text-blue-600 font-bold hover:underline"
          >
            Daftar sekarang
          </button>
        </p>
      </div>
    </div>
  );
}
