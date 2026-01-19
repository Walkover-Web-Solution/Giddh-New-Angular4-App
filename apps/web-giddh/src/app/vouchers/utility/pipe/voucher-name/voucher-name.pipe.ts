import { Pipe, PipeTransform } from "@angular/core";
import { VouchersUtilityService } from "../../vouchers.utility.service";

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'voucherName',
    pure: true,
    standalone:false
})
/**
 * VoucherNamePipe pipe
 * Implements VoucherNamePipe functionality
 */
export class VoucherNamePipe implements PipeTransform {

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
     * @memberof VoucherNamePipe
     */
    transform(voucherType: string, localeData: any): string {
        return this.vouchersUtilityService.getVoucherNameByType(voucherType, localeData);
    }
}
