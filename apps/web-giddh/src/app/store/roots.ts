// COMMENTED OUT - MISSING: import * as fromVerifyMobileReducer from './authentication/verifyMobile.reducer';
import * as fromGeneral from './general/general.reducer';
// COMMENTED OUT - MISSING: import * as fromHome from './home/home.reducer';
// COMMENTED OUT - MISSING: import * as fromPermission from './permission/permission.reducer';
// COMMENTED OUT - MISSING: import * as fromManufacturing from './manufacturing/manufacturing.reducer';
import * as fromLogin from './authentication/authentication.reducer';
import * as fromCompany from './company/company.reducer';
// COMMENTED OUT - MISSING: import * as fromGroupAndAccounts from './group-with-accounts/groupwithaccounts.reducer';
// COMMENTED OUT - MISSING: import * as fromInventory from './inventory/inventory.reducer';
// COMMENTED OUT - MISSING: import * as fromSearch from './search/search.reducer';
// COMMENTED OUT - MISSING: import * as fromAuditLogs from './audit-logs/audit-logs.reducer';
// COMMENTED OUT - MISSING: import * as fromInvoice from './invoice/invoice.reducer';
// COMMENTED OUT - MISSING: import * as fromInvoiceTemp from './invoice/invoice.template.reducer';
// COMMENTED OUT - MISSING: import * as fromTlPl from './tl-pl/tl-pl.reducer';
// COMMENTED OUT - MISSING: import * as fromLedger from './ledger/ledger.reducer';
import * as fromSettings from './settings/Settings.reducer';
// COMMENTED OUT - MISSING: import * as fromSales from './sales/sales.reducer';
// COMMENTED OUT - MISSING: import * as fromInvoicePurchase from './invoice-purchase/invoice-purchase.reducer';
import * as fromUserSession from './general/session.reducer';
// COMMENTED OUT - MISSING: import * as fromInventoryInOut from './inventory-in-out/inventory-in-out.reducer';
// COMMENTED OUT - MISSING: import * as fromAgingReport from './aging-report/aging-report.reducer';
// COMMENTED OUT - MISSING: import * as fromInventoryBranchTransfer from './inventory-branch-transfer/InventoryBranchTransfer.reducer';
// COMMENTED OUT - MISSING: import * as fromReceipt from './invoice/Receipt/receipt.reducer';
// COMMENTED OUT - MISSING: import * as fromEwaybill from './invoice/ewaybill/eway-bill.reducer';
// COMMENTED OUT - MISSING: import * as fromGstReconcile from './gst-reconcile/GstReconcile.reducer';
// COMMENTED OUT - MISSING: import * as fromGstR from './gst-r/GstR.reducer';
// COMMENTED OUT - MISSING: import * as fromSubscriptions from './user-subscriptions/subscriptions.reducer';
// COMMENTED OUT - MISSING: import * as fromProforma from './proforma/proforma.reducer';
import * as fromCommon from './common/common.reducer';
// COMMENTED OUT - MISSING: import * as fromItemOnBoarding from './item-on-boarding/item-on-boarding.reducer';
// COMMENTED OUT - MISSING: import { fromWarehouse } from '../models/placeholder-types';
// COMMENTED OUT - MISSING: import * as fromPurchaseRecord from '../store/purchase-record/purchase-record.reducer';
// COMMENTED OUT - MISSING: import * as fromPurchaseOrder from '../store/purchase-order/purchase-order.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    general: fromGeneral.GeneralState;
    // COMMENTED OUT - MISSING: home: fromHome.HomeState;
    login: fromLogin.AuthenticationState;
    session: fromLogin.SessionState;
    branchConsolidated: fromLogin.IBranchConsolidatedState;
    company: fromCompany.CurrentCompanyState;
    // COMMENTED OUT - MISSING: sales: fromSales.SalesState;
    // COMMENTED OUT - MISSING: groupwithaccounts: fromGroupAndAccounts.CurrentGroupAndAccountState;
    // COMMENTED OUT - MISSING: verifyMobile: fromVerifyMobileReducer.VerifyMobileState;
    // COMMENTED OUT - MISSING: inventory: fromInventory.InventoryState;
    // COMMENTED OUT - MISSING: search: fromSearch.SearchState;
    // COMMENTED OUT - MISSING: auditlog: fromAuditLogs.AuditLogsState;
    // COMMENTED OUT - MISSING: permission: fromPermission.PermissionState;
    // COMMENTED OUT - MISSING: invoice: fromInvoice.InvoiceState;
    // COMMENTED OUT - MISSING: invoiceTemplate: fromInvoiceTemp.CustomTemplateState;
    // COMMENTED OUT - MISSING: tlPl: fromTlPl.TBPlBsState;
    // COMMENTED OUT - MISSING: ledger: fromLedger.LedgerState;
    settings: fromSettings.SettingsState;
    // COMMENTED OUT - MISSING: manufacturing: fromManufacturing.ManufacturingState;
    // COMMENTED OUT - MISSING: invoicePurchase: fromInvoicePurchase.InvoicePurchaseState;
    userLoggedInSessions: fromUserSession.SessionState;
    // COMMENTED OUT - MISSING: inventoryInOutState: fromInventoryInOut.InventoryInOutState;
    // COMMENTED OUT - MISSING: inventoryBranchTransfer: fromInventoryBranchTransfer.InventoryBranchTransferState;
    // COMMENTED OUT - MISSING: agingreport: fromAgingReport.AgingReportState;
    // COMMENTED OUT - MISSING: gstReconcile: fromGstReconcile.GstReconcileState;
    // COMMENTED OUT - MISSING: receipt: fromReceipt.ReceiptState;
    // COMMENTED OUT - MISSING: ewaybillstate: fromEwaybill.EwayBillState;
    // COMMENTED OUT - MISSING: gstR: fromGstR.GstRReducerState;
    // COMMENTED OUT - MISSING: subscriptions: fromSubscriptions.SubscriptionState;
    // COMMENTED OUT - MISSING: proforma: fromProforma.ProformaState;
    common: fromCommon.CurrentCommonState;
    // COMMENTED OUT - MISSING: itemOnboarding: fromItemOnBoarding.ItemOnBoardingState;
    // COMMENTED OUT - MISSING: warehouse: fromWarehouse.WarehouseState;
    // COMMENTED OUT - MISSING: purchaseRecord: fromPurchaseRecord.PurchaseRecordState;
    // COMMENTED OUT - MISSING: purchaseOrder: fromPurchaseOrder.PurchaseOrderState;
}

export const reducers: ActionReducerMap<AppState> = {
    general: fromGeneral.GeneRalReducer,
    // COMMENTED OUT - MISSING: home: fromHome.homeReducer,
    // COMMENTED OUT - MISSING: sales: fromSales.salesReducer,
    // COMMENTED OUT - MISSING: permission: fromPermission.PermissionReducer,
    settings: fromSettings.SettingsReducer,
    // COMMENTED OUT - MISSING: manufacturing: fromManufacturing.ManufacturingReducer,
    company: fromCompany.CompanyReducer,
    login: fromLogin.AuthenticationReducer,
    session: fromLogin.SessionReducer,
    branchConsolidated: fromLogin.BranchConsolidatedReducer,
    // COMMENTED OUT - MISSING: groupwithaccounts: fromGroupAndAccounts.GroupsWithAccountsReducer,
    // COMMENTED OUT - MISSING: verifyMobile: fromVerifyMobileReducer.VerifyMobileReducer,
    // COMMENTED OUT - MISSING: inventory: fromInventory.InventoryReducer,
    // COMMENTED OUT - MISSING: invoice: fromInvoice.InvoiceReducer,
    // COMMENTED OUT - MISSING: invoiceTemplate: fromInvoiceTemp.InvoiceTemplateReducer,
    // COMMENTED OUT - MISSING: search: fromSearch.searchReducer,
    // COMMENTED OUT - MISSING: auditlog: fromAuditLogs.auditLogsReducer,
    // COMMENTED OUT - MISSING: tlPl: fromTlPl.tbPlBsReducer,
    // COMMENTED OUT - MISSING: ledger: fromLedger.ledgerReducer,
    // COMMENTED OUT - MISSING: invoicePurchase: fromInvoicePurchase.InvoicePurchaseReducer,
    userLoggedInSessions: fromUserSession.SessionReducer,
    // COMMENTED OUT - MISSING: inventoryInOutState: fromInventoryInOut.InventoryInOutReducer,
    // COMMENTED OUT - MISSING: inventoryBranchTransfer: fromInventoryBranchTransfer.InventoryBranchTransferReducer,
    // COMMENTED OUT - MISSING: agingreport: fromAgingReport.agingReportReducer,
    // COMMENTED OUT - MISSING: receipt: fromReceipt.Receiptreducer,
    // COMMENTED OUT - MISSING: ewaybillstate: fromEwaybill.EwayBillreducer,
    // COMMENTED OUT - MISSING: gstReconcile: fromGstReconcile.GstReconcileReducer,
    // COMMENTED OUT - MISSING: gstR: fromGstR.GstRReducer,
    // COMMENTED OUT - MISSING: subscriptions: fromSubscriptions.SubscriptionReducer,
    // COMMENTED OUT - MISSING: proforma: fromProforma.ProformaReducer,
    common: fromCommon.CommonReducer,
    // COMMENTED OUT - MISSING: itemOnboarding: fromItemOnBoarding.itemOnBoardingReducer,
    // COMMENTED OUT - MISSING: warehouse: fromWarehouse.warehouseReducer,
    // COMMENTED OUT - MISSING: purchaseRecord: fromPurchaseRecord.purchaseRecordReducer,
    // COMMENTED OUT - MISSING: purchaseOrder: fromPurchaseOrder.purchaseOrderReducer
};
