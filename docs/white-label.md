# White Label Service

Manages per-tenant configuration overrides with field-specific defaults from `EnvironmentService`, Giddh constants or empty values.

**Source:** [WhiteLabelService](../apps/web-giddh/src/app/services/white-label.service.ts), reviewed 2026-10-23.

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
                          Field-specific default
```

Configuration getters prefer supplied white-label values. Defaults vary by field: API/auth values can use `EnvironmentService`, while `getServiceConfig()` suppresses Giddh-specific branding/defaults and links when `IS_GIDDH_DOMAIN` is false.

---

## Setup

The startup implementation is in [AppModule](../apps/web-giddh/src/app/app.module.ts): `fetchWhiteLabel()` uses the `whiteLabel` local-storage cache or fetches configuration, and the initializer calls `getServiceConfigAfterInit()`. `getServiceConfig()` passes that configuration into `WhiteLabelService`:

```typescript
whiteLabelService.setWhiteLabelConfig(whiteLabelConfig);
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
  IS_GIDDH_DOMAIN,         // resolved by resolveIsGiddhDomain()
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

> **`IS_GIDDH_DOMAIN`** gates Giddh-specific links and defaults. It also returns true in Electron or with an empty hostname; see the exact rules below.

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

`WhiteLabelService.resolveIsGiddhDomain()` normalizes a trailing slash and compares the resolved app URL with `GiddhUiDomain.LOCAL`, `TEST` and `PRODUCTION` in [app.constant.ts](../apps/web-giddh/src/app/app.constant.ts). These are currently `http://localhost:3000/`, `https://test.giddh.com/` and `https://books.giddh.com/`. It also returns true when `EnvironmentService.isElectron` is true or `window.location.hostname` is empty; otherwise it returns false.

When false, Giddh-only URLs (`HELP_DOC_URL`, `ANDROID_APP_URL`, etc.) become empty strings. Fields such as `CALENDLY_URL`, `EMAIL_DOMAINS` and `ICICI_SUPPORTED_COMPANIES` still accept explicit white-label values; only their Giddh defaults are suppressed.

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
