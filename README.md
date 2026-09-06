
**Team PLATea+(Platypus)**

Built for **Code to Connect 2026**.

Group Member:
Nam Anh Trinh
Ha Linh Nguyen
Ha Phuong Nguyen
Phuong Trang Tran

# Product name: 🌸 PeTAL

**PeTAL** is a mobile application for discovering trees and flowering plants around Melbourne, developed by **Team PLATea** for **Code to Connect 2026**.

PeTAL brings together Melbourne's urban forest data, flowering information, plant identification, and location-based navigation to help users discover what is blooming around them and explore Melbourne's urban nature.

## ✨ Key Features

### 🌸 Bloom Prediction

PeTAL estimates the flowering status of tree species using botanical and observational data from **VicFlora, HortFlora, and iNaturalist**.

Depending on the available evidence, a species can be classified as:

- **Blooming**
- **Blooming Soon**
- **Not in Season**
- **Unknown**

When there is insufficient evidence, PeTAL returns `unknown` rather than making an unsupported prediction.

### 🌺 Blooming Now

The **Blooming Now** feature provides users with a list of species currently predicted to be flowering.

Users can select a blooming species and explore matching registered trees around Melbourne directly on the map.

### 🔎 Tree Search & Details

Users can search Melbourne trees by **common name, scientific name, or genus** using the **City of Melbourne Urban Forest dataset**.

Detailed tree information includes species, location, planting information, dimensions, and predicted bloom status.

### 📷 Plant Identification

Users can upload a photo of a flower or plant to identify its species.

PeTAL uses **Gemini** for image identification, with **Pl@ntNet as an automatic fallback**. Low-confidence results are flagged rather than presented as certain.

After identifying the species, PeTAL can find the **nearest registered tree of that species** using the user's current location. Users can then view the tree's predicted bloom status and locate it on the map.

### 🗺️ Interactive Map

PeTAL displays registered trees around Melbourne on an interactive map.

Users can:

- Explore tree locations around Melbourne
- View trees from the **Blooming Now** feature
- Locate identified or searched trees
- Select and highlight individual trees
- View their live position relative to a selected tree

### 🧭 Live Tracking & Navigation

Once a tree is selected, users can track their location relative to it in real time.

PeTAL:

- Tracks the user's live GPS position
- Updates their distance from the selected tree
- Uses compass heading to display their direction
- Generates a walking route using the **Mapbox Directions API**

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo
- TypeScript
- Expo Router
- React Native Maps

### Backend
- Node.js
- Express
- TypeScript

### APIs & Data Sources
- City of Melbourne Urban Forest
- VicFlora
- HortFlora
- iNaturalist
- Gemini
- Pl@ntNet
- Mapbox Directions API

## 🚀 Getting Started

Two projects need to run for the app to fully work: `PLATea/` (the Expo app) and `server/` (the Express backend).

### Prerequisites

- Node.js installed
- [Expo Go](https://expo.dev/go) on your phone (App Store / Play Store) — make a free account in it
- **Everyone's phone and laptop must be on the same private Wi-Fi** (a personal hotspot also works). University/public Wi-Fi and some home Wi-Fi (client isolation / CGNAT) block phone-to-laptop connections.

### Install

```bash
cd PLATea && npm install
cd ../server && npm install
```

### Environment variables

Neither `.env` file is committed to git — create both yourself. Real values are in `TOKENS.md` (not committed — ask a teammate for it).

**`server/.env`**
```
GEMINI_API_KEY=<message us to get this key/token>
PLANTNET_API_KEY=<message us to get this key/token>
```
Without these, the app still works — only photo-based plant identification is disabled.

**`PLATea/.env`**
```
EXPO_PUBLIC_API_URL=http://YOUR-LAPTOP-LAN-IP:3000
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=<message us to get this key/token>
```
Find your LAN IP with `ipconfig` (Windows) or `ipconfig getifaddr en0` (Mac). **This changes every time you switch networks.**

### Run it

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd PLATea && npm start
```
Scan the QR code with your phone's camera (iOS) or Expo Go (Android).

### Troubleshooting

- **"fetch failed" on your phone but not your laptop** — wrong Wi-Fi, or a stale IP in `EXPO_PUBLIC_API_URL`.
- **`Cannot find native module 'ExpoAsset'`** — update the Expo Go app on your phone to match this project's Expo SDK version.
- **Camera search fails** — `server/.env` is missing `GEMINI_API_KEY`/`PLANTNET_API_KEY`.