import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Store,
  ShieldCheck,
  Briefcase,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import NotificationBell from './NotificationBell.jsx';

export default function Navbar({
  navigateTo,
  currentUser,
  handleLogout,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleIcon = () => {
    if (!currentUser) {
      return <User size={18} />;
    }

    if (currentUser.role === 'student') {
      return <GraduationCap size={18} />;
    }

    if (currentUser.role === 'umkm') {
      return <Store size={18} />;
    }

    if (currentUser.role === 'admin') {
      return <ShieldCheck size={18} />;
    }

    return <User size={18} />;
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => navigateTo(currentUser ? `${currentUser.role}Dashboard` : 'landing')}
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mr-3">
              <Briefcase
                size={21}
                className="text-white"
              />
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Gig<span className="text-blue-600">Skill</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigateTo('verify-cert')}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck size={16} className="text-emerald-600" /> Verifikasi Sertifikat
            </button>
            {!currentUser ? (
              <>
                <button
                  onClick={() => navigateTo('landing')}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Beranda
                </button>

                <div className="h-4 w-px bg-slate-200"></div>

                <button
                  onClick={() => navigateTo('login')}
                  className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Masuk
                </button>

                <button
                  onClick={() => navigateTo('register')}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  Daftar Akun
                </button>
              </>
            ) : (
              <>
                <NotificationBell
                  currentUser={currentUser}
                  notifications={notifications}
                  onMarkAsRead={onMarkAsRead}
                  onMarkAllAsRead={onMarkAllAsRead}
                  onDeleteNotification={onDeleteNotification}
                  onClearAll={onClearAll}
                  onAction={() => navigateTo(`${currentUser.role}Dashboard`)}
                />

                <button 
                    onClick={() => navigateTo(`${currentUser.role}Dashboard`)}
                    className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors text-left"
                  >
                    <div
                      className={
                        'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ' +
                        (currentUser.role === 'umkm'
                          ? 'bg-green-500'
                          : currentUser.role === 'admin'
                          ? 'bg-purple-600'
                          : 'bg-blue-600')
                      }
                    >
                      {getRoleIcon()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 leading-none">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {currentUser && (
              <NotificationBell
                currentUser={currentUser}
                notifications={notifications}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
                onDeleteNotification={onDeleteNotification}
                onClearAll={onClearAll}
                onAction={() => navigateTo(`${currentUser.role}Dashboard`)}
              />
            )}
            <button
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              className="text-slate-600 p-2 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 absolute w-full shadow-xl z-50">
          <button
            onClick={() => {
              navigateTo('verify-cert');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 text-left py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-50 border border-slate-200"
          >
            <ShieldCheck size={18} className="text-emerald-600" />
            <span>Verifikasi Sertifikat</span>
          </button>
          {!currentUser ? (
            <>
              <button
                onClick={() => {
                  navigateTo('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-50"
              >
                Masuk
              </button>

              <button
                onClick={() => {
                  navigateTo('register');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl font-bold text-white bg-blue-600"
              >
                Daftar Akun
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 py-3 px-4 rounded-xl font-bold text-red-600 bg-red-50"
            >
              <LogOut size={18} />
              <span>Keluar ({currentUser.name})</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
