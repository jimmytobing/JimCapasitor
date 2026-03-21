# JimCapasitor

Minimal mobile wallet-style starter using React, Vite, TailwindCSS, and Capacitor.

## Dev

```bash
npm install
npm run dev
```

## Capacitor Setup

```bash
npx cap init
npx cap add android
npm run build
npx cap sync
```

## Android One-Command Run

```bash
npm run android
```

## Salesforce API From Capacitor

Metode paling sederhana di project ini memakai `CapacitorHttp` dan meminta access token Salesforce otomatis lewat client credentials flow.

1. Copy `.env.example` jadi `.env`
2. Isi:

```bash
VITE_SALESFORCE_AUTH_URL=https://your-domain.my.salesforce.com
VITE_SALESFORCE_INSTANCE_URL=https://your-domain.my.salesforce.com
VITE_SALESFORCE_CLIENT_ID=YOUR_CONNECTED_APP_CONSUMER_KEY
VITE_SALESFORCE_CLIENT_SECRET=YOUR_CONNECTED_APP_CONSUMER_SECRET
VITE_SALESFORCE_API_VERSION=v61.0
```

3. Jalankan app:

```bash
npm run dev
```

4. Buka halaman Settings lalu tekan `Tes Koneksi Salesforce`

Yang sudah dipasang:

- Service Salesforce di `src/shared/services/salesforce.js`
- Request native via `CapacitorHttp` saat jalan di Android/iOS
- Fallback `fetch` saat jalan di browser
- Contoh query `Account` untuk verifikasi koneksi

Catatan:

- Cara ini cocok untuk demo, prototyping, atau koneksi internal cepat.
- Untuk production, lebih aman ganti ke OAuth 2.0 / PKCE dan jangan simpan access token statis di app.

## App Name & Icon

- App name is set to `Jim Wallet` in `capacitor.config.json` and `android/app/src/main/res/values/strings.xml`.
- Launcher icons live in `android/app/src/main/res/mipmap-*/ic_launcher*.png`. Replace those files to customize the icon.
- Base icon source: `resources/icon.png`.
