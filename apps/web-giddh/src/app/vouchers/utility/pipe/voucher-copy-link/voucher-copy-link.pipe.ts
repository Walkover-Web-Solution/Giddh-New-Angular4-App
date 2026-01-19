import { Pipe, PipeTransform } from "@angular/core";
import { VoucherTypeEnum } from "../../vouchers.const";
import { VouchersUtilityService } from "../../vouchers.utility.service";

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'voucherCopyLink',
    pure: true,
    standalone:false
})
/**
 * VoucherCopyLinkPipe pipe
 * Implements VoucherCopyLinkPipe functionality
 */
export class VoucherCopyLinkPipe implements PipeTransform {

    /**
     * Creates an instance of pipe
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private vouchersUtilityService: VouchersUtilityService
    ) {

    }

    /**
     * Returns voucher name based on voucher type
     *
     * @param {string} voucherType
     * @param {*} localeData
     * @return {*}  {string}
     * @memberof VoucherCopyLinkPipe
     */
    transform(voucherType: string, localeData: any): string {
        let copyText = "";
        let voucherName = this.vouchersUtilityService.getVoucherNameByType(voucherType, localeData, true);

        /**
         * Handles switch functionality
         */
        switch (voucherType) {
            case VoucherTypeEnum.debitNote:
            case VoucherTypeEnum.creditNote:
                copyText = localeData?.copy_previous_dr_cr;
                break;

            default:
                copyText = localeData?.copy_previous_invoices;
                break;
        }

        return copyText?.replace("[INVOICE_TYPE]", voucherName);
    }
}
