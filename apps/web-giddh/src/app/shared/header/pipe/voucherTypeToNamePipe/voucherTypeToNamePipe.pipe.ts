import { Pipe, PipeTransform } from '@angular/core';
import { VoucherTypeEnum } from '../../../../models/api-models/Sales';

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'voucherTypeToNamePipe',
    pure: true,
    standalone: false
})

/**
 * VoucherTypeToNamePipe pipe
 * Implements VoucherTypeToNamePipe functionality
 */
export class VoucherTypeToNamePipe implements PipeTransform {
    /**
     * Handles transform functionality
     */
    transform(value: VoucherTypeEnum, ...args: any[]): string {
        /**
         * Handles switch functionality
         */
        switch (value) {
            case VoucherTypeEnum.cash:
                return 'Cash';
            case VoucherTypeEnum.creditNote:
                return 'Credit Note';
            case VoucherTypeEnum.debitNote:
                return 'Debit Note';
            case VoucherTypeEnum.estimate:
            case VoucherTypeEnum.generateEstimate:
                return 'Estimate';
            case VoucherTypeEnum.generateProforma:
            case VoucherTypeEnum.proforma:
                return 'Proforma';
            case VoucherTypeEnum.sales:
                return 'Sales';
            case VoucherTypeEnum.purchase:
                return 'Purchase';
            default:
                return '';
        }
    }
}
