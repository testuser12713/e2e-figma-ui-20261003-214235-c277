# Mobile Business Manager

Eine klickbare Expo-/React-Native-App für das Handy (Design-Viewport 414×896), die die drei
Kernbereiche eines kleinen Business-Dashboards abbildet: **Dashboard**, **Money Management**
und **Time Management**. Alle Inhalte sind Beispieldaten direkt im Code — die App läuft
vollständig offline, ohne Backend, ohne Netzwerkanfragen und ohne Persistenz. Look & Feel
(Farben, Schriften, Abstände, Bildmaterial) folgen exakt den Figma-Frames.

## Tech Stack

- **Sprache:** TypeScript
- **Framework:** Expo (React Native), SDK 57
- **Navigation:** React Navigation — Bottom-Tabs (Dashboard | Money Management | Time Management)
  über einem Root-Stack mit Modal-Screens für Erfassungsformulare
- **UI:** React-Native-Core-Komponenten mit `StyleSheet`, `@expo/vector-icons` für Icons,
  lokale Bild-Assets aus `design/figma/assets/`
- **Schriften:** Inter, Aleo und Ubuntu über `@expo-google-fonts/*` + `expo-font`
- **State:** lokaler React-State (`AppDataContext`) mit Beispieldaten in TypeScript-Modulen
- **Tests:** Jest mit dem `jest-expo`-Preset und `@testing-library/react-native`

## Installation

Voraussetzung: Node.js (empfohlen Node 24) und npm.

```bash
npm ci
```

Falls kein passendes Lockfile vorliegt, installiert `npm install` dieselben Abhängigkeiten.

## Entwickeln (Dev)

Ein Gerät oder einen Simulator/Emulator starten (nicht im Automatikbetrieb):

```bash
npm start          # Expo Dev Server (QR-Code für Expo Go / Gerät)
npm run android    # Android-Emulator oder Gerät
npm run ios        # iOS-Simulator (macOS)
npm run web        # Entwicklungs-Build im Browser
```

Alternativ lässt sich die App über die [Expo-Go-App](https://expo.dev/go) auf einem echten
Handy öffnen, indem der QR-Code aus `npm start` gescannt wird.

## Produktions-Build (Web)

```bash
npm run build      # expo export --platform web -> dist/
```

Der statische Build landet in `dist/` und kann mit einem beliebigen statischen Server
ausgeliefert werden, z. B.:

```bash
npx serve dist
```

## Tests

```bash
npm test           # jest (jest-expo)
```

## Benutzung

Nach dem Start erscheint der **Dashboard**-Tab in einer festen Bottom-Tab-Bar:

- **Dashboard** — Einstieg mit Kennzahlen, Kategorienübersicht und Diagramm.
- **Money Management** — Liste der Buchungen mit Kategorie, Datum und formatiertem Betrag.
  Der Floating-Add-Button öffnet das Erfassungsformular.
- **Time Management** — Liste der Termine mit Kategorie und Zeit/Dauer. Der Floating-Add-Button
  öffnet das Erfassungsformular.

Ein Tippen auf einen Tab wechselt sofort zum zugehörigen Screen; der aktive Tab ist
hervorgehoben. Weitere Ansichten (Dashboard-Menü, Statistik, Detailansichten, Erfassungs-
formulare) liegen auf dem Root-Stack und werden von den jeweiligen Screens aus geöffnet.

## Features

- Bottom-Tab-Navigation zwischen Dashboard, Money Management und Time Management
- Dashboard-Menü und Statistik-Ansicht als gestapelte Unterscreens
- Detailansichten für Buchungen und Termine
- Erfassungsformulare (Modal) für Ausgaben und Termine, die die Beispieldaten der Session
  erweitern, ohne die App neu zu laden
- Gemeinsame Beispieldaten (`src/data/`) als einzige Quelle für alle Screens
- Zentrales Design-Token-Set in `src/theme.ts` (Farben, Abstände, Typografie, Radien)
- Vollständig offline, ohne Backend und ohne Konfigurations- oder Secret-Werte
