import { Pipe, PipeTransform } from "@angular/core";
import { VouchersUtilityService } from "../../vouchers.utility.service";

@Pipe({
    name: 'voucherName',
    pure: true
})
export class VoucherNamePipe implements PipeTransform {

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
     * @memberof VoucherNamePipe
     */
    transform(voucherType: string, localeData: any): string {
        return this.vouchersUtilityService.getVoucherNameByType(voucherType, localeData);
    }
}
