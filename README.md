# Portfolio — Raka Adhitama

Website portfolio satu halaman dengan nuansa gelap, tipografi editorial, dan detail interaksi kecil. Dibuat tanpa framework, tanpa build step — hanya HTML, CSS, dan JavaScript.

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
npx serve .
```

Lalu buka alamat yang ditampilkan (biasanya `http://localhost:3000`).

## Yang sudah ada

- Hero dengan cover, avatar, bio, status, dan tautan sosial
- Navigasi section yang sticky + active state saat scroll
- Experience & education dalam bentuk kartu
- Projects dengan dialog case study interaktif
- Stack teknologi dengan ikon
- GitHub-style contribution heatmap yang digenerate dari data deterministik
- Awards, publications, certifications
- CTA, footer dengan jam Jakarta real-time, copy email, dan back-to-top
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

## Cara mengganti konten

### 1. Nama, bio, dan kontak

Semua ada di `index.html`:

- Nama: cari `Raka Adhitama`
- Bio: cari `hero__bio`
- Role, lokasi, dan domain: cari `hero__meta`
- Email: ganti semua `hello@raka.dev`
- Sosial link: ganti URL `github.com`, `linkedin.com`, `x.com`, `instagram.com`

### 2. Foto

Ganti file berikut (nama file boleh tetap sama):

- `assets/cover.jpg` — rasio sekitar 16:7, minimal 1400 px lebar
- `assets/avatar.jpg` — foto persegi, minimal 300 × 300 px
- `assets/cta.jpg` — background CTA, minimal 1400 px lebar

### 3. Experience, projects, awards, dll.

Semua section ada di `index.html` dan ditandai komentar:

```html
<!-- ============ EXPERIENCE ============ -->
<!-- ============ PROJECTS ============ -->
<!-- ============ STACK ============ -->
```

Tinggal duplikasi atau edit elemen yang sudah ada.

### 4. Isi dialog project

Data detail project ada di `script.js` pada object `projects`:

```js
const projects = {
  loka: {
    title: "Loka — AI Research Assistant",
    year: 2026,
    accent: "#8be9b0",
    summary: "...",
    tags: ["Next.js", "FastAPI"],
    points: ["...", "..."]
  }
};
```

Key object harus sama dengan `data-project` pada tombol di `index.html`.

### 5. Warna dan font

Palette, radius, dan font ada di bagian `:root` pada `styles.css`:

```css
--bg: #07080a;
--accent: #8be9b0;
--font-sans: "Inter", sans-serif;
--font-display: "Instrument Serif", serif;
```

### 6. Data heatmap

Heatmap menggunakan data demo deterministik di `script.js` (`initHeatmap`). Untuk memakai data GitHub asli, ganti bagian pembuatan `count` dengan data dari GitHub API atau JSON statis milikmu.

## Deploy

### Vercel

1. Push folder ini ke repository GitHub.
2. Import repository di [vercel.com](https://vercel.com).
3. Framework preset: **Other**. Build command dikosongkan, output directory `.`.

### Netlify

1. Drag-and-drop folder `portfolio` ke [app.netlify.com/drop](https://app.netlify.com/drop).
2. Selesai — tidak perlu build command.

### GitHub Pages

1. Push ke repository GitHub.
2. Buka **Settings → Pages**.
3. Pilih branch `main`, folder `/ (root)`.

## Kredit

- Foto: [Unsplash](https://unsplash.com)
- Ikon brand: [Simple Icons](https://simpleicons.org) (CC0)
- Font: [Inter](https://rsms.me/inter/) dan [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) via Google Fonts

## Catatan

Konten di demo ini fiktif (nama, perusahaan, pencapaian, dan tautan) — ganti dengan data asli sebelum dipublikasikan. Foto avatar adalah foto stok, bukan orang yang direpresentasikan.
