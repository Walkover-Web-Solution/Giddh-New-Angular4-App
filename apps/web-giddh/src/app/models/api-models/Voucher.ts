import { INameUniqueName } from "./Inventory";
import { ReceiptItem } from "./recipt";

/** Voucher form modal to toogle fields and make the form dynamic */
export class VoucherForm {
    /** Stores the type of voucher */
    public type: string;
    /** True, if the voucher supports to be converted to advance receipt (for eg - Receipt voucher) */
    public advanceReceiptAllowed: boolean;
    /** True, if the voucher supports to be converted to RCM (for eg - Purchase Bill (PB) voucher) */
    public rcmAllowed: boolean;
    /** True, if the voucher supports to have the deposit during creation (for eg - Sales/Cash/PB) */
    public depositAllowed: boolean;
    /** True, if the voucher supports to have taxes */
    public taxesAllowed: boolean;
    /** True, if the voucher supports to have quantity (Receipt voucher doesn't need quantity as only Cash/Bank accounts are involved) */
    public quantityAllowed: boolean;
    /** True, if the voucher supports to have rate (Receipt voucher doesn't need rate as only Cash/Bank accounts are involved) */
    public rateAllowed: boolean;
    /** True, if the voucher supports to have discount */
    public discountAllowed: boolean;
    /** True, if the voucher supports to have billing/shipping address  */
    public addressAllowed: boolean;
    /** True, if the voucher supports to have other details */
    public otherDetails: boolean;
    /** True, if the voucher supports to have due date */
    public dueDate: boolean;
    /** True, if the voucher supports to have attachment (for eg - Purchase Bill (PB) voucher) */
    public attachmentAllowed: boolean;
}

export interface OptionInterface {
    value: string;
    label: string;
    disabled?: boolean;
    additional?: any;
}

export class LastInvoices {
    voucherNumber: string;
    account: INameUniqueName;
    grandTotal: any;
    date: string;
    uniqueName?: string;
}

export interface LastVouchersResponse {
    items?: any[];
    page?: number;
    count?: number;
    totalPages?: number;
    totalItems?: number;
}