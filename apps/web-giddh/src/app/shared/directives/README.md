# Resizable Directive

A reusable Angular directive that adds drag-to-resize functionality to any element with per-page width persistence.

## Usage

### 1. Import the Module

```typescript
import { ResizableModule } from './shared/directives/resizable.module';

@NgModule({
  imports: [
    ResizableModule,
    // other imports...
  ],
})
export class YourModule { }
```

### 2. Basic Usage

```html
<!-- Simple usage - resizes the first child element -->
<div appResizable [voucherType]="'my-page'" class="container">
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
  [voucherType]="voucherType"
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
| `storageKey` | string | 'resizable-width' | localStorage key for storing width preferences |
| `voucherType` | string | 'voucherType' | Unique identifier for per-page width storage |

## Per-Page Width Storage

The directive stores width preferences per `voucherType` in localStorage using an object structure:

```json
{
  "contact-preview": 0.35,
  "vouchers-preview": 0.45,
  "sales": 0.30,
  "purchase": 0.40
}
```

Each page/voucher type maintains its own independent width preference.

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
- **Per-page persistence**: Each page/voucher type remembers its own width
- **Visual feedback**: Hover effects and cursor changes only during actual dragging
- **Responsive**: Adapts to window size changes while maintaining user preferences
- **Performance optimized**: RequestAnimationFrame for smooth updates, pointer capture for better tracking
- **Configurable**: Customizable through input properties
- **Accessible**: Proper ARIA attributes and keyboard support

## Behavior Details

### Click vs Drag Detection
- **Simple Click**: No cursor change, triggers toggle functionality
- **Drag (>3px movement)**: Cursor changes to `col-resize`, enables resize mode
- **Fast Drag**: Optimized tracking prevents cursor drift from resizer

### Width Persistence
- Automatically saves width as percentage on drag end
- Restores saved width on component initialization
- Validates saved width against current window constraints
- Adjusts width on window resize while maintaining user preference

## Example: Contact Preview Component

```html
<div 
  appResizable
  resizableTarget=".preview-list"
  [minWidth]="300"
  [maxWidthRatio]="0.5"
  [defaultWidthRatio]="0.4"
  [voucherType]="voucherType"
  class="invoice-preview-wrapper d-flex full-viewport-height">
  
  <div class="preview-list pb-3">
    <!-- Left panel content -->
  </div>
  
  <div class="preview-content flex-grow-1">
    <!-- Right panel content -->
  </div>
</div>
```

```typescript
export class ContactPreviewComponent {
  public voucherType: string = 'contact-preview';
  // ... rest of component
}
```

## Example: Vouchers Preview Component

```html
<div 
  appResizable
  resizableTarget=".preview-list"
  [minWidth]="300"
  [maxWidthRatio]="0.5"
  [defaultWidthRatio]="0.4"
  [voucherType]="voucherType"
  class="invoice-preview-wrapper">
  
  <div class="preview-list h-100 pb-3">
    <!-- Left panel content -->
  </div>
  
  <div class="preview-content flex-grow-1">
    <!-- Right panel content -->
  </div>
</div>
```

```typescript
export class VouchersPreviewComponent {
  public voucherType: any = ''; // Set dynamically from route params
  // ... rest of component
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Notes

- Uses `requestAnimationFrame` for smooth 60fps updates during dragging
- Implements pointer capture for better cursor tracking
- Debounced window resize handling (150ms)
- Minimal DOM manipulations with Renderer2
