# Integration Plan Per Phase: Backend x Frontend (Auth + Dashboard)

Dokumen ini menyajikan rencana integrasi dalam format per-phase yang detail dan operasional, agar tim FE/BE bisa eksekusi paralel dengan risiko mismatch kontrak minimal.

## 1. Tujuan

- Menyelesaikan integrasi auth Firebase-first tanpa onboarding role terpisah.
- Memastikan endpoint dashboard terintegrasi sesuai OpenAPI.
- Menstandarkan session handling, retry policy, role rendering, dan error handling.

## 2. Scope

### 2.1 Auth (wajib)

- POST /auth/firebase/register
- POST /auth/firebase/sign-in
- POST /auth/firebase/send-email-verification
- POST /auth/firebase/password-reset

### 2.2 Dashboard (wajib)

- GET /dashboard/summary
- GET /dashboard/risk-trend
- GET /dashboard/latest-alerts
- GET /dashboard/assets-table
- GET /dashboard/assets/{asset_id}/detail
- GET /dashboard/assets/{asset_id}/security-report

### 2.3 Out of scope

- Perubahan formula scoring backend.
- Realtime push event verifikasi email dari Firebase ke FE.

## 3. Prinsip Kontrak yang Wajib Dipatuhi

- Role wajib dipilih di register (CISO atau Manajemen).
- Endpoint /auth/firebase/complete-profile tidak digunakan lagi.
- Setelah register, user diarahkan ke halaman Check your email.
- Sign-in pertama setelah email verified bisa menghasilkan account_activated=true dan session=null.
- FE harus menampilkan pesan aktivasi sukses dan meminta login ulang.
- Endpoint bisnis hanya boleh memakai backend access token (bukan Firebase token).

## 4. Rencana Per Phase

## Phase 0 - Contract Alignment (Prioritas P0)

### Objective

Menyamakan implementasi FE dengan kontrak backend final agar seluruh phase berikutnya dibangun di baseline yang benar.

### Implementasi Detail

- Audit endpoint auth/dashboard di FE terhadap OpenAPI.
- Hapus seluruh referensi complete-profile di route, service, dan state auth.
- Pastikan mapper auth membaca field account_activated.

### Deliverables

- Daftar endpoint FE-to-BE yang sudah align.
- Kode tanpa call /auth/firebase/complete-profile.
- Mapper auth terbaru untuk account_activated.

### Dependency

- OpenAPI contract final.
- Auth integration guide final.

### Risiko

- Sisa referensi complete-profile tersebar di guard lama.
- Field response backend dipakai dengan nama lama.

### Exit Criteria

- Tidak ada endpoint complete-profile tersisa di codebase.
- Build dan lint hijau setelah cleanup.

## Phase 1 - Auth UX Flow (Prioritas P0)

### Objective

Menyelesaikan alur register -> verify -> login sesuai model first-activation dari backend.

### Implementasi Detail

- Register form mengirim payload lengkap: name, username, email, role, password, confirm_password.
- Setelah register sukses, redirect ke halaman Check your email.
- Halaman Verify Email menyediakan:
  - informasi email tujuan
  - CTA "I have verified"
  - CTA resend verification
- Bila user belum punya Firebase session saat klik lanjut, arahkan ke login.
- Login flow:
  - signInWithEmailAndPassword (Firebase SDK)
  - ambil id_token
  - exchange ke /auth/firebase/sign-in
- Tangani skenario aktivasi pertama:
  - account_activated=true
  - session=null
  - tampilkan pesan "Akun berhasil diaktivasi, silakan login kembali"
  - paksa login ulang untuk mendapatkan session backend.

### Deliverables

- Flow auth end-to-end sesuai backend note.
- Pesan UX yang jelas untuk first-activation.

### Dependency

- Phase 0 selesai.
- Halaman register/login/verify sudah aktif.

### Risiko

- User bingung jika tidak ada edukasi login ulang.
- FE tetap mencoba akses bisnis saat session null.

### Exit Criteria

- Skenario register -> verify -> login pertama (aktivasi) -> login kedua (session) berjalan sukses.
- Tidak ada redirect ke complete-profile.

## Phase 2 - Session Lifecycle & Security (Prioritas P0)

### Objective

Menjamin session FE stabil, aman, dan konsisten sepanjang lifecycle aplikasi.

### Implementasi Detail

- Rehydrate saat app start:
  - cek Firebase current user
  - ambil id_token
  - exchange ke /auth/firebase/sign-in
- Tangani 401 endpoint bisnis:
  - clear token/session lokal
  - redirect login
- Sign-out flow:
  - signOut Firebase
  - clear auth storage
  - clear cache dashboard
- Validasi seluruh endpoint bisnis memakai backend bearer token.

### Deliverables

- Session bootstrap yang stabil setelah refresh browser.
- Logout hygiene yang bersih tanpa token stale.

### Dependency

- Phase 1 selesai.

### Risiko

- Token lama tertinggal di storage.
- Kondisi race saat onAuthStateChanged dan refreshSession bersamaan.

### Exit Criteria

- Refresh browser tidak memutus sesi valid.
- Token invalid/expired selalu kembali ke login dengan aman.

## Phase 3 - Dashboard API Integration (Prioritas P1)

### Objective

Menjadikan seluruh call dashboard konsisten, terpusat, dan siap production.

### Implementasi Detail

- Sentralisasi seluruh endpoint /dashboard/\* di API layer tunggal.
- Tambahkan interceptor auth untuk backend bearer token.
- Terapkan timeout request standar.
- Tambahkan retry untuk 429 berbasis Retry-After.
- Tambahkan fallback retry terbatas untuk 5xx.
- Simpan request_id ke log FE untuk incident tracing.

### Deliverables

- API gateway dashboard layer.
- Kebijakan retry dan observability dasar.

### Dependency

- Phase 2 selesai (token lifecycle stabil).

### Risiko

- Retry agresif memicu throttling tambahan.
- request_id tidak dipropagasi konsisten antar layer.

### Exit Criteria

- Semua dashboard call lewat API layer terpusat.
- 429 di-handle sesuai Retry-After.

## Phase 4 - Role-based Rendering (Prioritas P1)

### Objective

Memastikan komposisi UI sesuai policy role backend, termasuk fallback saat akses ditolak.

### Implementasi Detail

- Role Manajemen menampilkan hanya Summary dan Risk Trend.
- Role CISO menampilkan seluruh modul (Summary, Trend, Alerts, Table, Detail, Report).
- Saat endpoint CISO dipanggil oleh role Manajemen dan mendapat 403:
  - render state "Akses terbatas"
  - jangan crash halaman.

### Deliverables

- Role matrix UI yang konsisten dengan backend.
- Forbidden state reusable component.

### Dependency

- Phase 3 selesai.

### Risiko

- Role matrix hardcoded dan tidak sinkron response backend.

### Exit Criteria

- Uji manual per-role lulus tanpa komponen bocor lintas role.

## Phase 5 - Data Fetching & Caching Strategy (Prioritas P1)

### Objective

Mengoptimalkan performa dashboard tanpa risiko data leakage antar role/user.

### Implementasi Detail

- Tetapkan refresh interval:
  - Summary/Trend: 5-15 menit
  - Alerts/Table: 1-5 menit (CISO)
  - Detail/Report: on-demand
- Definisikan cache key minimal:
  - endpoint
  - query params
  - role
  - user id (disarankan)
- Pisahkan cache antar role dan user.
- Invalidate cache pada logout, token change, dan pergantian role/user.

### Deliverables

- Kebijakan refresh dan cache yang terdokumentasi.
- Implementasi invalidation path.

### Dependency

- Phase 3 dan 4 selesai.

### Risiko

- Data stale atau data lintas user tampil saat switching akun.

### Exit Criteria

- Tidak ada kebocoran data antar role/user pada pengujian switch account.

## Phase 6 - Error Handling Standardization (Prioritas P1)

### Objective

Membuat pengalaman error konsisten dan traceable di seluruh auth + dashboard flow.

### Implementasi Detail

- Standarkan mapping status code:
  - 400 invalid input
  - 401 token invalid/expired
  - 403 forbidden
  - 404 not found
  - 409 conflict
  - 422 validation error
  - 429 rate limit
  - 5xx server issue
- Jadikan envelope backend sumber utama pesan:
  - status_code
  - message
  - detail
  - request_id
- Pastikan global error boundary menangkap error tak tertangani.

### Deliverables

- Error map FE terpusat.
- Komponen UI error state standar.

### Dependency

- Phase 1 dan 3 selesai.

### Risiko

- Pesan backend tidak konsisten formatnya antar endpoint.

### Exit Criteria

- Semua status code utama memiliki perilaku UI yang teruji.

## Phase 7 - QA, Contract Test, UAT (Prioritas P0)

### Objective

Menutup seluruh gap integrasi melalui test berbasis kontrak dan skenario bisnis nyata.

### Implementasi Detail

- Lakukan contract test terhadap payload auth dan dashboard.
- Validasi enum query sesuai OpenAPI (period, sort_by, order, risk_level).
- Uji skenario auth end-to-end:
  - register sukses
  - resend verification
  - verify email
  - sign-in pertama aktivasi tanpa session
  - sign-in kedua menghasilkan session
- Uji role matrix CISO vs Manajemen.
- Uji error status 400/401/403/404/409/422/429/5xx.

### Deliverables

- Laporan hasil contract test.
- Checklist UAT bertanda pass/fail per skenario.

### Dependency

- Phase 0-6 selesai minimal di lingkungan staging.

### Risiko

- Contract drift antara branch FE dan backend environment aktif.

### Exit Criteria

- Tidak ada mismatch kontrak yang open.
- UAT skenario kritis lulus.

## 5. Timeline Prioritas

- P0 (release blocker): Phase 0, 1, 2, 7
- P1 (stabilitas production): Phase 3, 4, 5, 6
- P2 (improvement): telemetry lanjutan, observability panel, UX polish

## 6. Suggested Ticket Breakdown

- Ticket A1 (P0): Cleanup complete-profile dependency
- Ticket A2 (P0): Register to verify UX
- Ticket A3 (P0): First-activation sign-in handling
- Ticket A4 (P0): Session rehydrate + logout hygiene
- Ticket D1 (P1): Dashboard API gateway layer
- Ticket D2 (P1): Role-based composition + fallback 403
- Ticket D3 (P1): Retry-After and rate limit handling
- Ticket Q1 (P0): Contract test + UAT pack

## 7. Release Checklist

- [ ] Endpoint auth FE sesuai kontrak terbaru
- [ ] Tidak ada flow complete-profile
- [ ] First activation scenario sudah di-handle
- [ ] Semua endpoint bisnis memakai backend JWT
- [ ] Error 400/401/403/404/409/422/429/5xx ter-handle
- [ ] Role matrix CISO vs Manajemen tervalidasi
- [ ] Lint, build, smoke test, dan UAT hijau
