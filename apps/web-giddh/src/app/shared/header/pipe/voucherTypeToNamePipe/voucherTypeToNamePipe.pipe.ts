import { Pipe, PipeTransform } from '@angular/core';
import { VoucherTypeEnum } from '../../../../models/api-models/Sales';

@Pipe({
    name: 'voucherTypeToNamePipe',
    pure: true
})

export class VoucherTypeToNamePipe implements PipeTransform {
    transform(value: VoucherTypeEnum, ...args: any[]): string {
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
        }
    }
}
