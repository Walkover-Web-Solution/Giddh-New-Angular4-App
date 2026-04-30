# White Label Service

Manages per-tenant configuration overrides. Falls back to `EnvironmentService` defaults when no white label config is present.

**File:** `apps/web-giddh/src/app/services/white-label.service.ts`

---

## How It Works

```
API Response (WhiteLabelConfig)
        │
        ▼
WhiteLabelService.setWhiteLabelConfig()
        │
        ▼
getServiceConfig()  ──►  white label value exists?  ──Yes──►  use white label value
                                    │
                                   No
                                    │
                                    ▼
                          EnvironmentService default
```

Every getter checks the white label config first and falls back to `EnvironmentService` if the value is absent. This makes the service safe to use on both Giddh domains and white label domains without any conditional logic in consumers.

---

## Setup

The config is loaded once at app boot (usually in `AppComponent` or an `APP_INITIALIZER`) and injected into the service:

```typescript
// In your bootstrap / initializer
this.whiteLabelService.setWhiteLabelConfig(apiResponse);
```

---

## WhiteLabelConfig Shape

```typescript
interface WhiteLabelConfig {
  status?: string;
  body?: {
    // Auth
    googleClientId?: string;
    googleClientSecret?: string;

    // OTP (separate IDs for Web vs Electron)
    otpWidgetIdWeb?: string;
    otpWidgetTokenWeb?: string;
    otpWidgetIdElectron?: string;
    otpWidgetTokenElectron?: string;

    // Payment
    razorpayPaymentDetails?: { keyId?: string };
    payuPaymentDetails?: any;

    // Branding
    brandName?: string;
    legalName?: string;
    supportEmail?: string;
    supportPhone?: string;
    websiteDomain?: string;
    calendlyUrl?: string;
    logos?: {
      icon?: string;
      primary?: string;
      light?: string;
      favicon?: string;
      dark?: string;
    };

    // Domains / URLs (inside giddhWhiteLabel)
    giddhWhiteLabel?: {
      domainName?: string;   // App URL
      apiDomain?: string;    // API URL
      portalDomain?: string; // Portal URL
      adminDomain?: string;
      uiDomains?: string[];
      theme?: any;           // CSS variable overrides
      // ...other meta fields
    };

    // Permissions
    emailDomains?: string[];
    iciciSupportedCompanies?: string[];

    // Integrations
    gstCredentials?: any;
    vayanaCredentials?: any;
  };
}
```

---

## Key Methods

| Method | Returns | Description |
|---|---|---|
| `setWhiteLabelConfig(config)` | `void` | Store config + run validation warnings |
| `getWhiteLabelConfig()` | `WhiteLabelConfig \| null` | Raw config object |
| `isWhiteLabelActive()` | `boolean` | `true` if config has a `body` |
| `getServiceConfig()` | `object` | Full flat config used by the app (see below) |
| `getApiUrl(region?)` | `string` | API base URL |
| `getAppUrl()` | `string` | App base URL |
| `getPortalUrl()` | `string` | Portal base URL |
| `getGoogleClientId()` | `string` | Google OAuth client ID |
| `getGoogleClientSecret()` | `string` | Google OAuth client secret |
| `getOtpWidgetId()` | `string` | OTP widget ID (auto-selects web vs electron) |
| `getOtpTokenAuth()` | `string` | OTP token (auto-selects web vs electron) |
| `getRazorpayKey()` | `string` | Razorpay key ID |
| `getWhiteLabelTheme()` | `any` | Theme object from config |
| `getConfigurationSummary()` | `string` | Debug summary string |

---

## getServiceConfig() Output

`getServiceConfig()` returns the canonical flat config consumed across the app. Key fields:

```typescript
{
  apiUrl / ApiUrl,         // API base URL
  appUrl / AppUrl,         // App base URL
  PORTAL_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OTP_WIDGET_ID,
  OTP_TOKEN_AUTH,
  RAZORPAY_KEY,
  IS_GIDDH_DOMAIN,         // true when running on giddh.com domains
  BRAND_NAME,
  LEGAL_NAME,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  LOGOS: { icon, primary, light, favicon, dark },
  CALENDLY_URL,
  EMAIL_DOMAINS,
  ANDROID_APP_URL,         // empty string on white label domains
  IOS_APP_URL,             // empty string on white label domains
  HELP_DOC_URL,            // empty string on white label domains
  // ...
}
```

> **`IS_GIDDH_DOMAIN`** — `true` only for `localhost`, test, and production Giddh domains. Use this flag to gate Giddh-only features (app store links, help docs, etc.).

---

## Usage in Components / Services

Inject `WhiteLabelService` and call `getServiceConfig()`:

```typescript
import { WhiteLabelService } from '@app/services/white-label.service';

@Injectable({ providedIn: 'root' })
export class SomeService {
  private readonly whiteLabelService = inject(WhiteLabelService);

  doSomething(): void {
    const config = this.whiteLabelService.getServiceConfig();
    console.log(config.BRAND_NAME);   // 'Giddh' or custom brand name
    console.log(config.apiUrl);       // resolved API URL
  }
}
```

For a single value, use the dedicated getter instead:

```typescript
const apiUrl = this.whiteLabelService.getApiUrl();
const isActive = this.whiteLabelService.isWhiteLabelActive();
```

---

## Validation

`setWhiteLabelConfig()` automatically runs `validateWhiteLabelConfig()` which logs console warnings for:

- Malformed `apiDomain` or `domainName`
- Google Client ID missing `.apps.googleusercontent.com` suffix

No exception is thrown — warnings are advisory only.

---

## IS_GIDDH_DOMAIN Logic

```typescript
// Giddh domains
enum GiddhUiDomain {
  LOCAL      = 'http://localhost:3000/',
  TEST       = 'https://test.giddh.com/',
  PRODUCTION = 'https://giddh.com/',
}

// Inside getServiceConfig()
const isGiddhDomain = [LOCAL, TEST, PRODUCTION].includes(appUrl);
```

When `IS_GIDDH_DOMAIN` is `false`, Giddh-specific URLs (`HELP_DOC_URL`, `ANDROID_APP_URL`, etc.) and defaults (`CALENDLY_URL`, `EMAIL_DOMAINS`, `ICICI_SUPPORTED_COMPANIES`) are set to empty values automatically.

---

## Adding a New White Label Field

1. Add the field to `WhiteLabelConfig` interface.
2. Add a getter method (or use `getValueWithFallback`).
3. Expose it in `getServiceConfig()`.

```typescript
// 1. Interface
body?: {
  myNewField?: string;
};

// 2. Getter (inside WhiteLabelService)
getMyNewField(): string {
  return this.getValueWithFallback(
    this.whiteLabelConfig?.body?.myNewField,
    this.environmentService.myNewFieldDefault,
    'hardcoded-fallback'
  );
}

// 3. getServiceConfig()
MY_NEW_FIELD: this.getMyNewField(),
```
