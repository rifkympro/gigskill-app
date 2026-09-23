import React from 'react';
import {
  DollarSign,
  Plus,
  ArrowRight,
  Clock,
  CreditCard,
  X,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  AlertCircle,
  FileCheck
} from 'lucide-react';

export default function DompetView({ role, currentUser, onRequestTransaction, transactions }) {
  const [showModal, setShowModal] = React.useState(null);
  const [amount, setAmount] = React.useState('');
  const [accountDetail, setAccountDetail] = React.useState('');
  const [viewingReceipt, setViewingReceipt] = React.useState(null);

  const myTransactions = transactions.filter(t => t.userId === currentUser.id);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(angka));
  };

  const currentBalance = currentUser.balance || 0;
  const isAmountTooHigh = showModal === 'withdraw' && Number(amount) > currentBalance;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !accountDetail) return;
    if (showModal === 'withdraw' && Number(amount) > currentBalance) {
      return;
    }
    onRequestTransaction(showModal === 'topup' ? 'topup' : 'withdraw', amount, accountDetail);
    setAmount('');
    setAccountDetail('');
    setShowModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <DollarSign size={120} />
        </div>
        <p className="text-slate-400 font-bold mb-2">Total Saldo Aktif</p>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8">{formatRupiah(currentBalance)}</h2>
        <div className="flex flex-wrap gap-3.5 relative z-10">
          <button
            onClick={() => setShowModal('topup')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Isi Saldo (Top Up)
          </button>
          <button
            onClick={() => setShowModal('withdraw')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <ArrowRight size={20} />
            Tarik Dana (Withdraw)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Clock size={20} className="mr-2 text-slate-400" />
            Riwayat Transaksi
          </h3>
          <span className="text-xs text-slate-500 font-medium">{myTransactions.length} Transaksi</span>
        </div>
        
        {myTransactions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CreditCard size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Belum ada riwayat transaksi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myTransactions.map(tx => (
              <div key={tx.id} className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">
                      {tx.type === 'topup' ? 'Top Up Saldo' : 'Penarikan Dana (Withdraw)'}
                    </span>
                    
                    {tx.status === 'Disetujui' && (
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={13} /> {tx.type === 'topup' ? 'Top Up Berhasil' : 'Disetujui & Ditransfer'}
                      </span>
                    )}
                    {tx.status === 'Menunggu' && (
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={13} /> Menunggu Verifikasi Admin
                      </span>
                    )}
                    {tx.status === 'Ditolak' && (
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <XCircle size={13} /> {tx.type === 'withdraw' ? 'Ditolak & Dana Dikembalikan' : 'Top Up Ditolak'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    {tx.type === 'withdraw' ? 'Rekening Tujuan:' : 'Rekening Pengirim:'} <span className="font-medium text-slate-700">{tx.accountDetails}</span> • {tx.date}
                  </p>

                  {/* Reject Note */}
                  {tx.status === 'Ditolak' && (
                    <div className="mt-2 p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900">
                        <AlertCircle size={14} className="text-rose-600 shrink-0" />
                        <span>Alasan Penolakan dari Admin:</span>
                      </div>
                      <p className="text-slate-700 pl-5 leading-relaxed">
                        {tx.rejectReason || (tx.type === 'withdraw' ? 'Nomor rekening tidak valid atau transfer gagal.' : 'Bukti mutasi transfer belum terverifikasi oleh Admin.')}
                      </p>
                      {tx.type === 'withdraw' && (
                        <div className="pl-5 pt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 size={12} className="text-emerald-700" />
                            Dana Rp {Number(tx.amount).toLocaleString('id-ID')} telah otomatis dikembalikan ke saldo aktif dompet Anda
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending Info */}
                  {tx.status === 'Menunggu' && (
                    <p className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 inline-block font-medium">
                      {tx.type === 'withdraw'
                        ? 'Saldo telah dipotong sementara. Admin sedang memvalidasi rekening & memproses transfer dana Anda.'
                        : 'Permintaan top up sedang diverifikasi oleh Admin. Saldo akan otomatis bertambah setelah transfer divalidasi.'}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  {tx.status === 'Ditolak' ? (
                    <div className="text-left md:text-right">
                      <p className="text-sm font-bold text-slate-400 line-through">
                        {tx.type === 'withdraw' ? '-' : '+'} Rp {Number(tx.amount).toLocaleString('id-ID')}
                      </p>
                      {tx.type === 'withdraw' ? (
                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 md:justify-end">
                          <CheckCircle2 size={13} /> Dikembalikan ke Saldo
                        </p>
                      ) : (
                        <p className="text-xs font-bold text-rose-600 flex items-center gap-1 md:justify-end">
                          <XCircle size={13} /> Top Up Dibatalkan
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className={`text-lg font-extrabold ${tx.type === 'topup' ? 'text-green-600' : 'text-slate-900'}`}>
                      {tx.type === 'withdraw' ? '-' : '+'} Rp {Number(tx.amount).toLocaleString('id-ID')}
                    </p>
                  )}

                  {/* Button View Transfer Proof for approved withdraw */}
                  {tx.status === 'Disetujui' && (tx.proofUrl || tx.proofRef) && (
                    <button
                      onClick={() => setViewingReceipt(tx)}
                      className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye size={14} /> Lihat Bukti Transfer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal View Transfer Receipt */}
      {viewingReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4" onClick={() => setViewingReceipt(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                  <CheckCircle2 size={13} /> Penarikan Dana Berhasil
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">Bukti Pengiriman Transfer Admin</h3>
              </div>
              <button onClick={() => setViewingReceipt(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal Transfer:</span>
                  <span className="font-extrabold text-green-600 text-base">
                    Rp {Number(viewingReceipt.amount).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rekening Tujuan:</span>
                  <span className="font-bold text-slate-900">{viewingReceipt.accountDetails}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Referensi Transfer:</span>
                  <span className="font-mono font-bold text-blue-600">{viewingReceipt.proofRef || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Disetujui:</span>
                  <span className="text-slate-700">{viewingReceipt.approvedAt || viewingReceipt.date}</span>
                </div>
              </div>

              {viewingReceipt.adminNote && (
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                  <span className="font-bold">Catatan Admin:</span> {viewingReceipt.adminNote}
                </div>
              )}

              {viewingReceipt.proofUrl && (
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Lampiran Bukti Transfer Resmi:</p>
                  {viewingReceipt.proofUrl.startsWith('data:image') || viewingReceipt.proofUrl.match(/\.(jpeg|jpg|gif|png|svg|webp)/i) ? (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2 text-center">
                      <img
                        src={viewingReceipt.proofUrl}
                        alt="Bukti Transfer Bank"
                        className="w-full max-h-64 object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    <a
                      href={viewingReceipt.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-blue-600 font-bold text-xs flex items-center justify-between hover:bg-blue-50 transition-colors"
                    >
                      <span className="truncate mr-2">{viewingReceipt.proofUrl}</span>
                      <ExternalLink size={15} className="shrink-0" />
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={() => setViewingReceipt(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm"
              >
                Tutup Bukti Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Top Up / Withdraw */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {showModal === 'topup' ? 'Top Up Saldo' : 'Tarik Dana (Withdraw)'}
                </h2>
                {showModal === 'withdraw' && (
                  <p className="text-xs text-slate-500 mt-1">
                    Saldo yang dapat ditarik: <span className="font-bold text-slate-800">{formatRupiah(currentBalance)}</span>
                  </p>
                )}
              </div>
              <button onClick={() => setShowModal(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={20} />
              </button>
            </div>
            
            {showModal === 'topup' ? (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
                <p className="font-bold mb-1">Transfer Manual</p>
                <p>Silakan transfer ke rekening admin di bawah ini, lalu ajukan nominal top up:</p>
                <div className="mt-3 font-mono bg-white p-2 rounded font-bold text-lg text-center border border-amber-200">
                  BCA 123-456-7890 (Admin GigSkill)
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800 leading-relaxed">
                <p className="font-bold mb-1">Ketentuan Penarikan Saldo</p>
                <p>Dana akan ditransfer oleh Admin ke rekening bank atau e-wallet Anda. Setelah disetujui, bukti transfer dapat dilihat langsung di menu ini.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Nominal {showModal === 'topup' ? 'Top Up' : 'Penarikan'} (Rp)
                  </label>
                  {showModal === 'withdraw' && currentBalance > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount(String(currentBalance))}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Tarik Semua
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  required
                  min="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={showModal === 'topup' ? "Contoh: 1000000" : "Contoh: 50000"}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                    isAmountTooHigh ? 'border-red-400 focus:ring-red-500 text-red-600' : 'border-slate-200 focus:ring-blue-500'
                  }`}
                />

                {/* Quick Chips for Top Up */}
                {showModal === 'topup' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[100000, 500000, 1000000, 2000000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(String(val))}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg border bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 transition-colors"
                      >
                        Rp {val.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Quick Chips for WD */}
                {showModal === 'withdraw' && (
                  <div className="flex gap-2 mt-2">
                    {[50000, 100000, 200000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(String(val))}
                        disabled={val > currentBalance}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                          val > currentBalance
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        Rp {val.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                )}

                {isAmountTooHigh && (
                  <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                    <AlertCircle size={13} /> Saldo tidak mencukupi (Saldo Anda: {formatRupiah(currentBalance)})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {showModal === 'topup' ? 'Rekening Pengirim Anda' : 'Rekening Bank / E-Wallet Tujuan'}
                </label>
                <input
                  type="text"
                  required
                  value={accountDetail}
                  onChange={(e) => setAccountDetail(e.target.value)}
                  placeholder="Contoh: BCA 8271928371 a/n Joko Subianto"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Sertakan nama bank/e-wallet, nomor rekening, dan nama pemilik rekening.
                </p>
              </div>

              <button
                type="submit"
                disabled={isAmountTooHigh || !amount || Number(amount) <= 0}
                className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md ${
                  isAmountTooHigh || !amount || Number(amount) <= 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Ajukan {showModal === 'topup' ? 'Top Up' : 'Penarikan Dana'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
