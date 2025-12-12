# Angular Component Management Scripts

Two Node.js scripts to help manage problematic Angular components during Angular 21 migration.

## Scripts Overview

### 1. `comment-components.js` - Comment Out Components
Comments out problematic Angular components that cause compilation errors.

### 2. `restore-components.js` - Restore Components  
Restores original components from backup files or uncomments them.

## Components Handled

- `<input-field>`
- `<select-field>`
- `<reactive-dropdown-field>`
- `<text-field>`
- `<select-multiple-fields>`
- `<cdk-scroll>`

## Usage

### Comment Out Components
```bash
# Comment out all problematic components (creates backups)
node comment-components.js

# Specify custom directory
node comment-components.js ./apps/web-giddh/src
```

### Restore Components

#### Method 1: From Backup Files (Recommended)
```bash
# Restore from backup files
node restore-components.js

# Specify custom directory  
node restore-components.js ./apps/web-giddh/src backup
```

#### Method 2: Uncomment In-Place
```bash
# Uncomment components without using backups
node restore-components.js ./apps/web-giddh/src uncomment
```

#### Cleanup Backup Files
```bash
# Remove all backup files after restoration
node restore-components.js ./apps/web-giddh/src cleanup
```

## How It Works

### Comment Script
1. **Backup Creation**: Creates `.backup-template` files before making changes
2. **Component Detection**: Finds all instances of target components
3. **Smart Commenting**: Handles both self-closing and paired tags
4. **Safe Processing**: Only processes `.html` files, skips backups

### Restore Script  
1. **Backup Restoration**: Copies content from `.backup-template` files
2. **In-Place Uncommenting**: Removes comment markers from components
3. **Cleanup Option**: Removes backup files when no longer needed

## Example Output

### Commenting Components
```
🔧 Angular Component Commenting Script
=====================================
📁 Target directory: ./apps/web-giddh/src
🎯 Components to comment: input-field, select-field, reactive-dropdown-field, text-field, select-multiple-fields, cdk-scroll

📄 Found 45 HTML files to process

🔍 Processing: ./apps/web-giddh/src/app/settings/warehouse/create-warehouse/create-warehouse.component.html
✅ Created backup: ./apps/web-giddh/src/app/settings/warehouse/create-warehouse/create-warehouse.component.html.backup-template
  📝 Commented out <input-field> components
  📝 Commented out <reactive-dropdown-field> components
✅ Updated: ./apps/web-giddh/src/app/settings/warehouse/create-warehouse/create-warehouse.component.html (2 component types commented)
```

### Restoring Components
```
🔧 Angular Component Restoration Script
=======================================
📁 Target directory: ./apps/web-giddh/src
🎯 Mode: backup

📄 Found 45 files with backups to restore

🔍 Processing: ./apps/web-giddh/src/app/settings/warehouse/create-warehouse/create-warehouse.component.html
✅ Restored: ./apps/web-giddh/src/app/settings/warehouse/create-warehouse/create-warehouse.component.html

✨ Component restoration completed!
📊 Successfully processed: 45/45 files
```

## Safety Features

- **Automatic Backups**: Original files are always backed up before changes
- **Non-Destructive**: Original code is preserved in comments
- **Selective Processing**: Only processes HTML files, ignores other file types
- **Error Handling**: Graceful handling of file system errors
- **Dry Run Safe**: Can be run multiple times without issues

## Integration with Angular 21 Migration

These scripts are designed to help during Angular 21 migration when custom components cause compilation errors. Use them to:

1. **Temporarily disable** problematic components to get a clean build
2. **Test compatibility** with Angular 21 without losing original code
3. **Gradually restore** components as you fix their underlying issues
4. **Maintain development velocity** during the migration process

## Notes

- Backup files use `.backup-template` extension
- Comments include "COMPILATION ERROR" marker for easy identification  
- Scripts are safe to run multiple times
- Always test in a development environment first
