# Resizable Directive

A reusable Angular directive that adds drag-to-resize functionality to any element with per-page width persistence using localStorage cache with 30-day expiry.

## Usage

### 1. Import the Directive

The directive is standalone and can be imported directly:

```typescript
import { ResizableDirective } from './shared/directives/resizable.directive';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ResizableDirective, ...],
  // ...
})
export class MyComponent { }
```

### 2. Basic Usage

```html
<!-- Simple usage - resizes the first child element -->
<div appResizable [moduleName]="'my-page'" class="container">
  <div class="left-panel">Content to resize</div>
  <div class="right-panel">Fixed content</div>
</div>
```

### 3. Advanced Usage with Configuration

```html
<!-- Custom configuration with per-page width storage -->
<div 
  appResizable
  resizableTarget=".left-panel"
  [minWidth]="300"
  [maxWidthRatio]="0.5"
  [defaultWidthRatio]="0.4"
  [resizerWidth]="8"
  [moduleName]="'contact-preview'"
  class="container">
  
  <div class="left-panel">Resizable content</div>
  <div class="right-panel">Fixed content</div>
</div>
```

## Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `resizableTarget` | string | '' | CSS selector for target element (empty = first child) |
| `minWidth` | number | 250 | Minimum width in pixels |
| `maxWidthRatio` | number | 0.75 | Maximum width as ratio of window width |
| `defaultWidthRatio` | number | 0.4 | Default width as ratio of window width |
| `resizerWidth` | number | 6 | Width of the resizer handle in pixels |
| `moduleName` | string | 'default' | Unique identifier for per-page width storage |

## Per-Page Width Storage

The directive uses `UiSettingsService` to store width preferences per `moduleName` in localStorage with a 30-day cache expiry. The storage structure is managed centrally:

```json
{
  "resizable-width": {
    "contact-preview": {
      "value": 0.35,
      "timestamp": 1706789123456
    },
    "vouchers-preview": {
      "value": 0.45,
      "timestamp": 1706789123456
    },
    "ledger": {
      "value": 0.30,
      "timestamp": 1706789123456
    }
  }
}
```

Each module maintains its own independent width preference with automatic cache expiry after 30 days.

## CSS Requirements

The container should use flexbox:

```css
.container {
  display: flex;
  height: 100vh; /* or desired height */
}

.right-panel {
  flex: 1; /* Takes remaining space */
}
```

## Features

- **Drag to resize**: Smooth dragging with min/max constraints and 3px drag threshold
- **Click to toggle**: Quick reset to default width (no cursor change on simple clicks)
- **Per-page persistence**: Each module remembers its own width with 30-day cache expiry
- **Centralized storage**: Uses `UiSettingsService` for consistent cache management
- **Visual feedback**: Hover effects and cursor changes only during actual dragging
- **Responsive**: Adapts to window size changes while maintaining user preferences
- **Performance optimized**: RequestAnimationFrame for smooth updates, pointer capture for better tracking
- **Configurable**: Customizable through input properties
- **Cache expiry**: Automatic cleanup of expired settings (30 days)

## Behavior Details

### Click vs Drag Detection
- **Simple Click**: No cursor change, triggers toggle functionality
- **Drag (>3px movement)**: Cursor changes to `col-resize`, enables resize mode
- **Fast Drag**: Optimized tracking prevents cursor drift from resizer

### Width Persistence
- Automatically saves width as percentage on drag end via `UiSettingsService`
- Restores saved width on component initialization
- Validates saved width against current window constraints
- Adjusts width on window resize while maintaining user preference
- Cache expires after 30 days and is automatically cleaned up on app initialization

## Example: Contact Preview Component

```html
<div 
  appResizable
  resizableTarget=".preview-list"
  [minWidth]="300"
  [maxWidthRatio]="0.5"
  [defaultWidthRatio]="0.4"
  [moduleName]="'contact-preview'"
  class="invoice-preview-wrapper d-flex full-viewport-height">
  
  <div class="preview-list pb-3">
    <!-- Left panel content -->
  </div>
  
  <div class="preview-content flex-grow-1">
    <!-- Right panel content -->
  </div>
</div>
```

## Example: Ledger Component

```html
<div 
  appResizable
  resizableTarget=".ledger-sidebar"
  [minWidth]="300"
  [maxWidthRatio]="0.5"
  [defaultWidthRatio]="0.4"
  [moduleName]="'ledger'"
  class="ledger-wrapper">
  
  <div class="ledger-sidebar h-100 pb-3">
    <!-- Left panel content -->
  </div>
  
  <div class="ledger-content flex-grow-1">
    <!-- Right panel content -->
  </div>
</div>
```

## Integration with UiSettingsService

The directive integrates with the centralized `UiSettingsService` which manages all UI settings with cache expiry:

```typescript
// The directive automatically uses UiSettingsService
private uiSettingsService = inject(UiSettingsService);

// Storage key is centralized in app.constant.ts
export const UI_SETTINGS_STORAGE_KEY = 'giddh-ui-settings';

// Cache duration for resizable widths is 30 days
export const CACHE_DURATION = {
  RESIZABLE_WIDTH: 30 * 24 * 60 * 60 * 1000 // 30 days
};
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- Uses `requestAnimationFrame` for smooth 60fps updates during dragging
- Implements pointer capture for better cursor tracking
- Debounced window resize handling (150ms)
- Minimal DOM manipulations with Renderer2
- Centralized cache management with automatic expiry cleanup
