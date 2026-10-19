# Smart Diagnostic Reception Manager

The existing React reception application is retained, including its dashboard, appointment and test booking views, patients, doctors, serial management, calendar, reports, SMS helper, and settings.

## Run locally
1. Open this project folder in VS Code.
2. Run `npm install`.
3. Run `npm run dev`.

## Windows desktop installer (Electron)
Run `npm run dist`.

## Installable website (PWA)
Run `npm run build:web`. Deploy the generated `dist` folder to an HTTPS host such as Netlify. Open the deployed site in Chrome and use its Install option. PWA manifest icons are included in `public/`.

## Android APK
Requirements: Node.js, Android Studio, Android SDK, and a supported JDK.

First Android setup:
1. `npm install`
2. `npm run android:setup`
3. `npm run android:open`
4. In Android Studio, wait for Gradle sync, then choose **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

Typical debug APK location: `android/app/build/outputs/apk/debug/app-debug.apk`.

For later updates, run `npm run android:sync` and rebuild the APK.

See `SETUP-BANGLA.txt` for Bengali instructions.

## Website booking sync
In the app Settings, provide the website API URL and the same private token configured as `RECEPTION_API_TOKEN` in the Netlify project that hosts the `/.netlify/functions/admin-bookings` endpoint. Do not put the token into source code. Live sync requires internet access and a correctly configured server endpoint.

The app's local data store and current features are preserved. SMS/email delivery still requires a compatible phone workflow or external provider; this project does not add an SMS gateway.
