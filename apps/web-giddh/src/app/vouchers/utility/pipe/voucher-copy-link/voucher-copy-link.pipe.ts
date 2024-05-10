import { Pipe, PipeTransform } from "@angular/core";
import { VoucherTypeEnum } from "../../vouchers.const";
import { VouchersUtilityService } from "../../vouchers.utility.service";

@Pipe({
    name: 'voucherCopyLink',
    pure: true
})
export class VoucherCopyLinkPipe implements PipeTransform {

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
        let voucherName = this.vouchersUtilityService.getVoucherNameByType(voucherType, localeData);

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
