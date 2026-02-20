# Giddh Date Pipe

A standalone pipe for parsing and formatting dates in the Giddh application.

## Features

- Parses DD-MM-YYYY string format to Date objects
- Formats dates using GIDDH_DATE_UI_FORMAT by default
- **Smart year display**: Automatically hides year for current year dates
- Can be used in both HTML templates and TypeScript code
- Standalone pipe - no module imports required
- Handles invalid dates gracefully
- Configurable year display behavior

## Usage in HTML Templates

### Basic Usage (uses default GIDDH_DATE_UI_FORMAT, hides current year)
```html
<span>{{ dateString | giddhDate }}</span>
```

### With Custom Format
```html
<span>{{ dateString | giddhDate: 'dd/MM/yyyy' }}</span>
<span>{{ dateString | giddhDate: 'MMM dd, yyyy' }}</span>
```

### Control Year Display
```html
<!-- Hide year if current year (default behavior) -->
<span>{{ dateString | giddhDate }}</span>
<span>{{ dateString | giddhDate: undefined : true }}</span>

<!-- Always show year -->
<span>{{ dateString | giddhDate: undefined : false }}</span>

<!-- Custom format with year control -->
<span>{{ dateString | giddhDate: 'MMM dd, yyyy' : false }}</span>
```

### Example
```html
<!-- Input: "17-02-2026" (assuming current year is 2026) -->
<span>{{ item.date | giddhDate }}</span>
<!-- Output: "Feb 17" (year hidden because it's current year) -->

<!-- Input: "17-02-2025" (assuming current year is 2026) -->
<span>{{ item.date | giddhDate }}</span>
<!-- Output: "Feb 17, 2025" (year shown because it's not current year) -->

<!-- Force show year even for current year -->
<span>{{ item.date | giddhDate: undefined : false }}</span>
<!-- Output: "Feb 17, 2026" (year always shown) -->
```

## Usage in TypeScript

### Import the Pipe
```typescript
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';
```

### Add to Component Imports (for standalone components)
```typescript
@Component({
    selector: 'app-example',
    imports: [
        CommonModule,
        GiddhDatePipe  // Add here
    ]
})
```

### Parse Date String
```typescript
// Static method to parse DD-MM-YYYY to Date object
const dateObject = GiddhDatePipe.parseDate('17-02-2026');
// Returns: Date object
```

### Format Date
```typescript
// Static method to format date string (hides current year by default)
const formatted = GiddhDatePipe.formatDate('17-02-2026');
// Returns: "Feb 17" (if 2026 is current year)
// Returns: "Feb 17, 2026" (if 2026 is not current year)

// With custom format
const customFormatted = GiddhDatePipe.formatDate('17-02-2026', 'dd/MM/yyyy');
// Returns: "17/02" (if 2026 is current year)
// Returns: "17/02/2026" (if 2026 is not current year)

// Always show year
const withYear = GiddhDatePipe.formatDate('17-02-2026', undefined, false);
// Returns: "Feb 17, 2026" (year always shown)
```

### Use Pipe Instance
```typescript
const pipe = new GiddhDatePipe();
const result = pipe.transform('17-02-2026');
```

## Supported Input Formats

- **String**: DD-MM-YYYY format (e.g., "17-02-2026")
- **Date**: JavaScript Date object
- **null/undefined**: Returns null

## Output

- Returns formatted date string based on specified format
- Returns null for invalid dates
- Default format is GIDDH_DATE_UI_FORMAT

## Examples

### Template Examples
```html
<!-- Basic usage -->
{{ '17-02-2026' | giddhDate }}

<!-- Custom format -->
{{ '17-02-2026' | giddhDate: 'dd/MM/yyyy' }}
{{ '17-02-2026' | giddhDate: 'MMM dd, yyyy' }}
{{ '17-02-2026' | giddhDate: 'EEEE, MMMM d, y' }}

<!-- With variable -->
{{ item.date | giddhDate }}

<!-- In ngFor -->
@for (item of items; track item.id) {
    <span>{{ item.date | giddhDate }}</span>
}
```

### TypeScript Examples
```typescript
// Parse date string to Date object
const date = GiddhDatePipe.parseDate('17-02-2026');
if (date) {
    console.log(date.getFullYear()); // 2026
}

// Format date string
const formatted = GiddhDatePipe.formatDate('17-02-2026');
console.log(formatted); // "Feb 17, 2026"

// Format with custom format
const custom = GiddhDatePipe.formatDate('17-02-2026', 'yyyy-MM-dd');
console.log(custom); // "2026-02-17"

// Use in component logic
export class MyComponent {
    processDate(dateString: string) {
        const formatted = GiddhDatePipe.formatDate(dateString);
        return formatted;
    }
}
```

## Error Handling

The pipe handles errors gracefully:
- Returns `null` for invalid date strings
- Returns `null` for null/undefined input
- Returns `null` for malformed date strings

```typescript
GiddhDatePipe.formatDate('invalid-date'); // Returns: null
GiddhDatePipe.formatDate(null); // Returns: null
GiddhDatePipe.parseDate('32-13-2026'); // Returns: null (invalid date)
```

## Migration from Old Code

### Before
```typescript
// Component
public parseDateString(dateString: string): Date | null {
    const [day, month, year] = dateString.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
}

// Template
{{ parseDateString(item.date) | date: dateUiFormat }}
```

### After
```typescript
// Component - no method needed, just import pipe
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';

@Component({
    imports: [GiddhDatePipe]
})

// Template
{{ item.date | giddhDate }}
```

## Benefits

1. **Reusable**: Single implementation used across entire project
2. **Consistent**: All dates formatted the same way
3. **Maintainable**: Changes in one place affect all usages
4. **Type-safe**: TypeScript support with proper types
5. **Flexible**: Works in templates and TypeScript code
6. **Standalone**: No module imports required for Angular 14+
