# Star Wars Character Explorer

A simple mobile app for browsing Star Wars characters. Scroll through the full list, tap a character to see their height, mass, birth year, colors and film count, and pull down to refresh. Characters are saved on your device, so the app still works offline.

Built with React Native (Expo), using data from [SWAPI](https://swapi.info).

## Run

```bash
npm install
npm start
```

Scan the QR code with Expo Go, or press `a` for Android.

## Build APK

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

The APK is saved to `android/app/build/outputs/apk/release/`.

## Tech

Expo Router · TypeScript · Zustand · AsyncStorage
