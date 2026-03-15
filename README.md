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

## App Name & Icon

- App name is set to `Jim Wallet` in `capacitor.config.json` and `android/app/src/main/res/values/strings.xml`.
- Launcher icons live in `android/app/src/main/res/mipmap-*/ic_launcher*.png`. Replace those files to customize the icon.
- Base icon source: `resources/icon.png`.
