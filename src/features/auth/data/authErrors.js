export function getReadableAuthError(error) {
  const firebaseCode = error?.code
  const backendData = error?.response?.data
  const backendDetail =
    backendData?.detail ||
    backendData?.message ||
    backendData?.error

  if (firebaseCode === 'auth/invalid-credential') {
    return 'Email atau password salah'
  }

  if (firebaseCode === 'auth/user-not-found') {
    return 'Akun tidak ditemukan'
  }

  if (firebaseCode === 'auth/wrong-password') {
    return 'Email atau password salah'
  }

  if (firebaseCode === 'auth/email-already-in-use') {
    return 'Email sudah terdaftar'
  }

  if (firebaseCode === 'auth/invalid-email') {
    return 'Format email tidak valid'
  }

  if (firebaseCode === 'auth/weak-password') {
    return 'Password terlalu lemah'
  }

  if (firebaseCode === 'auth/too-many-requests') {
    return 'Terlalu banyak percobaan. Coba lagi beberapa saat'
  }

  if (firebaseCode === 'auth/network-request-failed') {
    return 'Koneksi bermasalah. Periksa internet lalu coba lagi'
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('verified')
  ) {
    return 'Email belum diverifikasi'
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('role')
  ) {
    return 'Role belum dilengkapi'
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('expired')
  ) {
    return 'Sesi login sudah habis. Silakan login ulang'
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('unauthorized')
  ) {
    return 'Kamu tidak memiliki akses. Silakan login ulang'
  }

  if (
    typeof backendDetail === 'string' &&
    backendDetail.toLowerCase().includes('forbidden')
  ) {
    return 'Akses ditolak untuk akun ini'
  }

  if (typeof backendDetail === 'string' && backendDetail.trim()) {
    return backendDetail
  }

  return 'Terjadi kesalahan pada proses autentikasi'
}