# CampusLoop — versi frontend (statis)

Folder ini adalah tampilan CampusLoop dalam bentuk HTML, CSS, dan JavaScript saja,
hasil render dari versi PHP + MySQL. Cocok untuk di-deploy ke Vercel.

- Login demo: isi email apa saja lalu tekan Masuk (email berawalan "admin" membuka panel admin).
- Semua halaman (beranda, jelajahi, detail barang, dashboard, transaksi, Loop Points,
  peringkat, panel admin) bisa dibuka dan dinavigasi.
- Tombol yang mengubah data (request, bayar, tukar voucher, dll.) hanya menampilkan
  pemberitahuan, karena butuh server PHP + MySQL.

## Deploy ke Vercel
1. Upload isi folder ini ke repository GitHub (index.html harus di paling luar).
2. Di vercel.com: Add New > Project > pilih repository > Framework Preset: Other > Deploy.
