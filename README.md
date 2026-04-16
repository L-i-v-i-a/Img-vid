# IMG-VID - AI Video Generation App

A React Native mobile application that allows users to create AI-powered animations from images using text prompts. The app provides a seamless flow for uploading images, describing desired animations, and managing generation history.

## Overview

IMG-VID is an AI video generation engine that transforms static images into dynamic animations based on user-provided text prompts. The app features a clean, intuitive interface built with React Native and Material Design components.

## Features

- **Image Upload**: Select images from device gallery
- **Text Prompts**: Describe desired animation effects
- **Processing Modal**: Real-time feedback during animation generation
- **Generation History**: Track all created animations with status
- **Modern UI**: Material Design with React Native Paper
- **Navigation**: Smooth screen transitions with React Navigation

## App Flow

1. **Splash Screen**: Displays "IMG-VID" branding and loads app resources
2. **Login/Signup**: User authentication screens (placeholder for future implementation)
3. **Home Screen**: 
   - View generation history
   - Access "New Animation" creation
4. **Create Animation Screen**:
   - Upload image from gallery
   - Enter animation prompt
   - Process request with loading modal
   - Auto-return to home with new entry in history

## Technical Stack

- **React Native** (v0.81.5) - Cross-platform mobile framework
- **Expo** (v54.0.33) - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **React Navigation** (v7) - Navigation and routing
- **React Native Paper** (v5.15.1) - Material Design UI components
- **Expo Image Picker** - Image selection from device gallery

## Project Structure

```
Img-vid/
README.md
ImgVidApp/
  App.tsx                 # Main app component and navigation setup
  package.json            # Dependencies and scripts
  app.json               # Expo configuration
  screens/
    SplashScreen.tsx      # App launch screen
    LoginScreen.tsx       # User login (placeholder)
    SignupScreen.tsx      # User registration (placeholder)
    HomeScreen.tsx        # Main dashboard with history
    CreateAnimationScreen.tsx # Animation creation flow
  assets/                 # Images and icons
  node_modules/          # Dependencies
```

## Installation & Setup

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Physical device or emulator/simulator

### Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Img-vid
   ```

2. **Navigate to app directory and install dependencies**:
   ```bash
   cd ImgVidApp
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on mobile device**:
   - Open Expo Go app on your mobile device
   - Scan the QR code shown in terminal

## Usage Guide

### Creating an Animation

1. Launch the app and wait for splash screen
2. Navigate through login/signup (currently placeholders)
3. On the Home screen, tap the "New Animation" FAB button
4. **Select Image**: Tap "Choose Image" to upload from gallery
5. **Enter Prompt**: Describe your desired animation (e.g., "Logo zoom effect", "3D rotation", "Fade in animation")
6. **Create Animation**: Tap the create button
7. **Processing**: Wait for the processing modal to complete
8. **View Result**: Automatically returns to home with new animation in history

### Viewing History

- The Home screen displays all generated animations
- Each entry shows:
  - Animation prompt/description
  - Creation date
  - Status (Completed)
- Newest animations appear at the top

## Development Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
```

## Configuration

### Environment Setup

The app uses Expo's managed workflow. Key configuration files:

- `app.json`: Expo app configuration
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration

### Image Picker Permissions

The app requires camera roll permissions for image selection. These are automatically handled by Expo Image Picker.

## Future Enhancements

- **Backend Integration**: Connect to Django/Flask API for actual AI processing
- **User Authentication**: Implement real login/signup with backend
- **Video Preview**: Display generated animations instead of placeholders
- **Cloud Storage**: Upload images to cloud services
- **Advanced Prompts**: Support for complex animation parameters
- **Sharing**: Export and share generated animations
- **Offline Mode**: Cache animations for offline viewing

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **Image picker not working**: Ensure permissions are granted
3. **Navigation issues**: Check React Navigation stack configuration
4. **Build errors**: Verify all dependencies are installed

### Debug Commands

```bash
expo start --clear     # Clear Metro cache
expo doctor           # Check for common issues
npm install           # Reinstall dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple platforms
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please reach out to the development team.
