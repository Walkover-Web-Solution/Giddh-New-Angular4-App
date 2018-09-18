import * as fromVerifyMobileReducer from './authentication/verifyMobile.reducer';
import * as fromRouter from '@ngrx/router-store';
import * as fromGeneral from './General/general.reducer';
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
import * as fromInvoice from './Invoice/invoice.reducer';
import * as fromInvoiceTemp from './Invoice/invoice.template.reducer';
import * as fromTlPl from './tl-pl/tl-pl.reducer';
import * as fromLedger from './Ledger/ledger.reducer';
import * as fromSettings from './Settings/Settings.reducer';
import * as fromSales from './Sales/sales.reducer';
import * as fromInvoicePurchase from './invoice-purchase/invoice-purchase.reducer';
import * as fromDayBook from './Daybook/daybook.reducer';
import * as fromNewVsOldInvoices from './new-vs-old-invoices/new-vs-old-invoices.reducer';
import * as fromUserSession from './General/session.reducer';
import * as fromImportExcel from './import-excel/import-excel.reducer';
import * as fromInventoryInOut from './Inventory-in-out/inventory-in-out.reducer';
import * as fromAgingReport from './AgingReport/aging-report.reducer';
import * as fromInventoryBranchTransfer from './InventoryBranchTransfer/InventoryBranchTransfer.reducer';
import * as fromCompanyImportExport from './CompanyImportExport/companyImportExport';
import * as fromReceipt from './Invoice/Receipt/receipt.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  router: fromRouter.RouterReducerState;
  general: fromGeneral.GeneralState;
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
  invoice: fromInvoice.InvoiceState;
  invoiceTemplate: fromInvoiceTemp.CustomTemplateState;
  tlPl: fromTlPl.TBPlBsState;
  ledger: fromLedger.LedgerState;
  settings: fromSettings.SettingsState;
  manufacturing: fromManufacturing.ManufacturingState;
  invoicePurchase: fromInvoicePurchase.InvoicePurchaseState;
  daybook: fromDayBook.Daybook;
  userLoggedInSessions: fromUserSession.SessionState;
  importExcel: fromImportExcel.ImportExcelState;
  inventoryInOutState: fromInventoryInOut.InventoryInOutState;
  inventoryBranchTransfer: fromInventoryBranchTransfer.InventoryBranchTransferState;
  newVsOldInvoices: fromNewVsOldInvoices.NewVsOldInvoiceState;
  agingreport: fromAgingReport.AgingReportState;
  companyImportExport: fromCompanyImportExport.CompanyImportExportState;
  receipt: fromReceipt.ReceiptState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  general: fromGeneral.GeneRalReducer,
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
  invoice: fromInvoice.InvoiceReducer,
  invoiceTemplate: fromInvoiceTemp.InvoiceTemplateReducer,
  search: fromSearch.searchReducer,
  auditlog: fromAuditLogs.auditLogsReducer,
  flyAccounts: fromFlyAccounts.FlyAccountsReducer,
  tlPl: fromTlPl.tbPlBsReducer,
  ledger: fromLedger.ledgerReducer,
  invoicePurchase: fromInvoicePurchase.InvoicePurchaseReducer,
  daybook: fromDayBook.daybookReducer,
  userLoggedInSessions: fromUserSession.SessionReducer,
  inventoryInOutState: fromInventoryInOut.InventoryInOutReducer,
  importExcel: fromImportExcel.importExcelReducer,
  inventoryBranchTransfer: fromInventoryBranchTransfer.InventoryBranchTransferReducer,
  newVsOldInvoices: fromNewVsOldInvoices.newVsOldInvoicesReduce,
  agingreport: fromAgingReport.agingReportReducer,
  companyImportExport: fromCompanyImportExport.companyImportExportReducer,
  receipt: fromReceipt.Receiptreducer
};
