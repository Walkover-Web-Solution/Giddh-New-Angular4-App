# Angular Migration Scripts

This repository contains two utility scripts for Angular project migrations:

## 1. ng-container-to-div.js

Converts all `ng-container` tags to `div` tags with proper start/end format.

### Usage
```bash
# Process default directory (./apps/web-giddh/src)
node ng-container-to-div.js

# Process custom directory
node ng-container-to-div.js ./path/to/your/directory
```

### What it does
- Converts `<ng-container>` to `<div>`
- Converts `</ng-container>` to `</div>`
- Handles self-closing tags: `<ng-container />` → `<div></div>`
- Preserves all attributes and content
- Processes `.html` and `.component.ts` files

### Example transformations
```html
<!-- Before -->
<ng-container *ngIf="condition">Content</ng-container>
<ng-container *ngFor="let item of items" />

<!-- After -->
<div *ngIf="condition">Content</div>
<div *ngFor="let item of items"></div>
```

## 2. add-standalone-false.js

Adds `standalone: false` to Angular components, pipes, and directives that don't have the standalone property.

### Usage
```bash
# Process default directory (./apps/web-giddh/src)
node add-standalone-false.js

# Process custom directory
node add-standalone-false.js ./path/to/your/directory
```

### What it does
- Adds `standalone: false` to `@Component`, `@Pipe`, and `@Directive` decorators
- Skips decorators that already have `standalone: true` or `standalone: false`
- Intelligently places the property after `selector`, `templateUrl`, `template`, or `name`
- Maintains proper indentation and formatting
- Processes all `.ts` files recursively

### Example transformations
```typescript
// Before
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})

// After
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  standalone: false
})
```

## Safety Features

Both scripts:
- ✅ Create backups by preserving original formatting
- ✅ Skip `node_modules`, `dist`, and build directories
- ✅ Provide detailed processing summaries
- ✅ Handle errors gracefully without stopping
- ✅ Show exactly what files were modified

## Requirements

- Node.js (any recent version)
- No additional dependencies required

## Output

Both scripts provide detailed output showing:
- Files processed
- Files modified
- Total changes made
- Summary of operations

Run the scripts from your project root directory for best results.
