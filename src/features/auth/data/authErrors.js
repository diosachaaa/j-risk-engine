export function getReadableAuthError(error) {
  const firebaseCode = error?.code;
  const backendStatus = error?.response?.status;
  const backendData = error?.response?.data;
  const backendDetail =
    backendData?.detail || backendData?.message || backendData?.error;

  if (backendStatus === 400) {
    return 'Data yang dikirim tidak valid';
  }

  if (backendStatus === 401) {
    return 'Sesi tidak valid atau sudah habis. Silakan login ulang';
  }

  if (backendStatus === 403) {
    return 'Akses ditolak. Pastikan email sudah terverifikasi dan role sesuai';
  }

  if (backendStatus === 404) {
    return 'Resource tidak ditemukan';
  }

  if (backendStatus === 409) {
    return 'Email atau username sudah dipakai';
  }

  if (backendStatus === 422) {
    return 'Validasi data gagal. Periksa kembali input kamu';
  }

  if (backendStatus === 503) {
    return 'Layanan autentikasi sementara tidak tersedia. Coba lagi nanti';
  }

  if (firebaseCode === 'auth/invalid-credential') {
    return 'Email atau password salah';
  }

  if (firebaseCode === 'auth/user-not-found') {
    return 'Akun tidak ditemukan';
  }

  if (firebaseCode === 'auth/wrong-password') {
    return 'Email atau password salah';
  }

  if (firebaseCode === 'auth/email-already-in-use') {
    return 'Email sudah terdaftar';
  }

  if (firebaseCode === 'auth/invalid-email') {
    return 'Format email tidak valid';
  }

  if (firebaseCode === 'auth/weak-password') {
    return 'Password terlalu lemah';
  }

  if (firebaseCode === 'auth/too-many-requests') {
    return 'Terlalu banyak percobaan. Coba lagi beberapa saat';
  }

  if (firebaseCode === 'auth/network-request-failed') {
    return 'Koneksi bermasalah. Periksa internet lalu coba lagi';
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('verified')
  ) {
    return 'Email belum diverifikasi';
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('role')
  ) {
    return 'Role belum dilengkapi';
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('expired')
  ) {
    return 'Sesi login sudah habis. Silakan login ulang';
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('unauthorized')
  ) {
    return 'Kamu tidak memiliki akses. Silakan login ulang';
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('forbidden')
  ) {
    return 'Akses ditolak untuk akun ini';
  }

  if (typeof backendDetail === 'string' && backendDetail.trim()) {
    return backendDetail;
  }

  return 'Terjadi kesalahan pada proses autentikasi';
}
