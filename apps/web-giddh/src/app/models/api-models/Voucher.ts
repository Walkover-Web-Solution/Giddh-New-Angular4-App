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
