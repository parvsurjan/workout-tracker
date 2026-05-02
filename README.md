# Workout Tracker — iOS native build via Xcode

Offline-only React Native + Expo (bare workflow) app. After installing once via Xcode, the app runs fully on-device — **no Metro bundler, no laptop, no internet required**.

## One-time setup

You need: macOS, Xcode (App Store), Node 18+, an Apple ID, and a USB cable for your iPhone.

```bash
cd /Users/parvsurjan/Desktop/workout-tracker

# install JS deps
npm install

# generate native ios/ project from app.json (bare workflow)
npx expo prebuild --platform ios --clean

# install CocoaPods deps for the native project
cd ios && pod install && cd ..
```

## Open in Xcode

```bash
open ios/WorkoutTracker.xcworkspace
```

(Use the `.xcworkspace`, **not** the `.xcodeproj`.)

## Configure signing for personal-team install

1. In Xcode, select the **WorkoutTracker** project in the left sidebar.
2. Select the **WorkoutTracker** target → **Signing & Capabilities** tab.
3. Check **Automatically manage signing**.
4. **Team** → log in with your Apple ID and pick your **Personal Team**.
5. If you get a bundle-id collision, change `Bundle Identifier` to something unique, e.g.
   `com.parvsurjan.workouttracker.<initials>`.

## Build & install to your iPhone

1. Plug in your iPhone via USB. Unlock it. Trust the Mac if prompted.
2. In Xcode's top toolbar, set the run destination to your iPhone (next to the scheme dropdown).
3. Press **⌘R** (or the ▶ Play button) to build and install.
4. First launch: on iPhone go to **Settings → General → VPN & Device Management → [your Apple ID] → Trust**.
5. Open **Workout Tracker** from your home screen. Done.

The app is now installed permanently. You can disconnect the USB cable, close Xcode, shut down your Mac — the app keeps working. All progress saves to local AsyncStorage on the phone.

## Personal-team caveat

Free Apple IDs sign apps for **7 days**. After that the app stops launching until you rebuild. To get **1 year**, enroll in the Apple Developer Program ($99/yr), then in step 4 above pick the paid team instead.

## Pushing updates later

Edit any code, then:

```bash
cd /Users/parvsurjan/Desktop/workout-tracker
# rebuild: open the workspace and press ⌘R while iPhone is plugged in
open ios/WorkoutTracker.xcworkspace
```

Press **⌘R** in Xcode. New build replaces the old one. Your AsyncStorage progress (current day index, calisthenics progress) is preserved across upgrades because the bundle identifier stays the same.

If you change anything in `app.json` (icon, splash, name, plugins), re-run:

```bash
npx expo prebuild --platform ios --clean
cd ios && pod install && cd ..
```

then rebuild in Xcode.

## Project layout

```
app/
  _layout.tsx              root Stack
  (tabs)/
    _layout.tsx            bottom tab bar
    index.tsx              Workout tab
    calisthenics.tsx       Calisthenics tab
data/
  workoutPlan.ts           full 6-week / 42-day plan
  calisthenics.ts          4 progression tracks (Push/Pull/Core/Skill)
theme.ts                   colors and design tokens
```

## Storage keys

- `currentDayIndex` — single integer 0–41 for the workout plan
- `calisthenicsProgress` — `{ push, pull, core, skill }` of current step indices
