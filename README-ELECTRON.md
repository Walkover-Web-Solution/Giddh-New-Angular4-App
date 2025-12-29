# Giddh Electron Application

> Desktop accounting and bookkeeping software built with Angular 21 and Electron

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build electron application
ng build electron-giddh --configuration=local

# Package electron app
npm run build.electron.giddh.test
```

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Packaging](#packaging)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Distribution](#distribution)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Angular CLI**: v21.0.0 or higher
- **Electron**: v11.2.3 or compatible

```bash
# Check versions
node --version
npm --version
ng version
npx electron --version
```

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Giddh-New-Angular4-App

# Install dependencies
npm install

# Install electron dependencies
cd apps/electron-giddh
npm install
cd ../..
```

## 🛠️ Development

### Development Server

```bash
# Start electron development server
ng serve electron-giddh --configuration=local --port 4200

# Build for electron development
ng build electron-giddh --configuration=local
```

### Development Features

- **Hot Reload**: Automatic app restart on file changes
- **DevTools**: Chrome DevTools integration
- **Source Maps**: Full debugging support
- **Live Reload**: Instant updates during development

## 🏗️ Building

### Development Build

```bash
ng build electron-giddh --configuration=local
```

### Production Build

```bash
ng build electron-giddh --configuration=prod
```

### Staging Build

```bash
ng build electron-giddh --configuration=stage
```

### Test Environment Build

```bash
ng build electron-giddh --configuration=test
```

### Build Output

All builds are generated in: `dist/apps/web-giddh/`

## 📦 Packaging

### Development Packaging

```bash
# Build and package for testing
npm run build.electron.giddh.test
```

### Platform-Specific Packaging

```bash
# Windows
npm run build.electron.giddh.win

# macOS
npm run build.electron.giddh.mac

# Linux
npm run build.electron.giddh.linux
```

### Complete Packaging Workflow

```bash
# Build application
ng build electron-giddh --configuration=prod

# Package for distribution
npm run electron:package

# Create installers
npm run electron:dist
```

## 🌍 Environment Configuration

### Environment Files

| Environment | Configuration | API URL | Description |
|-------------|---------------|---------|-------------|
| **Local** | `local` | `https://apitest.giddh.com/` | Development |
| **Test** | `test` | `https://apitest.giddh.com/` | Testing |
| **Stage** | `stage` | `https://apirelease.giddh.com/` | Staging |
| **Production** | `prod` | `https://api.giddh.com/` | Production |

### Electron-Specific Configuration

```typescript
// main.electron.ts configuration
const isDevelopment = process.env.NODE_ENV !== 'production';
const isElectron = true;

// Window configuration
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### Environment Variables

Create `.env.electron` file:

```bash
# .env.electron
APP_URL=file://
API_URL=https://apitest.giddh.com/
UK_API_URL=https://gbapi.giddh.com/
PORTAL_URL=https://master.d2n1i21e52r793.amplifyapp.com/
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OTP_WIDGET_ID=your-otp-widget-id
OTP_TOKEN_AUTH=your-otp-token
RAZORPAY_KEY=your-razorpay-key
ELECTRON_IS_DEV=true
```

## 📜 Available Scripts

### Development Scripts

```bash
ng serve electron-giddh --configuration=local    # Development server
ng build electron-giddh --configuration=local    # Development build
npm run electron:dev                              # Start electron in dev mode
```

### Build Scripts

```bash
ng build electron-giddh --configuration=prod     # Production build
ng build electron-giddh --configuration=stage    # Staging build
ng build electron-giddh --configuration=test     # Test build
```

### Packaging Scripts

```bash
npm run build.electron.giddh.test               # Test packaging
npm run build.electron.giddh.win                # Windows packaging
npm run build.electron.giddh.mac                # macOS packaging
npm run build.electron.giddh.linux              # Linux packaging
npm run electron:package                        # Package app
npm run electron:dist                           # Create distributables
```

### Utility Scripts

```bash
npm run electron:clean                          # Clean build artifacts
npm run electron:rebuild                        # Rebuild native modules
npm run electron:sign                          # Code signing
```

## 📁 Project Structure

```
apps/
├── electron-giddh/
│   ├── src/
│   │   ├── main.ts                    # Electron main process
│   │   ├── preload.js                 # Preload script
│   │   └── WindowManager.js           # Window management
│   └── package.json                   # Electron dependencies
├── web-giddh/
│   ├── src/
│   │   ├── index.electron.html        # Electron index
│   │   ├── main.electron.ts           # Angular bootstrap
│   │   └── tsconfig.electron.json     # Electron TypeScript config
│   └── ...
└── ...
```

## 🚀 Distribution

### Code Signing

#### Windows Code Signing

```bash
# Configure in electron-builder
"win": {
  "certificateFile": "path/to/certificate.p12",
  "certificatePassword": "password",
  "publisherName": "Your Company Name"
}
```

#### macOS Code Signing

```bash
# Configure in electron-builder
"mac": {
  "identity": "Developer ID Application: Your Name",
  "hardenedRuntime": true,
  "entitlements": "build/entitlements.mac.plist"
}
```

### Auto-Updater

```typescript
// Configure auto-updater
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();
```

### Distribution Channels

- **Direct Download**: Host installers on your server
- **App Stores**: Submit to Microsoft Store, Mac App Store
- **Package Managers**: Chocolatey (Windows), Homebrew (macOS)

## 🔧 Configuration

### Electron Builder Configuration

```json
{
  "build": {
    "appId": "com.giddh.desktop",
    "productName": "Giddh",
    "directories": {
      "output": "dist/electron"
    },
    "files": [
      "dist/apps/web-giddh/**/*",
      "apps/electron-giddh/src/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icons/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icons/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icons/icon.png"
    }
  }
}
```

### Security Configuration

```typescript
// Secure defaults
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  enableRemoteModule: false,
  preload: path.join(__dirname, 'preload.js')
}
```

## 🐛 Troubleshooting

### Common Issues

#### Native Module Compilation

```bash
# Rebuild native modules for electron
npm run electron:rebuild

# Or manually
npx electron-rebuild
```

#### Permission Issues (macOS)

```bash
# Remove quarantine attribute
xattr -cr /Applications/Giddh.app
```

#### Windows Defender Issues

```bash
# Add exclusion for development folder
# Windows Security > Virus & threat protection > Exclusions
```

### Performance Optimization

#### Memory Management

```typescript
// Optimize memory usage
app.commandLine.appendSwitch('--max_old_space_size', '4096');
app.commandLine.appendSwitch('--js-flags', '--max-old-space-size=4096');
```

#### Startup Optimization

```typescript
// Preload critical resources
app.whenReady().then(() => {
  // Initialize app
});
```

## 🔐 Security

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### Secure Communication

```typescript
// Use contextBridge for secure IPC
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data)
});
```

## 📊 Platform Support

| Platform | Version | Architecture |
|----------|---------|--------------|
| Windows | 10+ | x64, arm64 |
| macOS | 10.14+ | x64, arm64 |
| Linux | Ubuntu 18.04+ | x64, arm64 |

## 🔄 Updates

### Auto-Update Configuration

```typescript
// Configure update server
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'your-username',
  repo: 'giddh-electron'
});
```

### Manual Updates

```bash
# Check for updates
npm run electron:check-updates

# Download and install updates
npm run electron:update
```

## 📝 Development Workflow

### 1. Setup Development Environment

```bash
npm install
ng build electron-giddh --configuration=local
```

### 2. Start Development

```bash
# Terminal 1: Build and watch
ng build electron-giddh --configuration=local --watch

# Terminal 2: Start electron
npm run electron:dev
```

### 3. Testing

```bash
# Unit tests
npm run test:electron

# E2E tests
npm run e2e:electron
```

### 4. Build and Package

```bash
# Production build
ng build electron-giddh --configuration=prod

# Package for distribution
npm run electron:package
```

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Happy Desktop Development! 🖥️**
