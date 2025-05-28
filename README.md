# 🛒 TokoKita – Sistem Manajemen Stok & Penjualan

**TokoKita** adalah aplikasi dashboard berbasis React untuk mencatat pembelian, penjualan, dan menghasilkan laporan laba bulanan. Sistem ini menggunakan metode **FIFO (First In, First Out)** dalam penghitungan HPP (Harga Pokok Penjualan).

---

## 🚀 Fitur Utama

- ✅ Tambah Stok (Batch)
- ✅ Pencatatan Pembelian
- ✅ Pencatatan Penjualan (FIFO)
- ✅ Laporan Laba Bulanan Otomatis
- ✅ Dashboard Ringkasan dengan Grafik

---

## 🧰 Tech Stack

- ⚛️ React (CRA)
- 💠 Ant Design
- 🔄 Axios
- 🌐 React Router DOM
- 📦 JSON Server (Mock API)
- 🧪 Jest + React Testing Library

---

## 🛠️ Cara Install & Jalankan

### 1. Install dependensi
```bash
npm install
````

### 2. Jalankan frontend React

```bash
npm start
```

### 3. Jalankan Mock API JSON Server

```bash
npx json-server --watch db.json --port 3001
```

> Pastikan file `db.json` berada di root folder proyek.

---

## 📊 Struktur Data (`db.json`)

```json
{
  "stocks": [],     // batch stok masuk
  "purchases": [],  // riwayat pembelian
  "sales": []       // riwayat penjualan
}
```

---

## ✅ Testing & Coverage

### 1. Jalankan seluruh test

```bash
npm test
```

---

## 🔁 Alur Integrasi yang Diuji

Test integrasi mencakup 3 skenario utama:

1. **Happy Path**: Pembelian → Penjualan → Update stok → Laporan
2. **No Stock**: Penjualan gagal karena stok kosong
3. **Storage Error**: Gagal menyimpan ke server (mock error)

> Semua skenario diuji menggunakan `axios` mock, tanpa rendering komponen React.

---

## 💾 Sistem Penyimpanan (Mock API)

* Menggunakan [`json-server`](https://github.com/typicode/json-server)
* Penyimpanan lokal berbasis file (`db.json`)
* Tidak butuh backend — cocok untuk development & pengujian
* Diuji menggunakan stub (mock axios)

---

## 📁 Struktur Folder

```
src/
├── components/       # Komponen: Form, Sidebar, Layout, dll
├── pages/            # Halaman: Dashboard, Penjualan, Pembelian, Laporan
├── services/         # API: axios wrapper
├── tests/            # Tes integrasi dan unit
├── styles/           # CSS modular
```

---
