import { Pipe, PipeTransform } from '@angular/core';
import { ClosingBalance } from '../../../../models/api-models/Search';

@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'recType'
})

export class RecTypePipe implements PipeTransform {
    public transform(value: ClosingBalance, category?: any) {
        if (!value) {
            if (category === "assets") {
                return ' Dr.';
            } else {
                return ' Cr.';
            }
        } else {
            if (!value?.amount) {
                if (category === "assets") {
                    return ' Dr.';
                } else {
                    return ' Cr.';
                }
            } else {
                switch (value.type) {
                    case 'DEBIT':
                        return ' Dr.';
                    case 'CREDIT':
                        return ' Cr.';
                }
            }
        }
    }
}
