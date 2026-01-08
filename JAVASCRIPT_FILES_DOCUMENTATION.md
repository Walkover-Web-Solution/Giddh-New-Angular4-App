# JavaScript Files Documentation - Actively Used Files

This document provides a comprehensive overview of all JavaScript files that are actively used in the Giddh application and should be maintained.

## 📁 **Electron Application Files**
*Location: `apps/electron-giddh/src/`*

### Core Electron Files

| File | Purpose | Usage |
|------|---------|-------|
| `index.js` | Main Electron entry point | Application bootstrap and main process initialization |
| `WindowManager.js` | Window management system | Creates and manages application windows, handles window events |
| `AppMenuManager.js` | Application menu system | Defines and manages native application menus |
| `StateManager.js` | Application state management | Handles application state persistence and restoration |
| `AppUpdater.js` | Auto-updater functionality | Manages automatic application updates |
| `preload.js` | Secure IPC bridge | Provides secure communication between main and renderer processes |
| `util.js` | Utility functions | Common utility functions for Electron processes |
| `electronEventSignals.js` | Event handling system | Manages custom event signals between processes |
| `main-auth.config.js` | Authentication configuration | OAuth and authentication settings for Electron |

**Total Files:** 9  
**Critical Level:** High - Required for Electron app functionality

---

## 🛠️ **Build & Development Scripts**
*Location: `scripts/`*

### Build Pipeline Scripts

| File | Purpose | npm Script Usage |
|------|---------|------------------|
| `build-env.js` | Environment file generation | Used in all build commands (`build`, `build-prod`, `build-stage`, `build-test`) |
| `build-electron-env.js` | Electron environment setup | `electron:auto`, `electron:auto:dry-run` |
| `build-success-message.js` | Build completion notifications | `package:linux`, `package:mac`, `package:windows` |
| `clean-old-builds.js` | Build artifact cleanup | `package:windows`, `package:windows:test` |
| `detect-branch-env.js` | Git branch detection | `electron:detect-branch` |
| `fix-electron-build.js` | Electron build post-processing | `electron:fix` |
| `inject-env-vars.js` | Runtime environment injection | All build processes for HTML file processing |

### Tool Scripts

| File | Purpose | Usage |
|------|---------|-------|
| `tools/electron/postinstall.js` | Electron post-installation setup | `postinstall.electron` npm script |
| `tools/web/postbuild.js` | Web build post-processing | Production build pipeline |

**Total Files:** 9  
**Critical Level:** High - Required for build process

---

## 🎨 **Essential Asset Files**
*Location: `apps/web-giddh/src/assets/js/`*

### Core JavaScript Libraries

| File | Size | Loading Method | Usage |
|------|------|----------------|-------|
| `lodash.min.js` | 73KB | Static (`<script>` in all HTML files) | Utility functions, loaded in all environments |
| `jquery.min.js` | 89KB | Static (`<script>` in all HTML files) | DOM manipulation, loaded in all environments |
| `codemirror.min.js` | 151KB | Dynamic (app.component.ts) | Code editor functionality |
| `xml.min.js` | 5KB | Dynamic (app.component.ts) | XML processing utilities |
| `headway-widget.js` | 27KB | Dynamic (header.component.ts) | User notification widget |
| `electron-init.js` | 15KB | Static (Electron HTML files) | Electron-specific initialization |

**Total Files:** 6  
**Total Size:** 360KB  
**Critical Level:** High - Core application functionality

### Asset Loading Patterns

```typescript
// Dynamic Loading Example (app.component.ts)
if (window['CodeMirror'] === undefined) {
    let codeMirrorScriptTag = document.createElement('script');
    codeMirrorScriptTag.src = './assets/js/codemirror.min.js';
    codeMirrorScriptTag.type = 'text/javascript';
    codeMirrorScriptTag.defer = true;
    document.body.appendChild(codeMirrorScriptTag);
}
```

```html
<!-- Static Loading Example (index.html) -->
<script defer src="./assets/js/lodash.min.js"></script>
<script defer src="./assets/js/jquery.min.js"></script>
```

---

## 🔗 **Magic Link Assets**
*Location: `apps/web-giddh/src/assets/magic-link-assets/`*

### Magic Link JavaScript Files

| File | Size | Purpose | Loading Order |
|------|------|---------|---------------|
| `moment.min.js` | - | Date/time manipulation | 1st - Base dependency |
| `daterangepicker.min.js` | - | Date range picker component | 2nd - Depends on moment |
| `vue.min.js` | - | Vue.js framework | 3rd - UI framework |
| `popper.min.js` | - | Tooltip positioning | 4th - UI utilities |
| `bootstrap.min.js` | - | Bootstrap framework | 5th - UI components |
| `FileSaver.min.js` | - | File download functionality | 6th - Utility |
| `v-toaster.js` | - | Toast notifications | 7th - UI feedback |
| `axios.min.js` | - | HTTP client | 8th - API communication |
**Total Files:** 8  
**Critical Level:** Low - General utility files only

### Loading Sequence (legacy reference - file removed)

```javascript
// Sequential loading with dependencies
moment.onload = function () {
    // Load daterangepicker after moment
    var daterangepicker = document.createElement('script');
    daterangepicker.src = '../' + folderPath + 'assets/magic-link-assets/daterangepicker.min.js';
    
    vue.onload = function () {
        // Load remaining scripts after Vue
        // ... bootstrap, FileSaver, v-toaster, axios
    }
}
```

---

## ⚙️ **Configuration Files**

### Build Configuration

| File | Purpose | Usage Context |
|------|---------|---------------|
| `electron-sign/notarize.js` | macOS app notarization | Electron build process (`afterSign` hook) |
| `apps/web-giddh/hook.js` | Build hooks | Custom build pipeline integration |

### Service Worker

| File | Purpose | Size | Status |
|------|---------|------|--------|
| `apps/web-giddh/src/assets/service-worker.js` | PWA service worker | 44 bytes | Minimal but functional |

**Total Files:** 3  
**Critical Level:** Medium - Build and PWA functionality

---

## 📋 **File Usage Summary**

### By Category
- **Electron Core:** 9 files (High Priority)
- **Build Scripts:** 9 files (High Priority)
- **Asset Libraries:** 6 files, 360KB (High Priority)
- **Magic Link:** 9 files (Medium Priority)
- **Configuration:** 3 files (Medium Priority)

### By Loading Method
- **Static Loading:** 2 files (lodash, jquery)
- **Dynamic Loading:** 4 files (codemirror, xml, headway-widget, electron-init)
- **Sequential Loading:** 9 files (magic link assets)
- **Build Process:** 12 files (scripts + config)

### By Environment
- **All Environments:** lodash.min.js, jquery.min.js
- **Web Only:** magic-link-assets/*
- **Electron Only:** electron-init.js, apps/electron-giddh/src/*
- **Build Only:** scripts/*, tools/*

---

## 🔧 **Maintenance Guidelines**

### Critical Files (Never Remove)
- All Electron application files
- Core asset files (lodash, jquery)
- Build scripts referenced in package.json

### Environment-Specific Files
- Magic link assets: Only needed if magic link functionality is used
- Electron files: Only needed for desktop application
- Build scripts: Required for deployment pipeline

### Update Considerations
- **lodash.min.js & jquery.min.js:** Keep versions compatible with application code
- **Magic link assets:** Update as a complete set to maintain compatibility
- **Build scripts:** Test thoroughly after any modifications

### Performance Notes
- Total JavaScript assets: ~360KB (excluding magic link and node_modules)
- All files use deferred loading where possible
- Dynamic loading prevents blocking application startup

---

## 📝 **Notes**

1. **Angular Integration:** Most functionality is handled by Angular framework and npm packages
2. **Legacy Support:** Some files maintain compatibility with older browser environments
3. **Security:** Electron preload.js provides secure IPC communication
4. **Build Process:** All build scripts are actively used in CI/CD pipeline

This documentation should be updated when:
- New JavaScript files are added
- Build process changes
- Electron configuration is modified
- Magic link functionality is updated
