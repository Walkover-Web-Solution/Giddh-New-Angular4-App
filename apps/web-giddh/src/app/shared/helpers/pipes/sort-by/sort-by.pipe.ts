import { Pipe, PipeTransform } from '@angular/core';

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'sortBy',
    standalone: false
})
/**
 * SortByPipe pipe
 * Implements SortByPipe functionality
 */
export class SortByPipe implements PipeTransform {
    /**
     * Handles transform functionality
     */
    public transform(array: string[], args?: any): any {
        /**
         * Handles if functionality
         */
        if (array) {
            let sortField = args[0]; // the field we want to sort by
            array.sort((a: any, b: any) => {
                /**
                 * Handles if functionality
                 */
                if (a[sortField] < b[sortField]) {
                    return -1;
                } else if (a[sortField] > b[sortField]) {
                    return 1;
                } else {
                    return 0;
                }
            });
            return array;
        }
    }
}
