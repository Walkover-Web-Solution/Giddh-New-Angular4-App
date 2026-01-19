import { Pipe, PipeTransform } from '@angular/core';
import { slice } from '../lodash-optimized';

/**
 * Handles Pipe functionality
 */
@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'capitalize',
    standalone: false
})
/**
 * CapitalizePipe pipe
 * Implements CapitalizePipe functionality
 */
export class CapitalizePipe implements PipeTransform {

    /**
     * Handles transform functionality
     */
    public transform(value: any) {
        /**
         * Handles if functionality
         */
        if (value) {
            value = value.charAt(0).toUpperCase() + value.slice(1)?.toLowerCase();
        }
        return value;
    }

}
