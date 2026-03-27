# Ramadan Companion

A feature-rich digital companion application for the holy month of Ramadan, built with Next.js 15 and React 19. The app helps Muslims with prayer times, Quran reading, daily worship tracking, Zakat calculation, Islamic supplications, and Ramadan calendar — all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [External APIs](#external-apis)
- [Components](#components)
- [Custom Hooks](#custom-hooks)
- [Data Persistence](#data-persistence)
- [Configuration](#configuration)

---

## Overview

Ramadan Companion is a full-featured web application designed for Ramadan 1446H (March 2025). It provides real-time prayer times based on the user's geolocation, interactive Quran browsing with a 30-day reading plan, a daily Ibadah tracker, a Zakat calculator with multi-currency support, a curated collection of authentic Duas, and a Ramadan calendar highlighting special nights.

---

## Features

### Prayer Times & Geolocation
- Auto-detects user location via the Browser Geolocation API
- Fetches accurate prayer times from the Aladhan API
- Displays countdown timer to the next prayer (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Falls back to Lahore, Pakistan if geolocation is unavailable

### Quran Browsing
- Loads the full Quran text (Uthmani script) from the AlQuran Cloud API
- Browse all 114 Surahs with Ayah details
- Open detailed Surah view and navigate between Surahs

### 30-Day Reading Plan
- Track reading progress across all 30 Juz (sections of the Quran)
- Mark completed Juz with visual feedback
- Progress is persisted via localStorage

### Daily Ibadah Tracker
- Track 10 worship activities: 5 daily Salah, Quran reading, Dhikr, Sadaqah, Tarawih, and Niyyah
- Daily progress percentage calculation
- Weekly progress chart (Monday–Sunday)
- Auto-resets daily (keyed by date in localStorage)

### Islamic Duas Collection
- 24+ authentic supplications organized into 4 categories:
  - Morning Adhkar
  - Evening Adhkar
  - Post-Prayer Duas
  - Ramadan Duas
- Each Dua includes: Arabic text, Transliteration, English translation, and Source reference

### Zakat Calculator
- Input fields for: Cash, Gold, Silver, Business assets, Receivables, and Debts
- Multi-currency support: PKR, USD, GBP, EUR, SAR, AED
- Automatically calculates 2.5% Zakat on net assets above Nisab
- Shows a full calculation breakdown

### Ramadan Calendar
- All 30 days of Ramadan 1446H displayed interactively
- Visual distinction for past, current, and future days
- Highlights special nights: Night 1, 15, 17, 21, 23, 27, 29, 30
- Detailed notes for significant dates including Laylatul Qadr
- Text-to-speech reminders for Laylatul Qadr via the Web Speech API

### Real-Time Clock
- Live clock updating every second
- Dual date display: Gregorian and Hijri (1–30 Ramadan 1446H)

### Animated Background
- 80 procedurally generated twinkling stars rendered on a canvas-like starfield

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15.1.0 |
| UI Library | React 19.0.0 |
| Language | TypeScript 5.7.0 |
| Icons | Lucide React 1.7.0 |
| Fonts | Cinzel Decorative, Crimson Pro, JetBrains Mono (via Google Fonts) |
| Linting | ESLint 9.16.0 |

---

## Project Structure

```
Ramdan-Campion/
├── app/
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with Google Fonts
│   └── page.tsx                 # Main page entry point
├── components/
│   ├── RamadanApp.tsx           # Top-level export wrapper
│   └── ramadan/
│       ├── RamadanApp.tsx       # Core app — state, tab navigation
│       ├── features/
│       │   ├── home/            # Prayer times, countdown, quick tracker
│       │   ├── quran/           # Surah browser and reading plan
│       │   ├── duas/            # Islamic supplications collection
│       │   ├── tracker/         # Daily Ibadah tracker with weekly chart
│       │   ├── zakat/           # Zakat calculator
│       │   └── calendar/        # Ramadan 1446H calendar
│       └── layout/
│           ├── AppHeader.tsx    # Header: Hijri/Gregorian date and time
│           ├── AppFooter.tsx    # Footer
│           ├── TabBar.tsx       # Bottom navigation (6 tabs)
│           └── StarsBackground.tsx  # Animated starfield
├── hooks/
│   ├── useRamadanClock.ts       # Real-time Gregorian/Hijri clock
│   ├── usePrayerSchedule.ts     # Prayer times with geolocation
│   ├── useIbadahTracker.ts      # Daily worship state + localStorage
│   ├── useJuzRead.ts            # Juz reading progress tracker
│   └── useStars.ts              # Star animation state
├── lib/
│   ├── constants.ts             # Verses, Duas, tracker items, calendar data
│   ├── types.ts                 # TypeScript type definitions
│   ├── utils.ts                 # Helper/utility functions
│   └── quran-api.ts             # Quran API fetch and caching logic
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── .eslintrc.json               # ESLint configuration
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Ramdan-Campion

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Compile the app for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint checks |
| `npm run clean` | Remove the `.next` build directory |

---

## External APIs

| API | Purpose | Endpoint |
|---|---|---|
| **Aladhan** | Prayer times by coordinates | `https://api.aladhan.com/v1/timings/{date}` |
| **AlQuran Cloud** | Full Quran text (Uthmani script) | `https://api.alquran.cloud/v1/quran/quran-uthmani` |
| **OpenStreetMap Nominatim** | Reverse geocoding (coordinates → city name) | `https://nominatim.openstreetmap.org/reverse` |
| **Browser Geolocation API** | Get user GPS coordinates | Built-in browser API |
| **Web Speech API** | Text-to-speech for Laylatul Qadr reminders | Built-in browser API |

---

## Components

| Component | Description |
|---|---|
| `RamadanApp` | Root component — manages global state and tab routing |
| `HomeTab` | Prayer times card, countdown to next prayer, quick Ibadah checklist |
| `QuranTab` | Surah list, detailed Surah view, 30-day Juz reading plan |
| `DuasTab` | Categorized supplications with Arabic, transliteration, and translation |
| `TrackerTab` | Ibadah checklist, daily progress bar, weekly chart |
| `ZakatTab` | Asset input form, currency selector, Zakat calculation breakdown |
| `CalendarTab` | 30-day Ramadan calendar, special nights panel, TTS reminder |
| `AppHeader` | Live Gregorian date, Hijri date (Ramadan 1446H), current time |
| `TabBar` | Bottom navigation with icons for all 6 feature tabs |
| `StarsBackground` | Animated twinkling star background |

---

## Custom Hooks

| Hook | Description |
|---|---|
| `useRamadanClock` | Provides current Gregorian date, Hijri date, and live time string |
| `usePrayerSchedule` | Fetches prayer times from Aladhan API using device geolocation |
| `useIbadahTracker` | Manages tracker state, completion toggles, and localStorage sync |
| `useJuzRead` | Tracks which Juz have been read, persists to localStorage |
| `useStars` | Generates and animates the background star positions |

---

## Data Persistence

All user data is stored locally in the browser using `localStorage`:

- **Ibadah Tracker** — keyed by the current date (`tracker_YYYY-MM-DD`), auto-resets at midnight
- **Juz Reading Plan** — persists across sessions under a fixed key
- **No backend or account required** — everything runs client-side

---

## Configuration

| File | Purpose |
|---|---|
| `next.config.ts` | Disables devtools segment explorer in development |
| `tsconfig.json` | Strict TypeScript, path aliases (`@/*`), ES2017 target |
| `.eslintrc.json` | Extends `next/core-web-vitals` ruleset |
| `app/globals.css` | CSS variables, global resets, component-level styles |

---

## Team

Built with by the Ramadan Companion team as part of a Hackathon project.

---

## License

This project is open source and available for educational and personal use.
