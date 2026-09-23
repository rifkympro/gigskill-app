/**
 * Kompresi gambar otomatis berbasis Canvas di browser
 * Mengurangi ukuran file foto (misal dari 3MB-10MB menjadi ~80-150KB)
 * sehingga aman disimpan di Cloud Firestore & memori browser tanpa QuotaExceededError.
 */

export async function compressImage(fileOrDataUrl, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.75,
    outputType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // 1. Dapatkan data URL dari input
      const processWithDataUrl = (dataUrl) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // Hitung rasio pengecilan jika melebihi batas dimensi
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Gambar ke canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl); // fallback jika canvas context tidak tersedia
            return;
          }

          // Isi background putih untuk mencegah transparansi jadi hitam saat di-convert ke JPEG
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          ctx.drawImage(img, 0, 0, width, height);

          // Convert ke format terkompresi
          const compressedDataUrl = canvas.toDataURL(outputType, quality);
          resolve(compressedDataUrl);
        };

        img.onerror = () => {
          // Jika gagal render image, fallback ke original dataUrl
          resolve(dataUrl);
        };

        img.src = dataUrl;
      };

      if (typeof fileOrDataUrl === 'string') {
        // Sudah berupa data URL / string
        processWithDataUrl(fileOrDataUrl);
      } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => processWithDataUrl(e.target.result);
        reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
        reader.readAsDataURL(fileOrDataUrl);
      } else {
        resolve(fileOrDataUrl);
      }
    } catch (err) {
      console.warn('Compress error fallback to original:', err);
      resolve(fileOrDataUrl);
    }
  });
}
