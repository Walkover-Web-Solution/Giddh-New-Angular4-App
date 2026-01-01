# Material 3 Theme Implementation Guide for Giddh App

## 🚀 Step-by-Step Implementation

### Step 1: Update Your Main Styles File

Replace the old theme import in your `main.scss` file:

```scss
// OLD (line 10 in main.scss):
@use "themes/custom-theme";

// NEW:
@use "themes/m3-main-theme";
@use "themes/m3-migration-bridge";
```

### Step 2: Update Angular.json (if needed)

Ensure your `angular.json` includes the main styles file:

```json
{
  "styles": [
    "src/assets/styles/main.scss"
  ]
}
```

### Step 3: Apply Theme Classes to Your App

In your main `app.component.html`, wrap your content:

```html
<!-- For light theme (default) -->
<div class="giddh-light-theme">
  <router-outlet></router-outlet>
</div>

<!-- For dark theme -->
<div class="giddh-dark-theme">
  <router-outlet></router-outlet>
</div>

<!-- For automatic system preference -->
<div> <!-- No class = follows system preference -->
  <router-outlet></router-outlet>
</div>
```

### Step 4: Theme Switching Service (Optional)

Create a theme service for dynamic switching:

```typescript
// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  toggleTheme(): void {
    this.isDarkTheme.next(!this.isDarkTheme.value);
    this.updateThemeClass();
  }

  setDarkTheme(isDark: boolean): void {
    this.isDarkTheme.next(isDark);
    this.updateThemeClass();
  }

  private updateThemeClass(): void {
    const body = document.body;
    if (this.isDarkTheme.value) {
      body.classList.remove('giddh-light-theme');
      body.classList.add('giddh-dark-theme');
    } else {
      body.classList.remove('giddh-dark-theme');
      body.classList.add('giddh-light-theme');
    }
  }
}
```

## 🎨 Using Your Existing Variables

### Your Current Variables Still Work!

All your existing CSS variables are mapped to the new M3 system:

```scss
// OLD VARIABLES (still work):
background-color: var(--theme-primary-color);
color: var(--theme-on-surface-color);
border: 1px solid var(--border-color);

// NEW M3 VARIABLES (recommended):
background-color: var(--md-sys-color-primary);
color: var(--md-sys-color-on-surface);
border: 1px solid var(--md-sys-color-outline);
```

### Variable Mapping Reference

| Old Variable | New M3 Variable | Description |
|--------------|-----------------|-------------|
| `--theme-primary-color` | `--md-sys-color-primary` | Main brand color (Azure) |
| `--theme-surface-color` | `--md-sys-color-surface` | Surface background |
| `--theme-on-surface-color` | `--md-sys-color-on-surface` | Text on surface |
| `--border-color` | `--md-sys-color-outline` | Borders and dividers |
| `--bg-primary-color` | `--md-sys-color-primary` | Primary background |
| `--text-primary-color` | `--md-sys-color-on-primary` | Text on primary |

## 🔧 Gradual Migration Strategy

### Phase 1: Basic Implementation (Immediate)
1. Update `main.scss` imports
2. Add theme classes to app component
3. Test existing functionality

### Phase 2: Component Updates (Gradual)
Update components one by one:

```scss
// Example: Update a card component
.my-card {
  // OLD:
  background-color: var(--theme-surface-color);
  color: var(--theme-on-surface-color);
  
  // NEW (migrate gradually):
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: var(--md-sys-elevation-level1);
}
```

### Phase 3: Advanced Features (Later)
- Implement dynamic theme switching
- Add M3 elevation system
- Use M3 state layers for interactions

## 🎯 Common Component Patterns

### Buttons
```scss
.primary-button {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  box-shadow: var(--md-sys-elevation-level1);
}

.secondary-button {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  border: 1px solid var(--md-sys-color-outline);
}
```

### Cards
```scss
.content-card {
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--md-sys-elevation-level2);
}
```

### Forms
```scss
.form-field {
  background-color: var(--md-sys-color-surface-container);
  border: 1px solid var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface);
}

.form-field:focus {
  border-color: var(--md-sys-color-primary);
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: -1px;
}
```

### Navigation
```scss
.nav-item {
  color: var(--md-sys-color-on-surface-variant);
}

.nav-item.active {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
```

## 🧪 Testing Your Implementation

### 1. Visual Test
- Check that your app loads without errors
- Verify colors look correct in both light and dark modes
- Test theme switching (if implemented)

### 2. Component Test
```html
<!-- Add this to any component for testing -->
<div class="debug-theme-colors">
  <p>Primary: <span style="background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); padding: 4px 8px;">Sample</span></p>
  <p>Surface: <span style="background-color: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface); padding: 4px 8px; border: 1px solid var(--md-sys-color-outline);">Sample</span></p>
</div>
```

### 3. Browser DevTools
- Open DevTools → Elements → Computed styles
- Search for `--md-sys-color-` to see all M3 variables
- Verify values are correct for your theme

## 🚨 Troubleshooting

### Issue: Colors not appearing
**Solution**: Ensure you've imported the M3 theme files in the correct order in `main.scss`

### Issue: Dark theme not working
**Solution**: Check that theme classes are applied correctly to parent elements

### Issue: Material components not themed
**Solution**: Verify `@include mat.all-component-themes()` is called in your theme files

### Issue: Existing variables broken
**Solution**: The migration bridge should handle this - check that `m3-migration-bridge.scss` is imported

## 📚 Next Steps

1. **Immediate**: Follow Steps 1-3 above
2. **Week 1**: Test all major components
3. **Week 2**: Start migrating components to new M3 variables
4. **Month 1**: Implement theme switching
5. **Ongoing**: Gradually replace old variables with M3 tokens

## 🎨 Your Color Scheme

Your M3 theme uses:
- **Primary**: Azure (light blue/cyan) - `#0061a4` in light mode, `#9accff` in dark mode
- **Secondary**: Green - `#4f6352` in light mode, `#b4ccb8` in dark mode  
- **Tertiary**: Blue (deeper) - `#005888` in light mode, `#7fbeff` in dark mode
- **Error**: Standard M3 red - `#ba1a1a` in light mode, `#ffb4ab` in dark mode

All colors automatically adjust for light/dark modes and maintain proper contrast ratios.
