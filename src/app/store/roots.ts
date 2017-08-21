import * as fromVerifyMobileReducer from './authentication/verifyMobile.reducer';
import { routerReducer, RouterState } from '@ngrx/router-store';
import * as fromHome from './home/home.reducer';
import * as fromPermission from './Permission/permission.reducer';
import * as fromManufacturing from './Manufacturing/manufacturing.reducer';
import * as fromLogin from './authentication/authentication.reducer';
import * as fromCompany from './Company/company.reducer';
import * as fromGroupAndAccounts from './GroupWithAccounts/groupwithaccounts.reducer';
import * as fromInventory from './Inventory/inventory.reducer';
import * as fromSearch from './Search/search.reducer';
import * as fromAuditLogs from './AuditLogs/audit-logs.reducer';
import * as fromFlyAccounts from './header/fly-accounts.reducer';
import * as fromTlPl from './tl-pl/tl-pl.reducer';
import * as fromLedger from './Ledger/ledger.reducer';
import * as fromSettings from './Settings/Settings.reducer';
import * as fromSales from './Sales/sales.reducer';

export interface AppState {
  router: RouterState;
  home: fromHome.HomeState;
  login: fromLogin.AuthenticationState;
  session: fromLogin.SessionState;
  company: fromCompany.CurrentCompanyState;
  sales: fromSales.SalesState;
  groupwithaccounts: fromGroupAndAccounts.CurrentGroupAndAccountState;
  verifyMobile: fromVerifyMobileReducer.VerifyMobileState;
  inventory: fromInventory.InventoryState;
  search: fromSearch.SearchState;
  auditlog: fromAuditLogs.AuditLogsState;
  permission: fromPermission.PermissionState;
  flyAccounts: fromFlyAccounts.FlyAccountsState;
  tlPl: fromTlPl.TBPlBsState;
  ledger: fromLedger.LedgerState;
  settings: fromSettings.SettingsState;
  manufacturing: fromManufacturing.ManufacturingState;
}

export const reducers = {
  router: routerReducer,
  home: fromHome.homeReducer,
  sales: fromSales.salesReducer,
  permission: fromPermission.PermissionReducer,
  settings: fromSettings.SettingsReducer,
  manufacturing: fromManufacturing.ManufacturingReducer,
  company: fromCompany.CompanyReducer,
  login: fromLogin.AuthenticationReducer,
  session: fromLogin.SessionReducer,
  groupwithaccounts: fromGroupAndAccounts.GroupsWithAccountsReducer,
  verifyMobile: fromVerifyMobileReducer.VerifyMobileReducer,
  inventory: fromInventory.InventoryReducer,
  search: fromSearch.searchReducer,
  auditlog: fromAuditLogs.auditLogsReducer,
  flyAccounts: fromFlyAccounts.FlyAccountsReducer,
  tlPl: fromTlPl.tbPlBsReducer,
  ledger: fromLedger.ledgerReducer
};
