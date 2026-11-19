# Bootstrap — exact success responses

Company: `giddhain1792673422178091xos` · Captured 2026-10-22 · Base `https://api.giddh.com`

Auth used in browser: `Session-Id` (store locally in `secrets.local.json`, never commit).

---

## `POST /company` — create (exact success)

Full capture: [`responses/00-create-company.json`](responses/00-create-company.json)  
Request: [`requests/00-create-company.json`](requests/00-create-company.json)

```json
{
  "status": "success",
  "body": {
    "planVersion": 2,
    "name": "Giddh Automation API DOC",
    "uniqueName": "giddhain1792673422178091xos",
    "baseCurrency": "INR",
    "voucherVersion": 2,
    "businessType": "Registered",
    "businessNature": "Retail",
    "subscription": {
      "subscriptionId": "SUB-20261022-5",
      "status": "active",
      "planDetails": {
        "name": "WhiteLabelPlan",
        "uniqueName": "ltv1768484147685"
      }
    },
    "addresses": [
      {
        "uniqueName": "8rz1792673422372",
        "taxNumber": "23AAACC1206D2ZN",
        "stateCode": "MP",
        "isDefault": true,
        "taxType": "GSTIN"
      }
    ],
    "financialYears": [
      {
        "uniqueName": "FY-APR2026-MAR2027",
        "financialYearStarts": "01-04-2026",
        "financialYearEnds": "31-03-2027",
        "isLocked": false
      }
    ],
    "portalDomain": "GiddhAutomationAPIDOC",
    "baseCurrencySymbol": "₹"
  }
}
```

---

## `GET /company/{c}/branch?hierarchyType=flatten` — exact success

Full: [`responses/01-branch-flatten.json`](responses/01-branch-flatten.json)

```json
{
  "status": "success",
  "body": [
    {
      "uniqueName": "giddhautomationapidoc",
      "alias": "Gidd",
      "defaultBranch": true,
      "warehouseResource": [
        {
          "uniqueName": "xbq1792673424418",
          "name": "Gidd warehouse",
          "isDefault": true
        }
      ],
      "addresses": [
        {
          "uniqueName": "8rz1792673422372",
          "taxNumber": "23AAACC1206D2ZN",
          "stateCode": "MP"
        }
      ]
    }
  ]
}
```

---

## `GET /company/{c}/financial-year` — exact success

```json
{
  "status": "success",
  "body": {
    "companyUniqueName": "giddhain1792673422178091xos",
    "companyName": "Giddh Automation API DOC",
    "financialYearPeriod": "APR-MAR",
    "financialYears": [
      {
        "financialYearStarts": "01-04-2026",
        "financialYearEnds": "31-03-2027",
        "isLocked": false,
        "uniqueName": "FY-APR2026-MAR2027"
      }
    ]
  }
}
```

---

## `GET /company/{c}/entry-settings` — exact success

```json
{
  "status": "success",
  "body": {
    "duration": 0,
    "period": null,
    "noOfTransactions": 50,
    "toDate": null,
    "fromDate": null
  }
}
```

---

## `GET /ui/forms?formName=otherTaxes&country=IN` — exact success

```json
{
  "status": "success",
  "body": {
    "isTcsTdsApplicable": true
  }
}
```

---

## `GET /company/{c}/inventory-settings` — exact success

Full: [`responses/09-inventory-settings.json`](responses/09-inventory-settings.json)

---

## Other bootstrap GETs (saved as JSON only)

| Endpoint | File |
| --- | --- |
| `GET /company/{c}` | paste → `responses/02-company-get.json` (large; includes addresses.branches/warehouses) |
| `GET /company/{c}/ui_side_bar_items` | paste → `responses/03-ui-side-bar-items.json` |
| `GET /currency` | paste → `responses/04-currency.json` |
| `GET /company/{c}/settings` | paste → `responses/07-settings.json` |
| `GET /users/{user}` | paste → `responses/08-user.json` |
| `GET /country/IN` | paste → `responses/10-country-IN.json` |
| `GET /users/{user}/v2/companies` | paste → `responses/12-user-companies-v2.json` |

If you re-paste any of those JSON bodies in chat, I will write the files exactly.

---

## Postman collection plan (next)

1. Collection vars from `CONTEXT.md` + `secrets.local.json`.
2. Folder **00 Bootstrap** — create company (skip if company exists) → branch → company get → FY → settings.
3. Each request **Tests** tab:
   - `pm.test('success', () => pm.expect(pm.response.json().status).to.eql('success'))`
   - Save `body.uniqueName` / nested IDs into collection variables.
4. Folder **01 Master data** — accounts, stock (after we capture UI create payloads together).
5. Folder **02 Vouchers** — sales / purchase / payment / receipt.

Ready when you are: next paste either **Auth-Key** (preferred for collection) into `secrets.local.json`, or say “use Session-Id” and keep it local only — then we create the first customer/vendor account via API.
