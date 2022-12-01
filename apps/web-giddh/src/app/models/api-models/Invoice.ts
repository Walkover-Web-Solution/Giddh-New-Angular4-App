/**
 * Model for get invoices request
 * POST call
 * API:: company/:companyUniqueName/invoices?from,to
 * used to draw ui on invoice page
 */

import { ILedgerTransactionItem, ITotalItem } from '../interfaces/ledger.interface';
import { IPagination } from '../interfaces/paginatedResponse.interface';
import { AmountClassMulticurrency, OtherSalesItemClass, VoucherTypeEnum } from './Sales';
import { INameUniqueName } from './Inventory';

export interface IInvoiceResult {
    companyName: string;
    uniqueName: string;
    balanceStatus: string;
    invoiceNumber: string;
    invoiceDate: string;
    sealPath?: any;
    grandTotal: number;
    account: INameUniqueName;
    balanceDue: number;
    isSelected?: boolean;
    dueDate?: string;
}

export class CommonPaginatedRequest {
    public from?: string;
    public to?: string;
    public count?: number;
    public page?: number;
    public dateRange?: Date[];
    public size?: number;
    public totalItems?: number;
    public totalPages?: number;
    public status?: string;
    public sort?: string;
    public sortBy?: string;
    public branchUniqueName?: string;
}

export class InvoiceFilterClassForInvoicePreview extends CommonPaginatedRequest {
    public balanceMoreThan?: boolean;
    public balanceLessThan?: boolean;
    public balanceEqual?: boolean;
    public description?: string;
    public accountUniqueName?: string;
    public balanceDue?: string;
    public entryTotalBy?: string;
    public invoiceNumber?: string;
    public totalEqual: boolean;
    public totalLessThan: boolean;
    public totalMoreThan: boolean;
    public invoiceDateEqual?: boolean;
    public invoiceDateAfter?: boolean;
    public invoiceDateBefore?: boolean;
    public dueDateEqual: boolean;
    public dueDateAfter: boolean;
    public dueDateBefore: boolean;
    public invoiceDate: any;
    public dueDate: any;
    public voucherNumber: any;
    public balanceStatus?: string;
    public q: any;
    public sort: string;
    public sortBy: string;
    public type?: string;
    public count?: number;
    public page?: number;
    public total: string;
    public amountEquals?: boolean;
    public amountLessThan?: boolean;
    public amountGreaterThan?: boolean;
    public amountExclude?: boolean;
    public amount?: number;
    public amountFieldSelector?: number;
    public from?: string;
    public to?: string;
    public expireFrom?: string;
    public expireTo?: string;
    public purchaseOrderNumber?: any;
    public status?: string;
    public voucherDateEqual?: boolean;
    public voucherDateAfter?: boolean;
    public voucherDateBefore?: boolean;
    public voucherDate?: any;
}

export class InvoiceFilterClass extends CommonPaginatedRequest {
    public totalIsMore?: boolean;
    public totalIsLess?: boolean;
    public totalIsEqual?: boolean;
    public description?: string;
    public accountUniqueName?: string;
    public entryTotal?: string;
    public entryTotalBy?: string;
}

export interface ILedgersInvoiceResult {
    account: INameUniqueName;
    transactions: ILedgerTransactionItem[];
    description: string;
    total: ITotalItem;
    entryDate: string;
    uniqueName: string;
    isSelected?: boolean;
    invoiceNumber?: string;
    hasGenerationErr?: boolean;
    errMsg?: string;
    accountCurrencySymbol?: string;
    companyCurrencySymbol?: string;
    voucherType?: string;
    totalForCompany?: ITotalItem;
    totalTooltipText?: string;
}

export interface IBulkInvoiceGenerationFalingError {
    failedEntries: string[];
    successEntries?: string[];
    reason: string;
}

export interface GetAllLedgersForInvoiceResponse extends IPagination {
    size: number;
    results: ILedgersInvoiceResult[];
}

export class GetAllLedgersOfInvoicesResponse {
    public count: number;
    public page: number;
    public results: ILedgersInvoiceResult[];
    public size: number;
    public totalItems: number;
    public totalPages: number;
}

/**
 * Generate Bulk Invoice Request
 * method: 'POST'
 * url: '/company/:companyUniqueName/invoices/bulk-generate?combined=:combined'
 */

export class GenerateBulkInvoiceRequest {
    public accountUniqueName: string;
    public entries: string[];
}

export interface Template {
    uniqueName: string;
    template: string;
    sectionsV2: any[];
    sections: Sections;
    isDefault: boolean;
    name: string;
}

export interface TemplateData {
    email?: any;
    emailVerified?: any;
    account: Account;
    companyIdentities: CompanyIdentities;
    company: Company;
    terms: any[];
    taxes?: any;
    template?: any;
    invoiceDetails: InvoiceDetails;
    logo: Logo;
    totalAmount: TotalAmount;
    signature: Signature;
    entries?: any;
}

export interface Sections {
    logo: boolean;
    company: boolean;
    invoiceDetails: boolean;
    companyIdentities: boolean;
    account: boolean;
    signature: boolean;
    terms: boolean;
    entries: boolean;
    taxes: boolean;
    signatureType: string;
}

export interface CompanyIdentities {
    data: string;
}

export interface Company {
    name: string;
    data: any[];
}

export interface InvoiceDetails {
    invoiceNumber: string;
    invoiceDate: any;
    dueDate: any;
    shippingDate?: any;
}

export interface Logo {
    path: string;
}

export interface TotalAmount {
    subTotal?: any;
    taxTotal?: any;
    grandTotal?: any;
}

export interface Signature {
    name: string;
    data: string;
    path: string;
}

/**
 * Preview Invoice
 * method: 'POST'
 * url: '/company/:companyUniqueName'accounts/:accountUniqueName/invoices/preview''
 */

export class PreviewInvoiceRequest {
    public uniqueNames: string[];
}

export class PreviewInvoiceResponseClass {
    public logo: string;
    public company: Company;
    public customerName: string;
    public account: Account;
    public signature: Signature;
    public templateUniqueName: string;
    public roundOff: RoundOff;
    public balanceStatus: string;
    public balanceStatusSealPath: string;
    public commonDiscounts: any[];
    public entries: GstEntry[];
    public totalTaxableValue: number;
    public grandTotal: number;
    public totalInWords?: any;
    public subTotal: number;
    public totalDiscount: number;
    public totaltaxBreakdown: TotaltaxBreakdown[];
    public totalTax?: any;
    public invoiceDetails: InvoiceDetails;
    public other?: OtherSalesItemClass;
    public dataPreview?: string;
    public uniqueName?: string;
}

export interface TotaltaxBreakdown {
    amount: number;
    visibleTaxRate: number;
    accountName: string;
    accountUniqueName: string;
    hasError: boolean;
    taxRate: number;
    errorMessage: string;
}

export interface RoundOff {
    transaction: Transaction;
    uniqueName: string;
    isTransaction: boolean;
    balanceType: string;
}

export interface Account {
    name: string;
    uniqueName: string;
    data: string[];
    attentionTo: string;
    email: string;
    mobileNumber?: any;
    shippingDetails: IGstDetails;
    billingDetails: IGstDetails;
}

export interface ICommonItemOfTransaction {
    amount: number;
    accountUniqueName: string;
    accountName: string;
}

export interface Transaction extends ICommonItemOfTransaction {
    discount: any[];
    description: string;
}

export interface IInvoiceTransaction extends ICommonItemOfTransaction {
    hsnNumber?: any;
    sacNumber?: any;
    description: string;
    quantity?: any;
    stockUnit?: any;
    rate?: any;
}

export interface Tax extends ICommonItemOfTransaction {
    hasError: boolean;
    visibleTaxRate: number;
    taxRate: number;
    errorMessage: string;
}

export interface IInvoiceTax extends ICommonItemOfTransaction {
    rate: number;
    uniqueName: string;
    type?: string;
}

export interface GstEntry {
    uniqueName: string;
    discounts: ICommonItemOfTransaction[];
    taxes: IInvoiceTax[];
    transactions: IInvoiceTransaction[];
    description: string;
    taxableValue: number;
    entryTotal: number;
    entryDate?: any;
}

export interface IGstDetails {
    gstNumber?: any;
    address: string[];
    addressStr?: string;
    stateCode?: any;
    panNumber?: any;
    stateName?: any;
}

export interface GstTaxesTotal {
    uniqueName: string;
    name: string;
    total: number;
}

export interface GstDetails {
    gstEntries: GstEntry[];
    companyGstDetails: IGstDetails;
    accountGstBillingDetails: IGstDetails;
    accountGstShippingDetails: IGstDetails;
    gstTaxableValueTotal: number;
    gstEntriesTotal: number;
    gstTaxesTotal: GstTaxesTotal[];
    showTaxes: boolean;
    showDiscount: boolean;
    showHsn: boolean;
    showSac: boolean;
    showQty: boolean;
    showRate: boolean;
}

/**
 * Generate Invoice model
 */
export class GenerateInvoiceRequestClass {
    public uniqueNames: string[];
    public validateTax: boolean;
    public invoice: any;
    public updateAccountDetails: boolean;
    public voucher?: any;
}

export class GenBulkInvoiceGroupByObj {
    public accUniqueName: any;
    public uniqueName: any;
}

export class GenBulkInvoiceFinalObj {
    public accountUniqueName: string;
    public entries: string[];
}

export class GenerateBulkInvoiceObject {
    public entryUniqueNames: string[];
}

/*
* Get invoice template details response model
*/
export class GetInvoiceTemplateDetailsResponse {
    public sections: ISection;
    public isDefault: boolean;
    public isSample: boolean;
    public uniqueName: string;
    public name: string;
}

// check if use other wise remove
export interface InvoiceTemplateDetailsResponse {
    sample?: any;
    color: string;
    sections: ISection;
    isDefault: boolean;
    fontSize: string;
    font: string;
    topMargin: number;
    leftMargin: number;
    rightMargin: number;
    bottomMargin: number;
    logoPosition: string;
    logoSize: string;
    uniqueName: string;
    name: string;
}

export interface ISection {
    header: {
        data: any;
    };
    table: {
        data: any;
    };
    footer: {
        data: any;
    };
}

export interface IContentCommon {
    display: boolean;
    label: string;
}

export interface IContent extends IContentCommon {
    field: string;
    width?: string;
}

//////////// NEW //////////////
export interface CreatedBy {
    name: string;
    email: string;
    uniqueName: string;
    mobileNo: string;
}

export interface UpdatedBy {
    name: string;
    email: string;
    uniqueName: string;
    mobileNo: string;
}

export class CustomTemplateResponse {
    public createdBy: CreatedBy;
    public uniqueName: string;
    public fontSize: any;
    public fontMedium?: any;
    public fontLarge?: any;
    public fontDefault?: any;
    public fontSmall?: any;
    public createdAt: string;
    public updatedAt: string;
    public updatedBy: UpdatedBy;
    public sample?: any;
    public templateColor: string; // design
    public tableColor: string; // design
    public font: string; // design
    public topMargin: number; // design
    public leftMargin: number; // design
    public rightMargin: number; // design
    public bottomMargin: number; // design
    public logoPosition: string;
    public logoSize: string; // design
    public isDefault: boolean;
    public isDefaultForVoucher: boolean;
    public sections: ISection; // done
    public name: string;
    public copyFrom?: string; // done
    public logoUniqueName?: string;
    public templateType?: string;
    public type?: string;
}

export class Esignature {
    public File: string;
    public Name: string = 'companyName';
    public SelectPage: string = 'LAST';
    public ReferenceNumber: string = '';
    public AadhaarNumber: string = '';
    public SignatureType: string = '1';
    public SignaturePosition: string = 'Customize';
    public authToken: string = 'YkvC7sGkgLDNT67ZvxCXg7t2Cy0FjUI8QTSh44QWo+Y=';
    public PageNumber: string = '';
    public FileType: string = 'PDF';
    public PreviewRequired: boolean = true;
    public CustomizeCoordinates: string = '420,200,540,150';
    public PagelevelCoordinates: string = '';
    public UploadSignatureOption: boolean = true;
    public SelectFontOption: boolean = true;
    public DrawSignatureOption: boolean = true;
    public eSignaturePadOption: boolean = true;
    public SUrl: string = 'https://esign.giddh.com/Fu59xHxuPsQFWEy4zhwB/';
    public FUrl: string = 'https://esign.giddh.com/fxaLuXqhG9GhvCezvqMp/';
    public CUrl: string = 'https://esign.giddh.com/fxaLuXqhG9GhvCezvqMp/';
}

export class EwayBillLogin {
    public userName: string;
    public password: string;
    public gstIn: string;
}

export class GenerateEwayBill {
    public supplyType: string;
    public subSupplyType: string;
    public transMode: string;
    public toPinCode: string;
    public transDistance: string;
    public invoiceNumber: string;
    public transporterName?: string;
    public transporterId?: string;
    public transDocNo?: string;
    public transDocDate?: string;
    public vehicleNo: string;
    public vehicleType: string;
    public transactionType: string;
    public docType: string;
    public toGstIn: string;
    public uniqueName: string;
}

export class UpdateEwayVehicle {
    public ewbNo: string;
    public vehicleNo: string;
    public fromPlace: string;
    public fromState: string;
    public reasonCode: string;
    public reasonRem: string;

    public transDocNo?: string;
    public transDocDate?: string;
    public transMode: string;
    public vehicleType: string;
}

export interface Account {
    uniqueName: string;
    accountType?: any;
    name: string;
}

export interface SelectedInvoices {
    account: Account;
    balanceDue: number;
    balanceStatus: string;
    dueDate: string;
    dueDays: number;
    grandTotal: number;
    isSelected: boolean;
    uniqueName: string;
    voucherDate: string;
    voucherNumber: string;
}

export interface ItemList {
    itemNo: string;
    productId: string;
    productName: string;
    productDesc: string;
    hsnCode: number;
    quantity: number;
    qtyUnit: string;
    taxableAmount: number;
    sgstRate: number;
    cgstRate: number;
    igstRate: number;
    cessRate: number;
    cessAdvol: string;
}

export interface IEwayBillGenerateResponse {
    ewayBillDate: string;
    genMode: string;
    userGstin: string;
    supplyType: string;
    subSupplyType: string;
    docType: string;
    docNo: string;
    docDate: string;
    fromGstin: string;
    fromTrdName: string;
    fromAddr1: string;
    fromAddr2: string;
    fromPlace: string;
    fromPincode: string;
    fromStateCode: string;
    actFromStateCode: string;
    actToStateCode: string;
    toGstin: string;
    toTrdName: string;
    toAddr1: string;
    toAddr2: string;
    toPlace: string;
    toPincode: string;
    toStateCode: string;
    totInvValue: string;
    totalValue: string;
    transporterId: string;
    transporterName: string;
    status: string;
    actualDist: string;
    noValidDays: string;
    validUpto: string;
    extendedTimes: string;
    rejectStatus: string;
    vehicleType: string;
    cgstValue: string;
    sgstValue: string;
    igstValue: string;
    cessValue: string;
    transMode?: any;
    itemList: ItemList[];
    vehiclListDetails?: any;
}

export interface Result {
    ewbNo: string;
    ewayBillDate: string;
    docNumber: string;
    invoiceDate: string;
    customerName: string;
    customerGstin: string;
    totalValue: string;
    isManuallyGenerated?: boolean;
    isValidated?: boolean;
}

export interface IEwayBillAllList {
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    results: Result[];
    size: number;
    fromDate?: any;
    toDate?: any;
}

export interface IAllTransporterDetails {
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    results: IEwayBillTransporter[];
    size: number;
}

export interface IEwayBillTransporter {
    transporterId: string;
    transporterName: string;
}

export interface IEwayBillCancel {
    ewbNo: string;
    cancelRsnCode: string;
    cancelRmrk: string;
}

export class IEwayBillfilter {
    sort?: string;
    sortBy?: string;
    searchTerm?: string;
    searchOn?: string;
    fromDate?: any;
    toDate?: any;
    page?: number;
    count?: number;
    branchUniqueName?: string;
    gstin?: string;
}

export class InvoicePreviewDetailsVm {
    uniqueName: string;
    voucherNumber: string;
    account: INameUniqueName;
    grandTotal: number;
    voucherType: VoucherTypeEnum;
    voucherDate: string;
    blob?: Blob;
    voucherStatus?: string;
    accountCurrencySymbol?: string;
    hasAttachment?: boolean;
    balanceDue?: AmountClassMulticurrency;
}

export class InvoicePaymentRequest {
    accountUniqueName: string;
    action?: string;
    amount: string;
    chequeClearanceDate?: string | Date;
    chequeNumber?: string;
    paymentDate: string | Date;
    tagUniqueName?: string;
    description?: string;
    uniqueName?: string;
}
