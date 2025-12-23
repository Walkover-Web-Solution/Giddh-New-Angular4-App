# Angular Codebase Transformation Scripts

This collection of scripts helps transform your Angular codebase for better compatibility and modern practices, specifically preparing for Angular 21 upgrade.

## 📋 Available Scripts

### 1. `replace-ng-container-app-translate.js`
**Purpose**: Replaces `<ng-container>` tags that have `appTranslate` directive with `<div>` tags.

**What it does**:
- Finds all HTML component files
- Locates `<ng-container>` tags with `appTranslate` directive
- Replaces them with `<div>` tags while preserving all attributes

**Example transformation**:
```html
<!-- Before -->
<ng-container
    appTranslate
    [file]="'create-company'"
    (localeData)="localeData = $event">
    <!-- content -->
</ng-container>

<!-- After -->
<div
    appTranslate
    [file]="'create-company'"
    (localeData)="localeData = $event">
    <!-- content -->
</div>
```

### 2. `add-standalone-false-components.js`
**Purpose**: Adds `standalone: false` to `@Component` decorators where it's missing.

**What it does**:
- Scans all `.component.ts` files
- Finds `@Component` decorators without `standalone` property
- Adds `standalone: false` to maintain current module-based architecture

**Example transformation**:
```typescript
// Before
@Component({
    selector: 'billing-details',
    templateUrl: 'billing-details.component.html',
    styleUrls: ['billing-details.component.scss']
})

// After
@Component({
    selector: 'billing-details',
    templateUrl: 'billing-details.component.html',
    styleUrls: ['billing-details.component.scss'],
    standalone: false
})
```

### 3. `add-provided-in-root-injectables.js`
**Purpose**: Adds `providedIn: 'root'` to `@Injectable` decorators where it's missing.

**What it does**:
- Scans services, directives, and pipes
- Finds `@Injectable` decorators without `providedIn` property
- Adds `providedIn: 'root'` for proper dependency injection

**Example transformation**:
```typescript
// Before
@Injectable()
export class EmailForwardingService {

// After
@Injectable({
    providedIn: 'root'
})
export class EmailForwardingService {
```

### 4. `enable-commented-modules.js`
**Purpose**: Enables commented/disabled modules in routing files if the modules exist.

**What it does**:
- Checks `app.routes.ts` and `routes-array.ts`
- Finds commented-out route configurations
- Verifies if the referenced modules exist
- Enables routes only if modules are available

**Example transformation**:
```typescript
// Before
// { path: 'settings', loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule) }

// After (if module exists)
{ path: 'settings', loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule) }
```

### 5. `angular-21-compatibility-checker.js`
**Purpose**: Comprehensive Angular 21 compatibility analysis.

**What it checks**:
- Deprecated APIs and imports
- Component decorator issues
- Form control patterns
- RxJS usage patterns
- Angular Material compatibility
- Package.json dependencies
- TypeScript configuration

## 🚀 Usage

### Option 1: Run All Scripts (Recommended)
```bash
# Make the master script executable
chmod +x run-all-angular-fixes.js

# Run all transformations
node run-all-angular-fixes.js
```

### Option 2: Run Individual Scripts
```bash
# Make scripts executable
chmod +x *.js

# Run specific scripts
node replace-ng-container-app-translate.js
node add-standalone-false-components.js
node add-provided-in-root-injectables.js
node enable-commented-modules.js
node angular-21-compatibility-checker.js
```

## 📁 Directory Structure
Ensure you run these scripts from your Angular project root directory (where `angular.json` is located):

```
your-angular-project/
├── angular.json
├── package.json
├── apps/
│   └── web-giddh/
│       └── src/
│           └── app/
└── [script files]
```

## ⚠️ Important Notes

### Before Running Scripts
1. **Backup your code**: Commit all changes or create a backup
2. **Verify location**: Run from Angular project root directory
3. **Check dependencies**: Ensure Node.js is installed

### After Running Scripts
1. **Review changes**: Check git diff to see what was modified
2. **Test compilation**: Run `ng build` to ensure no compilation errors
3. **Run tests**: Execute your test suite
4. **Manual review**: Some changes may need manual verification

## 🔍 What Each Script Reports

### Success Indicators
- ✅ Files successfully processed
- 📊 Summary statistics (files processed, changes made)
- 💡 Suggestions for further improvements

### Warning Indicators
- ⚠️ Files skipped (missing modules, etc.)
- 🔍 Items that need manual review
- 📋 Recommendations for next steps

## 🛠️ Troubleshooting

### Common Issues

1. **"angular.json not found"**
   - Solution: Run scripts from Angular project root directory

2. **"Permission denied"**
   - Solution: Make scripts executable with `chmod +x *.js`

3. **"Module not found"**
   - Solution: Ensure Node.js is installed and you're in the correct directory

4. **Scripts skip files**
   - This is normal - scripts only modify files that need changes

### Getting Help
If you encounter issues:
1. Check the console output for specific error messages
2. Verify file permissions and directory structure
3. Ensure all prerequisites are met

## 📈 Expected Results

After running all scripts successfully:
- HTML templates use `<div>` instead of `<ng-container>` with `appTranslate`
- All components have explicit `standalone: false` (or migrate to standalone)
- All injectables have proper `providedIn` configuration
- Available modules are enabled in routing
- Compatibility report shows readiness for Angular 21

## 🎯 Next Steps After Running Scripts

1. **Review the compatibility report** for any critical issues
2. **Address warnings and suggestions** from the compatibility checker
3. **Test your application** thoroughly
4. **Run Angular update** when ready: `ng update @angular/core @angular/cli`
5. **Update dependencies** as needed for Angular 21 compatibility

## 📝 Script Logs

Each script provides detailed logging:
- Files processed count
- Changes made
- Items skipped with reasons
- Summary statistics
- Recommendations

Save the output if you need to reference it later:
```bash
node run-all-angular-fixes.js > transformation-log.txt 2>&1
```
