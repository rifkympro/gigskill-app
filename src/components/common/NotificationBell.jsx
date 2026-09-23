import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  Award,
  DollarSign,
  Wallet,
  MessageCircle,
  ShieldCheck,
  Trash2,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

export default function NotificationBell({
  currentUser,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onAction
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'finance', 'verification'
  const dropdownRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter notifications for this user
  const userNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') {
      return n.userId === currentUser.id || n.userId === 'admin' || n.role === 'admin';
    }
    return n.userId === currentUser.id;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const filteredList = userNotifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'finance') {
      return ['payment_received', 'withdraw_approved', 'withdraw_rejected', 'withdraw_requested', 'topup_success'].includes(n.type);
    }
    if (filter === 'verification') {
      return ['verification_approved', 'verification_rejected', 'verification_submitted'].includes(n.type);
    }
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'verification_approved':
        return <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle2 size={18} /></div>;
      case 'verification_rejected':
        return <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><AlertTriangle size={18} /></div>;
      case 'verification_submitted':
        return <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><ShieldCheck size={18} /></div>;
      case 'application_received':
        return <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Users size={18} /></div>;
      case 'application_accepted':
        return <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Award size={18} /></div>;
      case 'application_rejected':
        return <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><XCircle size={18} /></div>;
      case 'project_completed':
        return <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Sparkles size={18} /></div>;
      case 'payment_received':
      case 'topup_success':
        return <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><DollarSign size={18} /></div>;
      case 'withdraw_approved':
        return <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><CheckCircle2 size={18} /></div>;
      case 'withdraw_rejected':
        return <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><AlertTriangle size={18} /></div>;
      case 'withdraw_requested':
        return <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Wallet size={18} /></div>;
      case 'chat_message':
        return <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0"><MessageCircle size={18} /></div>;
      default:
        return <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"><Bell size={18} /></div>;
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.read && onMarkAsRead) {
      onMarkAsRead(item.id);
    }
    setIsOpen(false);
    if (onAction) {
      onAction(item);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pusat Notifikasi"
        className={`relative p-2.5 rounded-2xl border transition-all flex items-center justify-center ${
          isOpen
            ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm'
            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <Bell size={19} className={unreadCount > 0 ? 'text-blue-600 animate-wiggle' : 'text-slate-600'} />
        
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-600 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Bell size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">Notifikasi</h3>
                <p className="text-[11px] text-slate-300">
                  {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => onMarkAllAsRead && onMarkAllAsRead(currentUser.id)}
                  title="Tandai semua sudah dibaca"
                  className="px-2.5 py-1 text-[11px] font-bold bg-white/15 hover:bg-white/25 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Check size={12} /> Baca Semua
                </button>
              )}
              {userNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => onClearAll && onClearAll(currentUser.id)}
                  title="Hapus semua riwayat notifikasi"
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto text-[11px] font-bold hide-scrollbar">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              Semua ({userNotifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              Belum Dibaca
              {unreadCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'unread' ? 'bg-white/25 text-white' : 'bg-red-100 text-red-600'}`}>
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setFilter('verification')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filter === 'verification'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              Verifikasi
            </button>
            <button
              type="button"
              onClick={() => setFilter('finance')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filter === 'finance'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              Dompet & Dana
            </button>
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <BellOff size={32} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-500">Tidak ada notifikasi</p>
                <p className="text-[11px] text-slate-400">
                  {filter === 'unread'
                    ? 'Bagus! Semua notifikasi telah Anda baca.'
                    : 'Aktivitas terbaru proyek, lamaran, dan transaksi akan muncul di sini.'}
                </p>
              </div>
            ) : (
              filteredList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 sm:p-4 transition-all flex items-start gap-3 cursor-pointer group hover:bg-slate-50 relative ${
                    !item.read ? 'bg-blue-50/40' : 'bg-white'
                  }`}
                >
                  {/* Unread indicator bar */}
                  {!item.read && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full" />
                  )}

                  {getNotificationIcon(item.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${!item.read ? 'text-slate-950 font-extrabold' : 'text-slate-800'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                        <Clock size={10} />
                        {item.time || item.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        {item.actionType && (
                          <span className="text-[10px] font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                            Buka Detail <ChevronRight size={11} />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {!item.read && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead && onMarkAsRead(item.id);
                            }}
                            title="Tandai sudah dibaca"
                            className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                          >
                            <Check size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification && onDeleteNotification(item.id);
                          }}
                          title="Hapus notifikasi"
                          className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              Notifikasi diperbarui secara otomatis
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
