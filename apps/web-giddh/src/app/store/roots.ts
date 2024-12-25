import * as fromVerifyMobileReducer from './authentication/verifyMobile.reducer';
import * as fromGeneral from './general/general.reducer';
import * as fromHome from './home/home.reducer';
import * as fromPermission from './permission/permission.reducer';
import * as fromManufacturing from './manufacturing/manufacturing.reducer';
import * as fromLogin from './authentication/authentication.reducer';
import * as fromCompany from './company/company.reducer';
import * as fromGroupAndAccounts from './group-with-accounts/groupwithaccounts.reducer';
import * as fromInventory from './inventory/inventory.reducer';
import * as fromSearch from './search/search.reducer';
import * as fromAuditLogs from './audit-logs/audit-logs.reducer';
import * as fromInvoice from './invoice/invoice.reducer';
import * as fromInvoiceTemp from './invoice/invoice.template.reducer';
import * as fromTlPl from './tl-pl/tl-pl.reducer';
import * as fromLedger from './ledger/ledger.reducer';
import * as fromSettings from './settings/Settings.reducer';
import * as fromSales from './sales/sales.reducer';
import * as fromInvoicePurchase from './invoice-purchase/invoice-purchase.reducer';
import * as fromUserSession from './general/session.reducer';
import * as fromInventoryInOut from './inventory-in-out/inventory-in-out.reducer';
import * as fromAgingReport from './aging-report/aging-report.reducer';
import * as fromInventoryBranchTransfer from './inventory-branch-transfer/InventoryBranchTransfer.reducer';
import * as fromReceipt from './invoice/Receipt/receipt.reducer';
import * as fromEwaybill from './invoice/ewaybill/eway-bill.reducer';
import * as fromGstReconcile from './gst-reconcile/GstReconcile.reducer';
import * as fromGstR from './gst-r/GstR.reducer';
import * as fromSubscriptions from './user-subscriptions/subscriptions.reducer';
import * as fromProforma from './proforma/proforma.reducer';
import * as fromCommon from './common/common.reducer';
import * as fromItemOnBoarding from './item-on-boarding/item-on-boarding.reducer';
import * as fromWarehouse from '../settings/warehouse/reducer/warehouse.reducer';
import * as fromPurchaseRecord from '../store/purchase-record/purchase-record.reducer';
import * as fromPurchaseOrder from '../store/purchase-order/purchase-order.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
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
    invoice: fromInvoice.InvoiceState;
    invoiceTemplate: fromInvoiceTemp.CustomTemplateState;
    tlPl: fromTlPl.TBPlBsState;
    ledger: fromLedger.LedgerState;
    settings: fromSettings.SettingsState;
    manufacturing: fromManufacturing.ManufacturingState;
    invoicePurchase: fromInvoicePurchase.InvoicePurchaseState;
    userLoggedInSessions: fromUserSession.SessionState;
    inventoryInOutState: fromInventoryInOut.InventoryInOutState;
    inventoryBranchTransfer: fromInventoryBranchTransfer.InventoryBranchTransferState;
    agingreport: fromAgingReport.AgingReportState;
    gstReconcile: fromGstReconcile.GstReconcileState;
    receipt: fromReceipt.ReceiptState;
    ewaybillstate: fromEwaybill.EwayBillState;
    gstR: fromGstR.GstRReducerState;
    subscriptions: fromSubscriptions.SubscriptionState;
    proforma: fromProforma.ProformaState
    common: fromCommon.CurrentCommonState,
    itemOnboarding: fromItemOnBoarding.ItemOnBoardingState
    warehouse: fromWarehouse.WarehouseState,
    purchaseRecord: fromPurchaseRecord.PurchaseRecordState,
    purchaseOrder: fromPurchaseOrder.PurchaseOrderState
}

export const reducers: ActionReducerMap<AppState> = {
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
    tlPl: fromTlPl.tbPlBsReducer,
    ledger: fromLedger.ledgerReducer,
    invoicePurchase: fromInvoicePurchase.InvoicePurchaseReducer,
    userLoggedInSessions: fromUserSession.SessionReducer,
    inventoryInOutState: fromInventoryInOut.InventoryInOutReducer,
    inventoryBranchTransfer: fromInventoryBranchTransfer.InventoryBranchTransferReducer,
    agingreport: fromAgingReport.agingReportReducer,
    receipt: fromReceipt.Receiptreducer,
    ewaybillstate: fromEwaybill.EwayBillreducer,
    gstReconcile: fromGstReconcile.GstReconcileReducer,
    gstR: fromGstR.GstRReducer,
    subscriptions: fromSubscriptions.SubscriptionReducer,
    proforma: fromProforma.ProformaReducer,
    common: fromCommon.CommonReducer,
    itemOnboarding: fromItemOnBoarding.itemOnBoardingReducer,
    warehouse: fromWarehouse.warehouseReducer,
    purchaseRecord: fromPurchaseRecord.purchaseRecordReducer,
    purchaseOrder: fromPurchaseOrder.purchaseOrderReducer
};
