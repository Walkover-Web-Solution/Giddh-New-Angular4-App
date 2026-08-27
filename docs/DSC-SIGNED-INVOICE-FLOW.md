# DSC Signed Invoice Download Flow

## Overview

This document explains the end-to-end flow for downloading a **digitally signed invoice PDF** using a USB DSC (Digital Signature Certificate) token in Giddh.

The flow is used from the voucher list page and the voucher create page. It is built around a reusable Angular Material dialog that communicates with a browser extension/native host (`GiddhBridge`) to read certificates from a token and sign a PDF hash.

---

## High-level Architecture

```text
┌─────────────────────┐     ┌──────────────────────────┐     ┌─────────────────────┐
│  Voucher List Page  │     │   DscSignDialogService   │     │  DscPinDialogComponent│
│  (list.component.ts)│────▶│  (opens + bridge check)  │────▶│   (UI + orchestrator) │
└─────────────────────┘     └──────────────────────────┘     └──────────┬──────────┘
                                                                         │
                              ┌──────────────────────┐                   │
                              │  Voucher Create Page │                   │
                              │ (create.component.ts)│───────────────────┘
                              └──────────────────────┘

                                                                         │
                                                                         ▼
                              ┌─────────────────────────────────────────────────────┐
                              │              DscService (core engine)               │
                              │  • Bridge detection                                 │
                              │  • Certificate read/sync/cache                      │
                              │  • PIN verification                                 │
                              │  • prepareDscSigning → signHash → finishDscSigning  │
                              └──────────────────────┬──────────────────────────────┘
                                                     │
           ┌─────────────────────────────────────────┼──────────────────────────────────────────┐
           │                                         │                                          │
           ▼                                         ▼                                          ▼
  ┌──────────────────┐                    ┌──────────────────┐                       ┌──────────────────┐
  │  window.GiddhBridge│                   │  Giddh Backend   │                       │ DscPinStorageService│
  │ (browser extension │                   │  /dsc/prepare    │                       │ (encrypted PIN     │
  │  / native host)    │                   │  /dsc/finish     │                       │  cache in          │
  └──────────────────┘                    └──────────────────┘                       │  localStorage)     │
                                                                                      └──────────────────┘
```

---

## Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant List as VoucherListComponent
    participant Create as VoucherCreateComponent
    participant Service as DscSignDialogService
    participant Dialog as DscPinDialogComponent
    participant Dsc as DscService
    participant Bridge as window.GiddhBridge
    participant API as Backend /dsc/*
    participant PinStore as DscPinStorageService

    Note over List, Create: Parent page ngOnInit
    List->>Dsc: preloadCertificates()
    Create->>Dsc: preloadCertificates()
    Dsc->>Bridge: getCertificate()
    Bridge-->>Dsc: certificates[]
    Dsc->>Dsc: cache + localStorage
    Dsc-->>List: certificates / complete
    Dsc-->>Create: certificates / complete

    User->>List: Clicks "Download Signed PDF"
    List->>Service: openDownloadSignedInvoiceDialog({ voucher, voucherType })

    alt Bridge not available
        Service->>Service: isBridgeAvailable() === false
        Service->>Service: show warning snackbar (bridge_not_found)
    else Bridge available
        Service->>Dialog: open dialog (disableClose: true)
        Dialog->>Dsc: loadCertificates(false) -> getCachedCertificates()
        Dsc-->>Dialog: cached certificate list (immediate)
        alt parent preload still running
            Dsc-->>Dialog: fresh certificate list (when preload completes)
        end
        Dialog->>PinStore: getPin(selectedCertificate)
        PinStore-->>Dialog: remembered PIN (if any)

        User->>Dialog: Enters/selects PIN and clicks Confirm
        Dialog->>Dsc: syncCertificates() (verify device still connected)
        Dsc->>Bridge: getCertificate()
        Bridge-->>Dsc: certificates[]
        Dsc-->>Dialog: stillConnected?

        alt Device disconnected
            Dialog->>Dialog: show device_not_connected error
        else Device connected and PIN is unchanged remembered PIN
            Dialog->>Dsc: runSigning(certificate) -- skip dummy verifyPin
        else Device connected and PIN is new or edited
            Dialog->>Dsc: verifyPin(certificate, pin)
            Dsc->>Dsc: computeDummyHashBase64()
            Dsc->>Bridge: signHash(dummyHash, SHA256, certId, pin)
            Bridge-->>Dsc: success / error

            alt PIN wrong
                Dsc-->>Dialog: error
                Dialog->>Dialog: clear PIN
            else PIN correct
                alt rememberPin checked
                    Dialog->>PinStore: savePin(certificate, pin, duration)
                else
                    Dialog->>PinStore: forgetPin(certificate)
                end

                Dialog->>Dsc: runSigning(certificate)
            end
        end

        Dialog->>Dsc: prepareDscSigning(voucherDetails, certificate)
        Dsc->>API: POST /dsc/prepare
        API-->>Dsc: { hash, nonce }

        Dialog->>Dsc: signHash(hash, certificate, pin)
        Dsc->>Bridge: signHash(...)
        Bridge-->>Dsc: signature

        alt real signHash failed
            Dsc-->>Dialog: error
            Dialog->>Dialog: clear PIN / forget remembered PIN
        else signature OK
            Dialog->>Dsc: finishDscSigning(nonce, signature)
            Dsc->>API: POST /dsc/finish
            API-->>Dsc: signed PDF Blob

            Dialog->>Dialog: downloadBlob(pdf, fileName)
            Dialog->>Dialog: close + success snackbar
        end
    end

    User->>Create: Saves voucher with "Save & Download Signed PDF"
    Create->>Create: saveVoucher(callback)
    Create->>Service: openDownloadSignedInvoiceDialog({ voucher: response.body, voucherType })
    Service->>Dialog: same flow as above
```

---

## File Reference

| File | Purpose |
|------|---------|
| `apps/web-giddh/src/app/services/dsc-sign-dialog.service.ts` | Public entry point. Checks bridge availability and opens the PIN dialog. |
| `apps/web-giddh/src/app/services/dsc.service.ts` | Core service: bridge detection, certificate read/cache, PIN verification, PDF prepare/sign/finish. |
| `apps/web-giddh/src/app/services/dsc-pin-storage.service.ts` | Encrypted localStorage-based remember-PIN feature. |
| `apps/web-giddh/src/app/vouchers/dsc-pin-dialog/dsc-pin-dialog.component.ts` | Dialog component that orchestrates the UI and signing steps. |
| `apps/web-giddh/src/app/vouchers/dsc-pin-dialog/dsc-pin-dialog.component.html` | Dialog template: certificate list, PIN field, remember PIN options. |
| `apps/web-giddh/src/app/services/apiurls/dsc.api.ts` | API URLs for `/dsc/prepare` and `/dsc/finish`. |
| `apps/web-giddh/src/app/vouchers/list/list.component.ts` | Calls the flow from the voucher list. |
| `apps/web-giddh/src/app/vouchers/create/create.component.ts` | Calls the flow after saving a new voucher. |
| `apps/web-giddh/src/app/vouchers/preview/preview.component.ts` | Calls the flow from the voucher preview page. |
| `apps/web-giddh/src/app/theme/attachments/attachments.component.ts` | Calls the flow from the attachments dialog. |
| `apps/web-giddh/src/assets/locale/vouchers/dsc-pin-dialog/*.json` | Translations (en, hi, mr). |

---

## Detailed Flow

### 1. Entry Points

Two voucher pages trigger the same reusable service.

#### Voucher list page

```typescript
// apps/web-giddh/src/app/vouchers/list/list.component.ts
public downloadSignedInvoicePdf(voucher: any): void {
    this.dscSignDialogService.openDownloadSignedInvoiceDialog({
        voucher,
        voucherType: this.voucherType
    });
}
```

#### Voucher create page

```typescript
// apps/web-giddh/src/app/vouchers/create/create.component.ts
public createDownloadSignedPdf(): void {
    this.storeFocus();
    this.saveVoucher((response) => {
        if (response?.status === 'success' && response.body) {
            this.dscSignDialogService.openDownloadSignedInvoiceDialog({
                voucher: response.body,
                voucherType: response.body?.voucherType || response.body?.type || this.voucherType
            });
        }
    });
}
```

#### Voucher preview page

```typescript
// apps/web-giddh/src/app/vouchers/preview/preview.component.ts
public downloadSignedInvoicePdf(): void {
    if (!this.selectedInvoice) {
        return;
    }
    this.dscSignDialogService.openDownloadSignedInvoiceDialog({
        voucher: this.selectedInvoice,
        voucherType: this.voucherType
    });
}
```

#### Attachments dialog

```typescript
// apps/web-giddh/src/app/theme/attachments/attachments.component.ts
public downloadSignedInvoicePdf(): void {
    if (!this.selectedItem) {
        return;
    }
    this.dscSignDialogService.openDownloadSignedInvoiceDialog({
        voucher: this.selectedItem,
        voucherType: this.selectedItem.voucherGeneratedType
    });
}
```

The data shape expected by the dialog is:

```typescript
export interface DscPinDialogData {
    voucher: any;      // must contain uniqueName and a voucher/estimate/proforma number
    voucherType: string;
}
```

### 2. Bridge Availability Check

`DscSignDialogService.openDownloadSignedInvoiceDialog()` first checks:

```typescript
if (!this.dscService.isBridgeAvailable()) {
    // show warning: bridge not installed
    return;
}
```

`isBridgeAvailable()` simply checks `typeof window !== 'undefined' && !!window.GiddhBridge`.

The bridge (`window.GiddhBridge`) is injected by the **Giddh DSC browser extension + native host** that talks to the USB token. If it is missing, the user sees a warning snackbar telling them to install the extension and refresh.

### 3. Parent Page Preload

Both the voucher list, voucher create, voucher preview, and attachments dialog pages start a background certificate read as soon as they initialise:

```typescript
// list.component.ts / create.component.ts / preview.component.ts / attachments.component.ts
public ngOnInit(): void {
    ...
    this.dscService.preloadCertificates().pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
            this.isDscPreloading = false;
            this.changeDetectorRef.detectChanges();
        })
    ).subscribe();
}
```

`preloadCertificates()` returns an observable that completes when the bridge response arrives (or immediately with `[]` if the bridge is missing). The parent component tracks this with `isDscPreloading` and disables every "Download Signed Invoice" button until the preload finishes, showing a small inline spinner on the menu item.

```html
<!-- list.component.html / create.component.html / preview.component.html -->
<button mat-menu-item (click)="downloadSignedInvoicePdf(element)" [disabled]="isDscPreloading">
    @if (isDscPreloading) {
        <span class="d-flex align-items-center">
            <mat-spinner [diameter]="14" class="mr-2"></mat-spinner>
            {{ localeData?.download_signed_invoice }}
        </span>
    } @else {
        {{ localeData?.download_signed_invoice }}
    }
</button>

<!-- attachments.component.html -->
<a
    (click)="!isDscPreloading && downloadSignedInvoicePdf()"
    [matTooltip]="localeData?.download_signed_invoice"
    [class.disabled]="isDscPreloading"
>
    @if (isDscPreloading) {
        <mat-spinner [diameter]="14"></mat-spinner>
    } @else {
        <i class="icon-download-circle"></i>
    }
</a>
```

The preload result is cached in memory and in `localStorage`, so the dialog can render instantly without reading the token again.

### 4. Opening the PIN Dialog

If the bridge exists, the service opens `DscPinDialogComponent` with:

- `panelClass: ['mat-dialog-sm']`
- `disableClose: true` (prevents closing while signing is in progress)

### 5. Certificate Loading in the Dialog

When the dialog opens it no longer forces a fresh token read. It uses the cached/preloaded certificate list:

```typescript
this.loadCertificates(false); // force = false -> use cache first
```

`DscService.getCachedCertificates()` behaves like this:

1. If a certificate list is already in memory, return it immediately.
2. Otherwise seed memory from `localStorage` (`giddh_dsc_certificates`) and return it.
3. If a parent preload is still in flight, emit the cached/stored list **immediately** and then emit the fresh result when the preload completes.
4. If nothing is cached, fall back to `syncCertificates()` (single shared token read).

The dialog renders the list as soon as the first emission arrives and updates automatically if a fresher list arrives later.

If the cached read fails (token unplugged, no certificates), the cache is cleared and an error message is shown.

### 6. Remembered PIN Auto-fill

When a certificate is selected, the dialog checks `DscPinStorageService`:

```typescript
this.dscPinStorage.getPin(certificate).then((result) => {
    if (result) {
        this.dscPin = result.pin;
        this.usedRememberedPin = true;
        this.hasSavedPin = true;
        this.rememberPin = true;
        // also restore the saved duration
    }
});
```

If a valid, non-expired PIN exists for the same certificate serial + certId, it is auto-filled and flagged with `usedRememberedPin = true`. The user still has to click **Confirm** to proceed.

Whenever the PIN input is edited, `onDscPinChange()` clears `usedRememberedPin`, so the next submit treats the value as a new PIN and runs the dummy-hash verification.

### 7. Submit / Sign Flow

When the user clicks **Confirm**, `submitDscPin()` runs:

```mermaid
flowchart TD
    A[submitDscPin] --> B{syncCertificates}<br/>device still connected?}
    B -->|No| C[Show device_not_connected error]
    B -->|Yes| D{PIN unchanged<br/>from storage?}
    D -->|Yes| E[Skip dummy verifyPin]
    D -->|No / edited| F[verifyPin dummy hash sign]
    F -->|Wrong PIN| G[Clear PIN]
    F -->|Correct| H[Save or forget remembered PIN]
    H --> I[prepareDscSigning<br/>POST /dsc/prepare]
    E --> I
    I --> J[signHash real hash<br/>via GiddhBridge]
    J -->|Wrong PIN| K[Clear PIN / forget remembered PIN]
    J -->|OK| L[finishDscSigning<br/>POST /dsc/finish]
    L --> M[Download signed PDF Blob]
```

#### Steps in code

1. **Verify device is still connected** — `syncCertificates()` is called again to make sure the same token is plugged in.
2. **Decide whether to verify the PIN**:
   - If the current PIN value is the **unmodified remembered PIN** (`usedRememberedPin === true`), the dummy-hash verification is skipped.
   - If the user **typed or edited the PIN**, `verifyPin()` signs a fixed dummy hash (`'giddh-dsc-pin-check'`) with the token to prove the PIN unlocks it.
3. **Remember PIN** (only after a successful dummy verification) — if the user checked "Remember PIN", `DscPinStorageService.savePin()` stores it encrypted in `localStorage` with the chosen expiry.
4. **Prepare** — `prepareDscSigning()` POSTs voucher details + selected certificate to `/api/v1/company/{companyUniqueName}/dsc/prepare`. The server creates a PDF signing placeholder and returns a `{ hash, nonce }`.
5. **Sign hash** — `signHash()` calls `window.GiddhBridge.signHash(hashBase64, 'SHA256', certId, pin)` to produce a base64 signature using the token.
6. **Finish** — `finishDscSigning()` POSTs `{ nonce, signature }` to `/api/v1/company/{companyUniqueName}/dsc/finish`. The server embeds the signature into the PDF and returns the signed PDF as a `Blob`.
7. **Download** — the browser triggers a download named `<voucherNumber>.pdf`.

### 8. Remember PIN Feature

Implemented in `DscPinStorageService`.

- PINs are **encrypted** using the browser Web Crypto API (`AES-GCM`) with a key derived (`PBKDF2`) from a per-browser random device secret + certificate serial.
- Each stored entry is keyed by **certificate serial** and bound to the same `certId`.
- Supported retention durations: `15m`, `2h`, `1d`, `7d`, `permanent`.
- Stored under `localStorage` key: `giddh_dsc_pins`.
- Device secret under `localStorage` key: `giddh_dsc_device`.

Important behavior:

- Auto-filled remembered PINs are forgotten automatically if signing fails (wrong/locked token).
- Expired entries are pruned when read.
- The user can manually click **Forget saved PIN** in the dialog.

### 9. Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Bridge not installed | Warning snackbar, dialog does not open. |
| Token not connected / no certificates | Dialog shows error; certificate list empty. |
| Wrong PIN | Dialog stays open, PIN field cleared, error shown. If PIN was remembered, it is forgotten. |
| Device disconnected during submit | List refreshes, error shown, no server call. |
| `/prepare` or `/finish` failure | Dialog closes, error snackbar shown. |
| Browser console | All key steps log `[DSC ...]` info/errors for debugging. |

Bridge errors are normalized to user-friendly messages in `DscService.normalizeBridgeError()`:

- Messages containing "incorrect pin" / "wrong pin" become `Incorrect PIN. Please try again.`
- Messages containing "pin" become `PIN error: ...`
- Messages containing "certificate" become `Certificate error: ...`

---

## Interfaces

```typescript
// USB token certificate
export interface DscCertificate {
    certId: string;
    certB64: string;
    subjectCn?: string;
    issuerCn?: string;
    serial?: string;
    notBefore?: string;
    notAfter?: string;
    isCa?: boolean;
    chain?: string[];
}

// Injected by the Giddh DSC extension
export interface GiddhBridge {
    getCertificate(): Promise<{ success: boolean; certificates?: DscCertificate[]; message?: string }>;
    signHash(hashBase64: string, algorithm: string, certId: string, pin: string): Promise<{ success: boolean; signature?: string; message?: string }>;
    diagnose?(): Promise<any>;
}

// Server prepare response
export interface DscPrepareResponse {
    hash: string;
    nonce: string;
}

// Server finish request
export interface DscFinishRequest {
    nonce: string;
    signature: string;
}
```

---

## Locale Keys

Translation file: `apps/web-giddh/src/assets/locale/vouchers/dsc-pin-dialog/{en|hi|mr}.json`

| Key | Used for |
|-----|----------|
| `title` | Dialog title |
| `pin_label` / `pin_placeholder` | PIN input |
| `select_certificate` | Certificate list header |
| `issued_by` / `valid_until` | Certificate meta |
| `no_certificates` | Empty certificate list |
| `loading_certificates` | Spinner while reading token |
| `incorrect_pin` | Wrong PIN error |
| `device_not_connected` | Token unplugged |
| `verifying_device` / `verifying_pin` / `preparing_pdf` / `signing_pdf` | Progress overlay messages |
| `bridge_not_found` | Bridge missing warning |
| `download_success` / `download_error` | Snackbars |
| `remember_pin` / `remember_pin_hint` | Remember PIN checkbox |
| `remember_duration_15m` ... `remember_duration_permanent` | Duration dropdown options |
| `refresh_certificates` | Manual refresh link |
| `forget_pin` | Forget saved PIN button |

---

## How to Use from a New Component

1. Inject `DscSignDialogService`.
2. Call `openDownloadSignedInvoiceDialog` with the voucher object and voucher type.

```typescript
import { DscSignDialogService } from '../../services/dsc-sign-dialog.service';

constructor(private dscSignDialogService: DscSignDialogService) {}

public downloadSignedPdf(voucher: any): void {
    this.dscSignDialogService.openDownloadSignedInvoiceDialog({
        voucher,
        voucherType: this.voucherType
    });
}
```

No other setup is required; the service and dialog handle bridge checks, certificate loading, signing, and download.

---

## Security Notes

- The **PIN is never sent to Giddh servers**. It is only used in the browser to unlock the USB token via `GiddhBridge`.
- The **PDF hash** is signed locally by the token; the private key never leaves the token.
- Remembered PINs are encrypted at rest but are still in browser-local storage. Users should not use "permanent" on shared machines.
- Device binding uses certificate `serial` + `certId` so a remembered PIN is only reused when the same physical token is connected.
