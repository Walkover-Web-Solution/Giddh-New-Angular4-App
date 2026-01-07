# Giddh Angular Application - Architecture & Build System

## 📋 Table of Contents

- [Overview](#overview)
- [Project Architecture](#project-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Build System](#build-system)
- [Environment Management](#environment-management)
- [Development Workflow](#development-workflow)
- [Scripts Reference](#scripts-reference)
- [Deployment](#deployment)
- [Performance Considerations](#performance-considerations)

## 🎯 Overview

Giddh is a modern Angular 21 enterprise application built with a sophisticated monorepo architecture using Nx workspace. The application supports both web and Electron platforms with a robust build system and comprehensive environment management.

### Key Features
- **Angular 21** with latest features and optimizations
- **Multi-platform support** (Web + Electron)
- **Secure environment management** with build-time generation
- **Material Design 3** with custom theming
- **Enterprise-grade** security and performance
- **Automated CI/CD** with AWS CodeBuild integration

## 🏗️ Project Architecture

### Monorepo Structure
The project follows Nx workspace conventions with clear separation of concerns:

```
giddh-workspaces/
├── apps/                    # Application projects
│   ├── web-giddh/          # Main Angular web application
│   └── electron-giddh/     # Electron-specific code
├── libs/                    # Shared libraries
│   ├── core/               # Core functionality
│   ├── features/           # Feature modules
│   ├── scss/               # Shared styles
│   └── utils/              # Utility functions
├── xplat/                   # Cross-platform code
│   ├── web/                # Web-specific shared code
│   └── electron/           # Electron-specific shared code
├── scripts/                 # Build automation scripts
├── tools/                   # Build tools and utilities
└── testing/                # Test configurations
```

### Application Architecture
- **Component-based architecture** with Angular best practices
- **State management** using NgRx for complex state
- **Service layer** for business logic and API communication
- **Modular design** with lazy-loaded feature modules
- **Reactive programming** with RxJS observables

## 🛠️ Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.0.4 | Frontend framework |
| Angular Material | 20.2.14 | UI component library |
| TypeScript | 5.9.0 | Type-safe JavaScript |
| NgRx | 21.0.0-beta.0 | State management |
| RxJS | 7.8.1 | Reactive programming |

### Build Tools
| Tool | Version | Purpose |
|------|---------|---------|
| Nx | Latest | Monorepo management |
| Webpack | 5.94.0 | Module bundling |
| ESBuild | Latest | Fast bundling |
| Jest | Latest | Testing framework |

### Development Tools
- **Husky** for Git hooks
- **TSLint** for code quality
- **Prettier** for code formatting
- **Angular CLI** for development server

## 📁 Project Structure

### Main Application (`apps/web-giddh/src/`)
```
src/
├── app/                     # Application modules
│   ├── accounting/         # Accounting features
│   ├── contact/            # Contact management
│   ├── inventory/          # Inventory management
│   ├── vouchers/           # Voucher management
│   ├── services/           # Business services
│   ├── shared/             # Shared components
│   └── theme/              # UI theme components
├── assets/                  # Static assets
├── environments/           # Environment configurations
└── main.ts                 # Application bootstrap
```

### Key Directories
- **`services/`** - Business logic and API services
- **`shared/`** - Reusable components and utilities
- **`theme/`** - Custom UI components and Material theme
- **`models/`** - TypeScript interfaces and data models

## 🔧 Build System

### Environment-Driven Build Process

The build system uses a sophisticated environment management approach:

1. **Environment Detection** - Automatically detects target environment
2. **Dynamic Configuration** - Generates TypeScript environment files
3. **Security-First** - No sensitive data in client bundles
4. **Multi-Platform** - Supports web and Electron builds

### Build Configurations

| Environment | Purpose | Optimization | Source Maps |
|-------------|---------|--------------|-------------|
| `local` | Development | Minimal | Yes |
| `stage` | Staging | Partial | No |
| `test` | Testing | Partial | No |
| `prod` | Production | Full | No |

### Bundle Management
- **Vendor chunking** for optimal caching
- **Code splitting** with lazy loading
- **Bundle budgets** to prevent size bloat
- **Tree shaking** for unused code elimination

## 🌍 Environment Management

### Environment Files Structure
```
Root Directory/
├── .env.local              # Local development
├── .env.stage              # Staging environment
├── .env.prod               # Production environment
├── .env.test               # Testing environment
└── .env.electron           # Electron-specific
```

### Environment Variables
Key environment variables managed by the system:

```bash
# Application URLs
APP_URL=https://books.giddh.com
API_URL=https://api.giddh.com/
UK_API_URL=https://gbapi.giddh.com/

# External Service Keys
GOOGLE_CLIENT_ID=your_google_client_id
RAZORPAY_KEY=your_razorpay_key
OTP_WIDGET_ID=your_otp_widget_id

# Feature Flags
ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY=true
```

### Security Features
- **Production Safety** - `.env` files not loaded in production
- **Server Variables** - Sensitive data from server environment
- **Build-time Injection** - Variables baked into build, not runtime
- **Type Safety** - Generated TypeScript interfaces

## 🚀 Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run start

# Start with specific environment
npm run start:local
```

### Development Commands
```bash
# Development server (port 3000)
npm run start

# Build for development
npm run build-dev

# Build for production
npm run build-prod

# Run tests
npm test

# Lint code
npm run lint
```

### Electron Development
```bash
# Auto-detect environment and build
npm run electron:auto

# Force specific environment
npm run electron:force-prod

# Build Electron app
npm run build:electron

# Package for distribution
npm run package:windows
npm run package:mac
npm run package:linux
```

## 📜 Scripts Reference

### Core Build Scripts
| Script | Purpose | Usage |
|--------|---------|-------|
| `build-env.js` | Environment file generation | Auto-called during builds |
| `inject-env-vars.js` | Runtime variable injection | Auto-called during builds |
| `build-electron-env.js` | Electron environment setup | Electron builds |
| `detect-branch-env.js` | Git branch detection | Auto environment selection |

### Utility Scripts
| Script | Purpose | When to Use |
|--------|---------|-------------|
| `clean-old-builds.js` | Clean previous builds | Before packaging |
| `fix-electron-build.js` | Electron compatibility fixes | Electron builds |
| `build-success-message.js` | Build completion feedback | Post-build |

### AWS Integration Scripts
| Script | Purpose | Environment |
|--------|---------|-------------|
| `aws-codepipeline-config.js` | AWS CodePipeline setup | CI/CD |
| `.codebuild-memory-config.js` | Memory optimization | AWS CodeBuild |

## 🚀 Deployment

### Web Application Deployment
```bash
# Production build
npm run build-prod

# Staging build
npm run build-stage

# Test environment build
npm run build-test
```

### Electron Application Packaging
```bash
# Windows
npm run package:windows

# macOS
npm run package:mac

# Linux
npm run package:linux
```

### CI/CD Pipeline
The application integrates with AWS CodeBuild for automated deployment:

1. **Code Push** triggers build pipeline
2. **Environment Detection** selects appropriate configuration
3. **Build Optimization** applies environment-specific settings
4. **Deployment** to target environment

## ⚡ Performance Considerations

### Bundle Optimization
- **Initial bundle**: 15-20MB (with vendor chunking)
- **Vendor chunk**: 7-10MB (cached separately)
- **Lazy loading**: Feature modules loaded on demand
- **Tree shaking**: Unused code eliminated

### Build Performance
- **Development**: Fast rebuilds with source maps
- **Production**: Optimized builds with minification
- **Memory management**: AWS-optimized for large builds
- **Parallel processing**: Multi-core build utilization

### Runtime Performance
- **Change detection**: OnPush strategy where applicable
- **Observables**: Proper subscription management
- **Caching**: Service worker ready
- **Bundle splitting**: Optimal loading strategies

## 🔍 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules/.cache
npm run clean
npm install
```

**Environment Issues**
```bash
# Verify environment file exists
ls -la .env.*

# Check environment generation
node scripts/build-env.js local
```

**Electron Build Issues**
```bash
# Fix Electron compatibility
npm run electron:fix

# Clean and rebuild
npm run clean
npm run build:electron
```

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
DEBUG=true
```

## 📚 Additional Resources

- [Angular 21 Documentation](https://angular.io/docs)
- [Nx Workspace Guide](https://nx.dev/getting-started)
- [Angular Material Documentation](https://material.angular.io/)
- [NgRx Documentation](https://ngrx.io/docs)

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use the provided scripts for environment management
3. Ensure all builds pass before committing
4. Follow TypeScript best practices
5. Update documentation for architectural changes

---

**Last Updated**: January 2026  
**Angular Version**: 21.0.4  
**Architecture Version**: 2.0
