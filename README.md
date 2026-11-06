# Portfolio — Naufal Darmawan

Website portfolio satu halaman dengan nuansa gelap dan tipografi editorial. Dibuat tanpa framework dan tanpa build step — hanya HTML, CSS, dan JavaScript.

Posisi yang dipakai: **Informatics Student · Aspiring Data Analyst** di Universitas Muslim Indonesia, Makassar. Situs ini sengaja tidak memuat pengalaman, awards, publikasi, atau sertifikasi yang belum nyata.

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
npx serve .
```

Lalu buka alamat yang ditampilkan (biasanya `http://localhost:3000`).

## Yang sudah ada

- Hero dengan cover, avatar, bio, status, dan tautan sosial
- Navigasi section yang sticky + active state saat scroll
- Experience: GDGOC Universitas Hasanuddin Makassar (2025—2026)
- Education: Universitas Muslim Indonesia + SMA Wahdah Bogor
- Learning focus
- Projects dengan dialog case study interaktif dan tautan ke project
- Stack teknologi dengan ikon
- GitHub-style contribution heatmap dari **data kontribusi asli** `@nuffalle`
- CTA, footer dengan jam Makassar real-time (WITA), copy email, dan back-to-top
- Responsive, focus state, `prefers-reduced-motion`, dan semantic HTML

## Struktur file

```
portfolio/
├─ index.html        # semua konten dan struktur halaman
├─ styles.css        # desain, layout, responsive
├─ script.js         # navigasi, heatmap, dialog, jam, copy email
├─ assets/
│  ├─ cover.jpg      # foto cover hero
│  ├─ avatar.jpg     # foto profil
│  ├─ cta.jpg        # background CTA
│  ├─ favicon.svg
│  └─ icons/         # ikon brand (Simple Icons)
└─ README.md
```

## Sumber data

| Data | Sumber |
| --- | --- |
| Nama, email, sosial | Profil GitHub `nuffalle` dan profil publik |
| Experience | GDGOC Universitas Hasanuddin — member, 2025—2026 |
| Pendidikan | Universitas Muslim Indonesia — S1 Informatika, semester 5; SMA Wahdah Bogor, 2020—2023 |
| Projects | Repo `pasar-umkm`, `project-asal`, `portologi`, `portfolio` |
| Foto profil | Foto pribadi Naufal Darmawan |
| Contribution heatmap | [github-contributions-api.jogruber.de](https://github-contributions-api.jogruber.de/v4/nuffalle?y=last), snapshot 6 November 2026 |
| Cover & CTA | Foto stok Unsplash |
| Ikon | [Simple Icons](https://simpleicons.org) (CC0) |

> **Catatan:** foto profil disimpan di `assets/avatar.jpg` dan sudah dipakai di hero serta footer.

## Cara mengganti konten

### 1. Nama, bio, dan kontak

Semua ada di `index.html`:

- Nama: cari `Naufal Darmawan`
- Bio: cari `hero__bio`
- Role, lokasi, dan domain: cari `hero__meta`
- Email: ganti semua `naufaldarmawan7@gmail.com`
- Sosial link: ganti URL `github.com/nuffalle`, `instagram.com/nauffaldrmwaan`, `youtube.com/c/@nuffalle`

Email juga dipakai di `script.js` sebagai `contactEmail` untuk tombol dialog project.

### 2. Foto

- `assets/avatar.jpg` — foto profil persegi, minimal 512 × 512 px. Timpa file ini kalau ingin mengganti foto.
- `assets/cover.jpg` — rasio sekitar 16:7, minimal 1400 px lebar
- `assets/cta.jpg` — background CTA, minimal 1400 px lebar

### 3. Experience, education, dan learning focus

Ada di `index.html`, ditandai komentar:

```html
<!-- ============ EXPERIENCE ============ -->
<!-- ============ EDUCATION ============ -->
```

Ganti nama organisasi, role, periode, dan tag sesuai kondisi terbaru. Bagian **Learning focus** boleh dihapus kalau sudah tidak relevan.

### 4. Projects

Daftar project ada di `index.html` (cari `<!-- ============ PROJECTS ============ -->`). Detail dialog ada di `script.js` pada object `projects`:

```js
"pasar-umkm": {
  title: "Pasar UMKM — Local Business Catalog",
  year: 2026,
  accent: "#8be9b0",
  url: "https://nuffalle.github.io/pasar-umkm/",
  summary: "...",
  tags: ["HTML", "CSS", "JavaScript"],
  points: ["...", "..."]
}
```

Key object harus sama dengan `data-project` pada tombol di `index.html`. Field `url` dipakai tombol **Open project** di dialog.

### 5. Stack

Ada di `index.html` (cari `<!-- ============ STACK ============ -->`). Setiap chip bisa memakai ikon dari `assets/icons/` atau teks saja.

### 6. Warna dan font

Palette, radius, dan font ada di bagian `:root` pada `styles.css`:

```css
--bg: #07080a;
--accent: #8be9b0;
--font-sans: "Inter", sans-serif;
--font-display: "Instrument Serif", serif;
```

### 7. Data heatmap

Heatmap memakai snapshot data asli di `script.js` (`contributionCounts`) dengan tanggal mulai `2025-11-02`.

Untuk memperbarui:

1. Ambil data terbaru:

   ```bash
   curl "https://github-contributions-api.jogruber.de/v4/nuffalle?y=last"
   ```

2. Ubah respons JSON menjadi array angka `count` (satu angka per hari).
3. Ganti `contributionCounts` di `script.js`, lalu sesuaikan tanggal mulai di `new Date("YYYY-MM-DD")`.

Kalau array lebih pendek dari 371 sel, sisa sel otomatis dianggap 0.

## Deploy

### GitHub Pages (paling cocok untuk repo ini)

1. Push folder ini ke `github.com/nuffalle/portfolio`.
2. Buka **Settings → Pages**.
3. Pilih branch `main`, folder `/ (root)`.
4. Situs akan tersedia di `https://nuffalle.github.io/portfolio/`.

### Vercel

1. Import repository di [vercel.com](https://vercel.com).
2. Framework preset: **Other**. Build command dikosongkan, output directory `.`.

### Netlify

1. Drag-and-drop folder `portfolio` ke [app.netlify.com/drop](https://app.netlify.com/drop).
2. Tidak perlu build command.

## Ide project berikutnya (data analytics)

Supaya posisi *Aspiring Data Analyst* makin kuat, tambahkan 1–2 project yang benar-benar memakai data:

1. **Analisis dataset publik** — misalnya data UMKM atau harga pangan dari BPS, lalu jawab satu pertanyaan dengan pandas + visualisasi.
2. **Dashboard sederhana** — olah data yang sama menjadi dashboard statis (HTML/CSS/JS atau Looker Studio) dengan 3–4 metrik utama.
3. **Studi kasus SQL** — ambil database publik, tulis 5–10 query analitik, dan dokumentasikan temuan di README.

Simpan hasilnya sebagai repo terpisah, lalu tambahkan kartu project baru di situs ini.

## Kredit

- Foto profil: foto pribadi Naufal Darmawan
- Foto cover & CTA: [Unsplash](https://unsplash.com)
- Ikon brand: [Simple Icons](https://simpleicons.org) (CC0)
- Font: [Inter](https://rsms.me/inter/) dan [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) via Google Fonts

## Catatan

- Tidak ada klaim pengalaman kerja profesional, awards, publikasi, atau sertifikasi di situs ini karena datanya belum tersedia. Experience dan pendidikan yang tampil sudah berdasarkan data asli.
- Contribution heatmap menampilkan aktivitas publik GitHub apa adanya. Kalau ingin grafik lebih ramai, rajin commit ke repo publik.
- Cover dan CTA masih memakai foto stok; ganti dengan foto atau visual milik sendiri kalau sudah ada.
