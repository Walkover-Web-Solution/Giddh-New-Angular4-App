# Angular 21 Standalone Compatibility Script

This script automatically adds `standalone: false` to Angular components, pipes, and directives that don't already have a standalone property, ensuring compatibility with Angular 21's hybrid architecture.

## Features

✅ **Preserves existing `standalone: true`** - Won't modify components that are already standalone  
✅ **Avoids duplicates** - Won't add `standalone: false` if it already exists  
✅ **Supports hybrid architecture** - Allows both NgModule and standalone components  
✅ **Safe processing** - Creates backups and handles errors gracefully  
✅ **Recursive processing** - Processes all TypeScript files in subdirectories  

## Usage

### Basic Usage
```bash
# Run on default directory (./apps/web-giddh/src)
node add-standalone-false.js

# Run on specific directory
node add-standalone-false.js ./path/to/your/src
```

### Make Script Executable (Optional)
```bash
chmod +x add-standalone-false.js
./add-standalone-false.js
```

## What It Does

### Before Processing
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent { }
```

### After Processing
```typescript
@Component({
  selector: 'app-example',
  standalone: false,
  templateUrl: './example.component.html'
})
export class ExampleComponent { }
```

### Preserves Existing Standalone
```typescript
// This will NOT be modified
@Component({
  selector: 'app-standalone',
  standalone: true,
  templateUrl: './standalone.component.html'
})
export class StandaloneComponent { }
```

## Supported Decorators

- `@Component`
- `@Pipe`
- `@Directive`

## Output Example

```
🚀 Starting Angular 21 Standalone Compatibility Script
📁 Processing directory: ./apps/web-giddh/src

✅ Modified: apps/web-giddh/src/app/components/example.component.ts
  📝 Adding standalone: false to Component
✅ Modified: apps/web-giddh/src/app/pipes/custom.pipe.ts
  📝 Adding standalone: false to Pipe

📊 Processing Summary:
==================================================
📁 Total files processed: 1247
✅ Files modified: 156
⏭️  Files skipped: 1091
❌ Errors: 0

🎉 Angular 21 Standalone Compatibility Complete!
✨ Your application now supports both NgModule and Standalone architectures
```

## Safety Features

- **Non-destructive**: Only adds properties, never removes existing code
- **Error handling**: Continues processing even if individual files fail
- **Detailed logging**: Shows exactly what changes were made
- **Backup recommended**: Always commit your changes to version control first

## Best Practices

1. **Commit first**: Always commit your current changes before running the script
2. **Review changes**: Use `git diff` to review all modifications
3. **Test thoroughly**: Run your build and tests after processing
4. **Gradual migration**: Consider processing smaller directories first

## Troubleshooting

### Script doesn't find files
- Ensure you're in the correct directory
- Check that TypeScript files exist in the target path

### Build errors after processing
- Review the git diff to see what changed
- Ensure all modified components are properly declared in their modules
- Check for any syntax errors in the modified decorators

### Performance with large codebases
- The script processes files sequentially for safety
- For very large codebases (5000+ files), consider processing subdirectories individually

## Angular 21 Compatibility

This script ensures your codebase is ready for Angular 21's hybrid architecture:

- **NgModule components**: `standalone: false` (traditional approach)
- **Standalone components**: `standalone: true` (modern approach)
- **Mixed architecture**: Both can coexist in the same application

Perfect for gradual migration strategies and maintaining backward compatibility.
