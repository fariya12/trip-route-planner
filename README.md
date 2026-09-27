# Wayfare — Trip and Route Planning Mobile Application

## Project Overview

A React Native, Expo and TypeScript application developed as a technical assignment for **Codenzic Innovations**. The app presents a Figma-based trip-planning flow: validate a mock login, select pickup and destination locations, and explore a demonstration route.

## Features

- **Login:** email and password validation, field-specific errors, password visibility toggle, loading feedback and duplicate-submission prevention.
- **Mock authentication:** asynchronous local authentication; a registration demo returns to Login without creating an account.
- **Location selection:** searchable saved suggestions, active pickup/drop-off fields, automatic progression to drop-off, clear controls and location swapping. Identical or invalid stops cannot proceed.
- **Current location:** foreground permission request and device coordinates through `expo-location`, with loading, permission and timeout feedback.
- **Map selection:** a modal supports placing, dragging and confirming a coordinate pin when native maps are available.
- **Trip Ready state:** two confirmed, distinct locations enable the orange Next button within Set Locations.
- **Route View:** selected stops, map controls, supported demo route geometry, duration, distance, calculated arrival time and turn-by-turn demonstration instructions.
- **Travel modes:** Drive, Ride and Walk select separate mock route data for the supported trip.
- **Navigation action:** Start navigation launches a manually advanced demo with next-step, finish and stop controls.
- **Offline route map:** locally bundled artwork remains available when native map tiles fail to load.

## Tech Stack

| Area | Implementation |
| --- | --- |
| Core | Expo SDK 57 (`~57.0.25`), React Native `0.86.3`, React `19.2.3` |
| Language and checks | TypeScript `~6.0.3`, ESLint 9, `eslint-config-expo` |
| Navigation | React Navigation 7: `@react-navigation/native`, `@react-navigation/native-stack`; `react-native-screens` |
| State | React Context and hooks (`TripContext`, `useTrip`) |
| Maps and illustration | `react-native-maps` `1.27.2`, `react-native-svg` `15.15.4`, bundled PNG assets |
| Device integration | `expo-location`, `expo-constants`, `expo-status-bar`, `react-native-safe-area-context` |
| Typography | `expo-font`, `@expo-google-fonts/nunito-sans` |
| Android builds | Expo EAS Build with an internal APK profile |

`@react-navigation/elements`, `@react-navigation/bottom-tabs` and `expo-linear-gradient` are also installed. The active navigation uses a native stack, not bottom tabs. No backend, Redux or external authentication service is used.

## Project Structure

```text
src/
├── assets/
│   ├── icons/                  # Raster assets and SVG registry
│   ├── images/                 # Logo and bundled map image
│   └── index.ts                # Central asset exports
├── components/
│   ├── common/                 # Buttons, inputs, headers, container, icons
│   ├── location/               # Location rows, search and map picker
│   ├── map/MockRouteMap.tsx    # Offline illustration
│   └── route/                  # Native map/fallback and diagnostic component
├── constants/                  # Colors, typography, spacing and trip theme
├── context/TripContext.tsx     # In-memory selections and route state
├── data/                       # Mock locations and mode-specific routes
├── hooks/useTrip.ts
├── navigation/                 # RootNavigator and typed stack parameters
├── screens/
│   ├── auth/                   # LoginScreen and RegisterScreen
│   └── trip/                   # SetLocationsScreen and RouteViewScreen
├── services/                   # Mock authentication and location access
├── types/                      # Location, trip and travel-mode types
└── utils/                      # Validation, coordinate and route helpers
```

`App.tsx` connects the providers and navigation. Screens compose reusable components; services isolate authentication and device-location work. Images and icons are imported through the asset indexes. Root configuration lives in `app.json`, `app.config.ts` and `eas.json`.

## Getting Started

### Prerequisites

- Node.js compatible with Expo SDK 57 and npm.
- Expo Go compatible with the project's SDK for development testing.
- An Android device, or an Android emulator with Expo Go installed.

From the project root:

```bash
npm install
npx expo start
```

On a physical Android device, open Expo Go and scan the terminal QR code. Keep the computer and device on the same accessible network. For an emulator, start it first and press `a` in the Expo terminal. Alternatively, run `npm run android`.

Available code checks:

```bash
npx tsc --noEmit
npm run lint
npx expo-doctor
```

These commands check types, lint rules and project configuration; they do not replace device testing.

## Mock Login

Any syntactically valid email and password of **at least six characters** are accepted. Email whitespace is trimmed; the password is not trimmed or modified. Both fields are required.

`authService.ts` simulates a 600 ms delay and returns a typed mock user. There are no fixed credentials, server requests or persisted sessions. Use sample values rather than real credentials. Registration is a validation demo, and Forgot password displays an informational message rather than performing account recovery.

## Application Flow

```text
Login → Set Locations → Route View
  ↕
Register (demo)
```

Successful login resets the navigation stack to Set Locations and clears the previous trip. Set Locations starts with empty stops and a disabled Next button.

**Trip Ready is the completed state of Set Locations, not a separate confirmation screen.** Both confirmed, valid and different stops enable Next, which opens Route View directly. Returning from Route View preserves the selections in `TripContext`. Clearing or editing a selected location invalidates it until a new selection is confirmed.

## Map and Route Implementation

### Native map and offline fallback

`RouteMap` uses `react-native-maps` markers and a route polyline, fitting the viewport to the selected coordinates and supported route points. Its layers control switches between standard and satellite maps.

The fallback addresses reported Android Expo Go behavior where the map initialized but tiles remained blank (`ready: true`, `loaded: false`). The underlying device/provider cause has not been confirmed.

Local artwork appears while native tiles load. If loading completes, the native map is shown; otherwise, a five-second timeout keeps the offline map and unmounts the native view. Manual offline and retry controls are available when native maps are enabled. Standalone Android builds without map-key configuration use the Route View fallback immediately.

`MockRouteMap` uses bundled `mapview.png` for the supported Home-to-office Drive preview and a local SVG schematic for other modes or selections. It needs no tile downloads. Offline layers change the illustration's tint or palette, not satellite imagery.

### Supported demonstration route

Select **Home → Marina Office Tower** from saved suggestions to view the complete demo:

| Mode | Mock duration | Mock distance |
| --- | --- | --- |
| Drive | 24 minutes | 9.6 km |
| Ride | 28 minutes | 10.2 km |
| Walk | 118 minutes | 9.1 km |

Each mode has predefined illustrative coordinates and instructions in `mockRoutes.ts`. Arrival time is calculated from the device clock and mock duration. The Drive fixture includes a sample traffic warning. These are not verified roads, live traffic, calculated routes or GPS navigation.

The preview requires matching saved-location IDs, coordinates and mock sources. Other pairs, reversed trips and device/map selections show stop markers with an unavailable-route message; they receive no invented estimates, polyline or directions. Demo navigation is disabled without supported instructions.

## Android APK Build

The existing `eas.json` includes:

```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {}
  }
}
```

With an Expo account and network access:

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

The Android application ID is `com.fariyam.wayfare`, and the project is linked to EAS through `expo.extra.eas.projectId` in `app.json`. The dynamic `app.config.ts` preserves these settings. EAS manages the build version remotely. Complete any signing-credential prompts on the first build.

Alternatively, `npm run build:android` invokes the preview build through `npx eas-cli@latest` without a global installation.

A successful EAS build provides an APK download link for installation on Android. Google Play publication is not required. **No completed APK build or download link is provided with this README.** See the [Expo APK build guide](https://docs.expo.dev/build-reference/apk/).

Route View's offline map needs no Google Maps key. The separate native map picker requires working native map configuration in a standalone Android build. `app.config.ts` supports an optional `GOOGLE_MAPS_ANDROID_API_KEY` environment variable; no key is included in the repository.

## Limitations

- Authentication and registration are demonstrations, not production security or account management. Trip state is held in memory and resets when the application restarts.
- Suggested addresses have approximate mock Doha coordinates, not verified street/building positions.
- Search filters saved locations only. Custom text is unconfirmed: there is no geocoding, and proceeding requires a suggestion, device coordinate or confirmed map pin.
- There is no backend, directions API, live traffic, route optimization or live turn-by-turn GPS guidance.
- The offline fallback is limited to Route View. The Set Locations map picker still relies on native map tiles; use saved suggestions or current location when tiles are unavailable.
- Device location depends on permission, enabled location services and a successful position fix.
- Offline artwork is illustrative and cannot be used as a geographic navigation map.
- Full end-to-end testing is deferred. Source inspection does not establish physical-device behavior, map-provider availability or a successful APK build.

## Design Reference

[Figma — React Native Assignment](https://www.figma.com/design/fVtFLgOH147WiRTpSGxVqz/React-Native-Assignment?node-id=0-1)

The main design states are Login, Set Locations, Trip Ready and Route View. Trip Ready shares the Set Locations implementation.

## Author

**Fariya M**  
React Native Developer
