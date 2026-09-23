import React, { useState } from 'react';
import {
  GraduationCap,
  Store,
  User,
  MapPin,
  Building,
  ChevronDown,
  Phone,
  Mail,
  Lock
} from 'lucide-react';
import LocationPicker from '../common/LocationPicker.jsx';

export default function RegisterPage({
  onRegister,
  navigateTo
}) {
  const [activeTab, setActiveTab] = useState('student');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    univ: '',
    location: '',
    phone: ''
  });

  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'umkm') {
      const cleanPhone = (formData.phone || '').trim().replace(/[^0-9+]/g, '');
      if (cleanPhone.length < 9 || cleanPhone.length > 15) {
        setPhoneError('Nomor WhatsApp harus berupa 9-15 digit angka yang valid (contoh: 08123456789).');
        return;
      }
      setPhoneError('');
      onRegister({
        role: activeTab,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        univ: formData.univ,
        location: formData.location,
        phone: cleanPhone
      });
      return;
    }

    onRegister({
      role: activeTab,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      univ: formData.univ,
      location: formData.location,
      phone: formData.phone
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Buat Akun Baru
          </h1>

          <p className="text-slate-500 font-medium">
            Pilih peran Anda untuk bergabung dengan
            ekosistem.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab('student')}
            className={
              'flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ' +
              (activeTab === 'student'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700')
            }
          >
            <GraduationCap size={18} />
            <span>Mahasiswa</span>
          </button>

          <button
            onClick={() => setActiveTab('umkm')}
            className={
              'flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ' +
              (activeTab === 'umkm'
                ? 'bg-white text-green-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700')
            }
          >
            <Store size={18} />
            <span>UMKM</span>
          </button>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          {activeTab === 'student' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Nama Lengkap Sesuai KTM
                </label>

                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value
                      })
                    }
                    placeholder="Cth: Budi Santoso"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Domisili (Kota/Area)
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <div className="pl-12 w-full pt-1"><LocationPicker value={formData.location} onChange={(val) => setFormData({...formData, location: val})} /></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Universitas
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <select
                    required
                    value={formData.univ}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        univ: e.target.value
                      })
                    }
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-slate-700 transition-all"
                  >
                    <option value="">
                      Pilih Kampus...
                    </option>
                    <option value="unpam">
                      Universitas Pamulang
                    </option>
                    <option value="ui">
                      Universitas Indonesia
                    </option>
                  </select>

                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Nama Usaha / Bisnis
                </label>

                <div className="relative">
                  <Store
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value
                      })
                    }
                    placeholder="Cth: Kopi Kenangan Senja"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  Nomor WhatsApp Aktif
                </label>

                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        phone: e.target.value
                      });
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="081234567890"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
                {phoneError && (
                  <p className="mt-1 text-xs text-rose-600 font-semibold ml-1">
                    {phoneError}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
              Email
            </label>

            <div className="relative mb-4">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
                placeholder="email@contoh.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all font-medium"
              />
            </div>

            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                }
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className={
              'w-full text-white py-4 rounded-2xl font-extrabold text-lg transition-all shadow-lg hover:-translate-y-0.5 mt-6 ' +
              (activeTab === 'student'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                : 'bg-green-600 hover:bg-green-700 shadow-green-600/30')
            }
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-600">
          Sudah memiliki akun?{' '}
          <button
            onClick={() => navigateTo('login')}
            className="text-blue-600 font-bold hover:underline"
          >
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
}
