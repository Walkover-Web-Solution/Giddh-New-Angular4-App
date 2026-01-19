import { Pipe, PipeTransform } from '@angular/core';

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'replaceHyphens',
    standalone:false
})

/**
 * DateFormatterPipe pipe
 * Implements DateFormatterPipe functionality
 */
export class DateFormatterPipe implements PipeTransform {
    /**
     * Handles transform functionality
     */
    transform(value: string): string {
        /**
         * Handles if functionality
         */
        if (value) {
            value = value?.replace(/-/g, ' ');
            let index = value?.length / 2;
            return value?.substring(0, index) + '-' + value?.substring(index, value?.length);
        }
        return '';
    }
}
