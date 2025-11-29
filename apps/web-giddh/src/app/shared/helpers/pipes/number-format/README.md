# Giddh Number Format Pipe

This pipe formats numbers with company decimal places and automatically detects locale from the company's country settings using the Intl.NumberFormat API.

## Features

1. **Company Decimal Places**: Automatically uses the company's configured decimal places from the profile settings
2. **Auto-Locale Detection**: Automatically determines locale from company's country code (e.g., IN → 'en-IN', US → 'en-US', FR → 'fr-FR')
3. **Fallback Formatting**: Provides basic formatting if the detected locale is not supported

## Usage

### Basic Usage (Auto-detects locale from company profile)
```html
{{ 1234567.89 | giddhNumberFormat }}
<!-- Output varies by company country: -->
<!-- India (IN): 12,34,567.89 -->
<!-- US: 1,234,567.89 -->
<!-- France: 1 234 567,89 -->
```

### With Custom Decimal Places
```html
{{ 1234567.89 | giddhNumberFormat:4 }}
<!-- Output (with 4 decimals): 12,34,567.8900 -->

{{ 1234567.89 | giddhNumberFormat:0 }}
<!-- Output (no decimals): 12,34,568 -->
```

## Parameters

1. **value** (number): The input number to format
2. **customDecimalPlaces** (number, optional): Override company decimal places

## Supported Locales

- `en-IN`: Indian English (12,34,567.89)
- `en-US`: US English (1,234,567.89)
- `fr-FR`: French (1 234 567,89)
- `de-DE`: German (1.234.567,89)
- `ja-JP`: Japanese (1,234,567.89)
- And many more supported by Intl.NumberFormat

## Module Import

To use this pipe, import the `GiddhNumberFormatModule` in your module:

```typescript
import { GiddhNumberFormatModule } from './shared/helpers/pipes/number-format/number-format.module';

@NgModule({
  imports: [
    GiddhNumberFormatModule,
    // other imports
  ],
  // ...
})
export class YourModule { }
```

## Fallback Behavior

If the specified locale is not supported by the browser, the pipe will fall back to basic formatting with comma separators and the specified decimal places.
