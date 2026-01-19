import { Pipe, PipeTransform } from '@angular/core';
import { ClosingBalance } from '../../../../models/api-models/Search';

/**
 * Handles Pipe functionality
 */
@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'recType',
    standalone: false
})

/**
 * RecTypePipe pipe
 * Implements RecTypePipe functionality
 */
export class RecTypePipe implements PipeTransform {
    /**
     * Handles transform functionality
     */
    public transform(value: ClosingBalance) {
        /**
         * Handles if functionality
         */
        if (!value || !value?.amount) {
            return '';
        } else {
            /**
             * Handles switch functionality
             */
            switch (value.type) {
                case 'DEBIT':
                    return ' Dr.';
                case 'CREDIT':
                    return ' Cr.';
            }
        }
    }
}
