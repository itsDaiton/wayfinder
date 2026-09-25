# Wayfinder

A personal Android app for planning running, walking and cycling routes on Mapy.com maps. Tap to add points, the route follows real paths, and routes are saved on the phone and exported as GPX.

- [Product spec](docs/SPEC.md): how the app behaves, and the technical decisions
- [v1 epic](https://github.com/itsDaiton/wayfinder/issues/2): the tickets for version 1
- [CONTEXT.md](CONTEXT.md): the domain glossary
- [AGENTS.md](AGENTS.md): how to work in this repo, including the commands

## Run it locally

The app runs as an Expo **development build**, a debug version of Wayfinder installed on the phone, not in Expo Go. The map library has native code that Expo Go doesn't include.

**Once per machine**

1. Install Node, using the version in [`.nvmrc`](.nvmrc).
2. Install Android Studio, which brings the Android SDK, the emulator and a JDK. Then follow Expo's [Android setup for development builds](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=physical&mode=development-build&buildEnv=local). It covers `ANDROID_HOME` and turning on USB debugging on the phone.
3. Run `npm install`.

**Day to day**

- `npm run android` builds the development build, installs it on the connected phone (or the running emulator) and starts Metro. Use it the first time, and again whenever native code changes: a new native package or new `app.json` plugins.
- Otherwise, `npm start` is enough. Open Wayfinder on the phone and code changes appear right away.

## See the phone screen in VS Code

VS Code suggests the recommended extensions when you open the repo: ESLint, Prettier, Expo Tools and Radon IDE. Files are formatted and lint-fixed on save.

- **[Radon IDE](https://radon.swmansion.com)** puts the Android emulator in a VS Code panel next to the code. It builds and installs the development build itself, and adds an element inspector, logs and breakpoints. Open it with **Radon IDE: Open IDE Panel** from the command palette.
  - It officially supports only macOS.
  - It's commercial, with a free trial and a free plan for hobbyists.
- **[scrcpy](https://github.com/Genymobile/scrcpy)** is free and works on Windows, macOS and Linux. It mirrors the real phone, over USB or Wi-Fi, into a window you control with the mouse and keyboard. Put it next to VS Code and run `scrcpy` with the phone connected. The real phone is the better test for GPS and touch, which an emulator only fakes.
- The **Android Emulator** from Android Studio also works in its own window: start it, then run `npm run android`.
