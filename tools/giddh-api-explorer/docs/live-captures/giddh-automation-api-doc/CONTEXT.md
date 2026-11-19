# Context: Giddh Automation API DOC

Captured: 2026-10-22 (IST) from `apitest.giddh.com` after create-company + page reload.

## Identifiers (safe to commit)

```json
{
  "baseUrl": "https://api.giddh.com",
  "origin": "https://test.giddh.com",
  "company": {
    "name": "Giddh Automation API DOC",
    "uniqueName": "giddhain1792673422178091xos",
    "portalDomain": "GiddhAutomationAPIDOC",
    "baseCurrency": "INR",
    "businessType": "Registered",
    "businessNature": "Retail",
    "voucherVersion": 2,
    "planVersion": 2
  },
  "branch": {
    "name": "Giddh Automation API DOC",
    "uniqueName": "giddhautomationapidoc",
    "alias": "Gidd",
    "defaultBranch": true
  },
  "warehouse": {
    "name": "Gidd warehouse",
    "uniqueName": "xbq1792673424418",
    "isDefault": true
  },
  "address": {
    "name": "Default Address",
    "uniqueName": "8rz1792673422372",
    "taxNumber": "23AAACC1206D2ZN",
    "stateCode": "MP",
    "pincode": "484224",
    "taxType": "GSTIN",
    "isDefault": true
  },
  "financialYear": {
    "uniqueName": "FY-APR2026-MAR2027",
    "financialYearStarts": "01-04-2026",
    "financialYearEnds": "31-03-2027",
    "financialYearPeriod": "APR-MAR",
    "isLocked": false
  },
  "subscription": {
    "subscriptionId": "SUB-20261022-5",
    "planUniqueName": "ltv1768484147685",
    "planName": "WhiteLabelPlan"
  },
  "user": {
    "uniqueName": "divyanshu@whozzat.com",
    "email": "divyanshu@whozzat.com"
  },
  "voucherApiNote": "ALWAYS pass voucherVersion=2 on all accounting-microservice APIs for this company",
  "entityRegistry": "ENTITY-REGISTRY.json",
  "agentPlaybook": "AGENT-KNOWLEDGE.md"
}
```

Full created masters + vouchers: [`ENTITY-REGISTRY.json`](ENTITY-REGISTRY.json).  
Playbook: [`AGENT-KNOWLEDGE.md`](AGENT-KNOWLEDGE.md) · Index: [`MASTER-DATA.md`](MASTER-DATA.md).



## Auth (local only)

Put into `secrets.local.json` (gitignored):

```json
{
  "sessionId": "<paste Session-Id header>",
  "authKey": "<optional Auth-Key if you prefer API key over session>"
}
```

Do **not** commit session or auth keys.

## Bootstrap captures in this folder

| # | Method | Path | File |
| --- | --- | --- | --- |
| 00 | POST | `/company` | `responses/00-create-company.json` |
| 01 | GET | `/company/{c}/branch?hierarchyType=flatten` | `responses/01-branch-flatten.json` |
| 02 | GET | `/company/{c}` | `responses/02-company-get.json` |
| 03 | GET | `/company/{c}/ui_side_bar_items` | `responses/03-ui-side-bar-items.json` |
| 04 | GET | `/currency` | `responses/04-currency.json` |
| 05 | GET | `/company/{c}/financial-year` | `responses/05-financial-year.json` |
| 06 | GET | `/company/{c}/entry-settings` | `responses/06-entry-settings.json` |
| 07 | GET | `/company/{c}/settings` | `responses/07-settings.json` |
| 08 | GET | `/users/{user}` | `responses/08-user.json` |
| 09 | GET | `/company/{c}/inventory-settings` | `responses/09-inventory-settings.json` |
| 10 | GET | `/country/IN` | `responses/10-country-IN.json` |
| 11 | GET | `/ui/forms?formName=otherTaxes&country=IN` | `responses/11-ui-forms-otherTaxes.json` |
| 12 | GET | `/users/{user}/v2/companies` | `responses/12-user-companies-v2.json` |

Exact success examples for MD/Postman are in `BOOTSTRAP-EXACT-RESPONSES.md` (smaller endpoints inlined; large ones linked to JSON).
