import { Pipe, PipeTransform } from '@angular/core';

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'orderByDate',
    pure: true
})
/**
 * DateOrderPipe pipe
 * Implements DateOrderPipe functionality
 */
export class DateOrderPipe implements PipeTransform {
    /**
     * Handles transform functionality
     */
    transform(value: any[], sortBy: string): any {
        /**
         * Handles if functionality
         */
        if (value) {
            return value.sort((a, b) => {
                /**
                 * Handles if functionality
                 */
                if (!a[sortBy]) {
                    throw new Error(`Incorrect orderByDate property`);
                }

                const dateA = new Date(a[sortBy]).getTime();
                const dateB = new Date(b[sortBy]).getTime();
                return dateB - dateA;
            });
        }
    }
}
