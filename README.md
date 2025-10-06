# 📱 Listalicious
This is a cross-platform mobile app built with **React Native** and **Expo**. It runs on **iOS**, **Android**, and **Web**. This repo is the front end. To see the back end, check out https://github.com/ryanalfa94/listalicious-backend

---

## 🧰 Prerequisites

Make sure you have the following installed:

- [Node.js (LTS)](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

  ```bash
  npm install -g expo-cli
  ```

- [Expo Go App (iOS/Android)](https://expo.dev/client) — for testing on physical devices

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
cd listalicious-frontend
npm install
```

---

## ▶️ Running the App

### 🌍 Web

```bash
npm run start
```

- Opens in your browser (uses React DOM under the hood)

---

### 📱 iOS (No Mac Required)

When you do npm run start, follow the instructions display to run on iOS. A QR code should pop up that you can scan with your camera 

1. Install the **Expo Go** app from the App Store on your iPhone.
2. Scan the QR code shown in your terminal or browser with your camera.
3. The app will load instantly on your device.

> ✅ Note: You **don’t need a Mac or Xcode** when using Expo Go.

---

### 🤖 Android

Same as the iOS. Use the Expo Go app to scan the QR code.

1. Install **Expo Go** from the Play Store.
2. Scan the QR code with Expo Go.
3. Your app will open automatically.

> 💡 You can also use an Android emulator via Android Studio (optional).

---

## 🏗 Building Standalone Apps (Optional)

To build production-ready binaries:

### Using Expo EAS:

Install EAS CLI:

```bash
npm install -g eas-cli
```

Build for iOS:

```bash
eas build --platform ios
```

Build for Android:

```bash
eas build --platform android
```

> 🔐 You’ll need to create a free Expo account and configure `eas.json`.

More details: [EAS Build Docs](https://docs.expo.dev/build/introduction/)

---

## 🧑‍💻 Author

[Muhammad Albayati](https://github.com/malbayati1)
