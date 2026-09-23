/**
 * Utility Perhitungan Fee Platform GigSkill
 *
 * Aturan Bisnis:
 * 1. Proyek / Transaksi bernilai <= Rp 100.000: GRATIS BIAYA LAYANAN (0% Fee Promo).
 * 2. Nilai > Rp 100.000: Fee Flat 10% dibebankan kepada pihak yang memposting / menawarkan.
 *    - Jika UMKM memposting Proyek: UMKM dibebankan biaya layanan 10%. Mahasiswa menerima honor 100% penuh.
 *    - Jika Mahasiswa memposting Penawaran Jasa / Template: Mahasiswa dikenakan potongan platform 10%. UMKM membayar harga pas.
 */

export const FREE_FEE_THRESHOLD = 100000;
export const PLATFORM_FEE_RATE = 0.10;

/**
 * Hitung rincian biaya untuk Proyek Lowongan UMKM
 * @param {number|string} budget Nominal honor proyek
 */
export function calculateProjectFee(budget) {
  const numBudget = Math.max(0, Number(budget) || 0);
  const isFree = numBudget <= FREE_FEE_THRESHOLD;
  const platformFee = isFree ? 0 : Math.round(numBudget * PLATFORM_FEE_RATE);
  const totalUmkmDeposit = numBudget + platformFee;
  const studentPayout = numBudget;

  return {
    budget: numBudget,
    isFree,
    platformFeeRate: isFree ? 0 : PLATFORM_FEE_RATE,
    platformFee,
    totalUmkmDeposit,
    studentPayout,
    feeBadgeText: isFree ? 'Promo Free Fee (0%)' : 'Biaya Layanan 10%'
  };
}

/**
 * Hitung rincian biaya untuk Penawaran Jasa / Produk Digital Mahasiswa
 * @param {number|string} price Harga / tarif penawaran jasa
 */
export function calculateServiceFee(price) {
  const numPrice = Math.max(0, Number(price) || 0);
  const isFree = numPrice <= FREE_FEE_THRESHOLD;
  const platformFee = isFree ? 0 : Math.round(numPrice * PLATFORM_FEE_RATE);
  const totalUmkmPay = numPrice;
  const studentEarnings = numPrice - platformFee;

  return {
    price: numPrice,
    isFree,
    platformFeeRate: isFree ? 0 : PLATFORM_FEE_RATE,
    platformFee,
    totalUmkmPay,
    studentEarnings,
    feeBadgeText: isFree ? 'Promo Free Fee (0%)' : 'Potongan Platform 10%'
  };
}
