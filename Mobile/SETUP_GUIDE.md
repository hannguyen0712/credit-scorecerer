# AI Credit Optimizer - Development Setup Guide

## Prerequisites

### 1. Install Node.js and npm
```bash
# Check if already installed
node --version
npm --version
```

### 2. Install React Native CLI
```bash
npm install -g @react-native-community/cli
```

### 3. For iOS Development (macOS only)

#### Install Xcode
- Download and install Xcode from the App Store
- Open Xcode and accept the license agreements
- Install Xcode Command Line Tools: `xcode-select --install`

#### Install CocoaPods
```bash
sudo gem install cocoapods
```

#### Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

### 4. For Android Development

#### Install Java Development Kit (JDK)
```bash
# Install using Homebrew (recommended)
brew install openjdk@11

# Or download from Oracle
# https://www.oracle.com/java/technologies/downloads/
```

#### Install Android Studio
1. Download Android Studio from https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio and go through the setup wizard
4. Install Android SDK, Android SDK Platform-Tools, and Android SDK Build-Tools

#### Set up Environment Variables
Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Create Android Virtual Device (AVD)
1. Open Android Studio
2. Go to Tools > AVD Manager
3. Create a new Virtual Device
4. Choose a device (e.g., Pixel 4)
5. Download and select a system image (e.g., API 33)
6. Finish setup

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on iOS (macOS only)
```bash
npm run ios
```

### Run on Android
```bash
npm run android
```

## Troubleshooting

### Common Issues

1. **"CocoaPods not found"**
   ```bash
   sudo gem install cocoapods
   cd ios && pod install
   ```

2. **"No emulators found"**
   - Open Android Studio
   - Go to Tools > AVD Manager
   - Create a new Virtual Device
   - Start the emulator

3. **"Java Runtime not found"**
   ```bash
   brew install openjdk@11
   ```

4. **"adb: command not found"**
   - Install Android SDK Platform-Tools in Android Studio
   - Add to PATH: `export PATH=$PATH:$ANDROID_HOME/platform-tools`

### Check Development Environment
```bash
npx react-native doctor
```

## Alternative: Use Expo (Easier Setup)

If you want to avoid the native setup complexity, you can use Expo:

```bash
# Install Expo CLI
npm install -g @expo/cli

# Initialize with Expo
npx create-expo-app --template blank-typescript AICreditOptimizerExpo

# Copy your src folder to the new project
# Then run: npx expo start
```

## Quick Start (Recommended)

For the fastest setup, I recommend:

1. **Install Android Studio** (includes everything needed for Android)
2. **Create an Android Virtual Device** in Android Studio
3. **Run the app on Android** first (easier than iOS setup)

```bash
# After setting up Android Studio and creating an AVD:
npm start
# In another terminal:
npm run android
```

## Next Steps

Once you have the development environment set up:

1. The app will run with mock data (no backend needed)
2. All features are functional for testing
3. You can modify the code and see changes in real-time
4. The app includes hot reload for fast development

## Support

If you encounter issues:
1. Check the React Native documentation: https://reactnative.dev/docs/environment-setup
2. Run `npx react-native doctor` to diagnose issues
3. Check the troubleshooting section above

