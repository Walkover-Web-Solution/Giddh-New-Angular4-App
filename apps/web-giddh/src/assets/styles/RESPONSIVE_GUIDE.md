# 📱 Responsive Mixins Guide

> Quick reference for using responsive breakpoints in Giddh Angular application

## 🎯 Available Breakpoints

| Breakpoint | Range | Description | Use Case |
|------------|-------|-------------|----------|
| `tablet` | 768px - 1023px | iPad & tablets | Touch-friendly layouts |
| `small-desktop` | 1024px - 1279px | Business laptops | Compact desktop UI |
| `medium-desktop` | 1280px - 1439px | Modern laptops | Standard desktop |
| `large-desktop` | 1440px - 1919px | External monitors | Spacious layouts |
| `xl-desktop` | 1920px+ | High-res displays | Maximum content |

## 🏢 Accounting Breakpoints

| Breakpoint | Width | Purpose |
|------------|-------|---------|
| `sidebar-comfortable` | 1200px+ | Sidebar + content fits well |
| `multi-column-forms` | 1100px+ | Forms can use 2+ columns |
| `full-data-view` | 1400px+ | All table columns visible |

---

## 🚀 Basic Usage

### 1. **Mobile-First Approach** (Recommended)
```scss
.component {
  // Base styles for tablets (768px+)
  padding: 1rem;
  
  @include media-breakpoint-up('small-desktop') {
    // 1024px and up
    padding: 2rem;
  }
  
  @include media-breakpoint-up('large-desktop') {
    // 1440px and up
    padding: 3rem;
  }
}
```

### 2. **Exact Breakpoint Ranges**
```scss
.navigation {
  @include exact-breakpoint('tablet') {
    // Only for tablets (768px - 1023px)
    flex-direction: column;
  }
  
  @include exact-breakpoint('small-desktop') {
    // Only for small desktops (1024px - 1279px)
    flex-direction: row;
  }
}
```

### 3. **Max-Width Queries**
```scss
.sidebar {
  @include media-breakpoint-down('small-desktop') {
    // Up to 1023px (tablets and below)
    display: none;
  }
}
```

---

## 💼 Common Patterns

### **Grid Layouts**
```scss
.card-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr; // Default: 1 column
  
  @include media-breakpoint-up('small-desktop') {
    grid-template-columns: repeat(2, 1fr); // 2 columns
  }
  
  @include media-breakpoint-up('medium-desktop') {
    grid-template-columns: repeat(3, 1fr); // 3 columns
  }
  
  @include media-breakpoint-up('xl-desktop') {
    grid-template-columns: repeat(4, 1fr); // 4 columns
  }
}
```

### **Typography Scaling**
```scss
.heading {
  @include media-breakpoint-down('small-desktop') {
    font-size: 1.5rem; // Smaller on tablets
  }
  
  @include media-breakpoint-up('small-desktop') {
    font-size: 2rem; // Medium on laptops
  }
  
  @include media-breakpoint-up('large-desktop') {
    font-size: 2.5rem; // Large on monitors
  }
}
```

### **Sidebar Layouts**
```scss
.layout {
  display: flex;
  
  @include media-breakpoint-down('small-desktop') {
    flex-direction: column; // Stack on tablets
  }
  
  @include accounting-breakpoint('sidebar-comfortable') {
    flex-direction: row; // Side-by-side when comfortable
  }
  
  .sidebar {
    @include media-breakpoint-down('small-desktop') {
      width: 100%;
    }
    
    @include accounting-breakpoint('sidebar-comfortable') {
      width: 280px;
    }
  }
}
```

---

## 🏦 Accounting-Specific Examples

### **Form Layouts**
```scss
.accounting-form {
  .form-row {
    @include accounting-breakpoint('multi-column-forms') {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }
}
```

### **Data Tables**
```scss
.financial-table {
  @include media-breakpoint-down('medium-desktop') {
    .optional-column {
      display: none; // Hide on smaller screens
    }
  }
  
  @include accounting-breakpoint('full-data-view') {
    .optional-column {
      display: table-cell; // Show all columns
    }
    
    .actions-column {
      min-width: 150px;
    }
  }
}
```

### **Dashboard Widgets**
```scss
.dashboard-grid {
  display: grid;
  gap: 1rem;
  
  @include exact-breakpoint('tablet') {
    grid-template-columns: 1fr; // 1 column on tablets
  }
  
  @include exact-breakpoint('small-desktop') {
    grid-template-columns: repeat(2, 1fr); // 2 columns
  }
  
  @include accounting-breakpoint('full-data-view') {
    grid-template-columns: repeat(4, 1fr); // 4 columns
    gap: 2rem;
  }
}
```

---

## 🎨 Utility Classes (Ready to Use)

### **Display Controls**
```html
<!-- Hide on tablets -->
<div class="d-tablet-none">Hidden on tablets</div>

<!-- Show only on large desktops -->
<div class="d-large-desktop-block">Large desktop only</div>

<!-- Flex on medium desktops -->
<div class="d-medium-desktop-flex">Flex layout</div>
```

### **Text Alignment**
```html
<!-- Center text on tablets -->
<h1 class="text-tablet-center">Centered on tablets</h1>

<!-- Left align on large desktops -->
<p class="text-large-desktop-left">Left on large screens</p>
```

### **Spacing**
```html
<!-- Different padding per breakpoint -->
<div class="p-tablet-1 p-small-desktop-2 p-large-desktop-4">
  Responsive padding
</div>
```

---

## ⚠️ Important Notes

### **❌ Don't Use (Unsupported)**
```scss
// Mobile screens are not supported
@include media-breakpoint-down('tablet'); // Avoid this
```

### **✅ Best Practices**
1. **Start with tablet-first** approach (768px base)
2. **Use accounting breakpoints** for business layouts
3. **Test on actual devices** - especially tablets
4. **Keep it simple** - don't over-complicate breakpoints

### **🔄 Legacy Support**
```scss
// Old way (still works but deprecated)
@include tablet-up { }
@include small-desktop-up { }

// New way (recommended)
@include media-breakpoint-up('tablet') { }
@include media-breakpoint-up('small-desktop') { }
```

---

## 🆕 Container Queries (Modern CSS)

> **New Feature**: Component-based responsive design using CSS Container Queries

### **Setup Container Context**
```html
<!-- Add container-query-base class to enable container queries -->
<div class="sidebar container-query-base" style="--container-name: sidebar">
  <div class="widget">Content adapts to sidebar width</div>
</div>
```

### **Container Query Mixins**
```scss
.widget {
  // Default styles
  padding: 1rem;
  
  @include when-container-wider-than(300px) {
    // When container is wider than 300px
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include when-container-wider-than(500px) {
    // When container is wider than 500px
    grid-template-columns: repeat(3, 1fr);
  }
  
  @include when-container-height-greater-than(400px) {
    // When container is taller than 400px
    .extra-content {
      display: block;
    }
  }
}
```

### **Named Container Queries**
```scss
// For specific named containers
.dashboard-widget {
  @include when-named-container(sidebar, 'min-width: 280px') {
    // Only applies when 'sidebar' container is 280px+ wide
    .widget-title {
      font-size: 1.2rem;
    }
  }
}
```

### **Container vs Viewport Queries**
```scss
.card {
  // Viewport-based (traditional)
  @include media-breakpoint-up('small-desktop') {
    // Responds to screen size (1024px+)
  }
  
  // Container-based (modern)
  @include when-container-wider-than(400px) {
    // Responds to parent container size
  }
}
```

### **Container Query Variables**
```scss
// Standard container breakpoints (from _variables.scss)
$container-xs: 250px;   // Extra small - tight spaces
$container-sm: 350px;   // Small cards  
$container-md: 500px;   // Medium components
$container-lg: 650px;   // Large components
$container-xl: 800px;   // Extra large
$container-xxl: 1000px; // Maximum component size
```

### **Using Container Variables**
```scss
.component {
  // Using container variables directly
  @include when-container-wider-than($container-sm) {
    // When container is 350px+ wide
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include when-container-wider-than($container-lg) {
    // When container is 650px+ wide
    grid-template-columns: repeat(3, 1fr);
  }
  
  @include when-container-wider-than($container-xl) {
    // When container is 800px+ wide
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### **Practical Examples**
```scss
// Card component that adapts to container size
.card {
  padding: 1rem;
  
  @include when-container-wider-than($container-xs) {
    // 250px+ containers
    padding: 1.5rem;
  }
  
  @include when-container-wider-than($container-sm) {
    // 350px+ containers
    display: flex;
    align-items: center;
  }
  
  @include when-container-wider-than($container-md) {
    // 500px+ containers
    .card-details {
      display: block;
    }
  }
}

// Form layout that responds to container
.form-section {
  @include when-container-wider-than($container-sm) {
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }
  
  @include when-container-wider-than($container-lg) {
    .form-row {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

// Data table responsive columns
.data-table {
  @include when-container-wider-than($container-md) {
    .optional-column {
      display: table-cell;
    }
  }
  
  @include when-container-wider-than($container-xl) {
    .all-columns {
      display: table-cell;
    }
    
    .actions-column {
      min-width: 150px;
    }
  }
}
```

### **Available Container Query Mixins**
| Mixin | Purpose | Example |
|-------|---------|---------|
| `when-container-wider-than($width)` | Min-width container query | `@include when-container-wider-than($container-sm)` |
| `when-container-narrower-than($width)` | Max-width container query | `@include when-container-narrower-than($container-lg)` |
| `when-container-height-greater-than($height)` | Min-height container query | `@include when-container-height-greater-than(200px)` |
| `when-container-height-less-than($height)` | Max-height container query | `@include when-container-height-less-than(300px)` |
| `when-container-aspect-ratio($ratio)` | Aspect ratio query | `@include when-container-aspect-ratio(16/9)` |
| `when-named-container($name, $condition)` | Named container query | `@include when-named-container(sidebar, 'min-width: 280px')` |

---

## 🔧 Quick Cheat Sheet

```scss
// Most common patterns
.component {
  // Base: tablet styles (768px+)
  
  @include media-breakpoint-up('small-desktop') {
    // Business laptops (1024px+)
  }
  
  @include accounting-breakpoint('sidebar-comfortable') {
    // Comfortable sidebar layout (1200px+)
  }
  
  @include accounting-breakpoint('full-data-view') {
    // Full accounting view (1400px+)
  }
  
  // Modern container queries using variables
  @include when-container-wider-than($container-sm) {
    // Component responds to its container size (350px+)
  }
  
  @include when-container-wider-than($container-lg) {
    // Larger container adaptations (650px+)
  }
}
```

**Need help?** Check `/assets/styles/utilities/_responsive-examples.scss` for more examples!
