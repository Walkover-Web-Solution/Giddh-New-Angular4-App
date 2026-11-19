# DocStar draft — Sales Person (written, not published)

Private collection **Giddh API Draft** (`Qu2nsC5BQofh`, org `12427`).  
Section page `JA6_Fan793Ji` · state `1` · not published. https://giddh.com/api is unchanged.

## Sidebar

```
Sales Person
├── Get All Sales Persons
├── Create Sales Person
├── Get Sales Person
├── Update Sales Person
├── Delete Sales Person
└── Archive Sales Person
```

These six APIs are one menu because they all act on `/company/{companyUniqueName}/salesperson`.

## Auth (verified)

`SalesPersonController` is not on the public exclude list in `InterceptorConfig`. `ApiInterceptor` accepts **Auth-Key or Session-Id**. One is required. Both blank → HTTP 400 `MISSING_HEADER`.

## Endpoints

| Draft | Method | What it does |
| --- | --- | --- |
| Get All Sales Persons `nrJOFlGnLlsf` | GET `/salesperson` | List people. `page`, `count`, `archive`. Success: capture `1079`. |
| Create Sales Person `l7H12ZR_Uc7A` | POST `/salesperson` | `name`, `email`, `mobileNumber` must be present. Success: capture `975` (201). Fail: name required. |
| Get Sales Person `O2b6jldSKkdG` | GET `/salesperson/{uniqueName}` | One person. Success: capture `976`. Fail: not found. |
| Update Sales Person `fyh6g6UftT9i` | PUT `/salesperson/{uniqueName}` | Change name, email, or mobile. Success: capture `977`. |
| Delete Sales Person `iV2bOwvFAM95` | DELETE `/salesperson/{uniqueName}` | Fails if linked to an account or voucher. Success text is from the controller message file (no saved delete capture). |
| Archive Sales Person `ntxW2V3_mb56` | POST `/salesperson/{uniqueName}/archive` | Body `action` + `archiveOnly`. Success: capture `978`. Fail: action required when accounts are assigned. |
