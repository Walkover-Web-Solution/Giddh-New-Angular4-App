# Giddh Web Application

> Modern Angular 21 accounting and bookkeeping software for web browsers

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Access application
http://localhost:3000
```

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Angular CLI**: v21.0.0 or higher

```bash
# Check versions
node --version
npm --version
ng version
```

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Giddh-New-Angular4-App

# Install dependencies
npm install

# Run post-install scripts
npm run postinstall.web
```

## 🛠️ Development

### Start Development Server

```bash
# Start local development server (port 3000)
npm run start

# Alternative development commands
ng serve web-giddh --configuration=local --port 3000
ng serve web-giddh --port 3000
```

### Development Features

- **Hot Reload**: Automatic browser refresh on file changes
- **Source Maps**: Full debugging support
- **Angular DevTools**: Browser extension support
- **Live Reload**: Instant updates during development

## 🏗️ Building

### Development Build
```bash
npm run build
# OR
ng build web-giddh --configuration=local
```

### Production Build
```bash
npm run build-prod
# OR
ng build web-giddh --configuration=prod
```

### Staging Build
```bash
npm run build-stage
# OR
ng build web-giddh --configuration=stage
```

### Test Environment Build
```bash
npm run build-test
# OR
ng build web-giddh --configuration=test
```

### Build Output
All builds are generated in: `dist/apps/web-giddh/`

## 🌍 Environment Configuration

### Environment Files

| Environment | Index File | API URL | Description |
|-------------|------------|---------|-------------|
| **Local** | `index.local.html` | `https://apitest.giddh.com/` | Development |
| **Test** | `index.test.html` | `https://apitest.giddh.com/` | Testing |
| **Stage** | `index.stage.html` | `https://apirelease.giddh.com/` | Staging |
| **Production** | `index.prod.html` | `https://api.giddh.com/` | Production |

### Environment Variables

Create `.env.local`, `.env.test`, `.env.stage`, `.env.prod` files:

```bash
# .env.local (Development)
APP_URL=http://localhost:3000/
API_URL=https://apitest.giddh.com/
UK_API_URL=https://gbapi.giddh.com/
PORTAL_URL=https://master.d2n1i21e52r793.amplifyapp.com/
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OTP_WIDGET_ID=your-otp-widget-id
OTP_TOKEN_AUTH=your-otp-token
RAZORPAY_KEY=your-razorpay-key
```

### Build Environment Configuration

```bash
# Generate environment for specific target
node scripts/build-env.js local
node scripts/build-env.js test
node scripts/build-env.js stage
node scripts/build-env.js prod
```

## 📜 Available Scripts

### Development Scripts
```bash
npm run start              # Start development server
npm run build              # Build for development
npm run test               # Run unit tests
npm run lint               # Lint code
```

### Production Scripts
```bash
npm run build-prod         # Production build
npm run build-stage        # Staging build
npm run build-test         # Test build
npm run build-dev          # Development build
```

### Utility Scripts
```bash
npm run bundle:report      # Analyze bundle size
npm run postinstall.web    # Post-install setup
npm run rm_bak_files       # Clean backup files
```

### Nx Workspace Scripts
```bash
npm run affected:build     # Build affected projects
npm run affected:test      # Test affected projects
npm run affected:lint      # Lint affected projects
npm run format             # Format code
```

## 📁 Project Structure

```
apps/web-giddh/
├── src/
│   ├── app/                    # Application modules
│   ├── assets/                 # Static assets
│   ├── environments/           # Environment configurations
│   ├── index.html             # Default index
│   ├── index.local.html       # Local development
│   ├── index.prod.html        # Production
│   ├── index.stage.html       # Staging
│   ├── index.test.html        # Testing
│   ├── main.ts                # Application bootstrap
│   └── styles.scss            # Global styles
├── tsconfig.app.json          # TypeScript config
└── angular.json               # Angular CLI config
```

## 🚀 Deployment

### Local Deployment
```bash
# Build and serve locally
npm run build-prod
npx http-server dist/apps/web-giddh -p 8080
```

### Production Deployment
```bash
# Build for production
npm run build-prod

# Deploy contents of dist/apps/web-giddh/ to your web server
# Ensure proper routing configuration for SPA
```

### Server Configuration

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/apps/web-giddh;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/dist/apps/web-giddh
    
    <Directory /path/to/dist/apps/web-giddh>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 🔧 Configuration

### Angular Configuration
- **Target**: ES2022 (modern browsers)
- **Bundle Size Limits**: 2MB warning, 10MB error
- **Source Maps**: Enabled in development
- **Optimization**: Enabled in production builds

### Build Optimization
- **Tree Shaking**: Automatic dead code elimination
- **Code Splitting**: Lazy loading modules
- **Compression**: Gzip compression recommended
- **Caching**: Output hashing for cache busting

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
ng serve web-giddh --port 3001
```

#### Memory Issues
```bash
# Increase Node.js memory limit
node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng serve
```

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
ng cache clean
```

### Performance Optimization

#### Bundle Analysis
```bash
npm run bundle:report
```

#### Lazy Loading
Implement lazy loading for feature modules to reduce initial bundle size.

#### Service Workers
Consider implementing service workers for offline functionality.

## 📊 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## 🔐 Security

### Content Security Policy
Implement CSP headers for enhanced security:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### Environment Variables
Never commit sensitive environment variables to version control.

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Happy Coding! 🚀**
