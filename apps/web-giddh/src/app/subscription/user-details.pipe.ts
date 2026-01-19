import { Pipe, PipeTransform } from '@angular/core';

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'search',
    standalone:false
})

/**
 * UserDetailsPipe pipe
 * Implements UserDetailsPipe functionality
 */
export class UserDetailsPipe implements PipeTransform {
    /**
     * Handles transform functionality
     */
    transform(items: any[], searchText: string): any[] {
        /**
         * Handles if functionality
         */
        if (!items) return [];
        /**
         * Handles if functionality
         */
        if (!searchText) return items;

        searchText = searchText?.toLowerCase();
        return items?.filter(it => {
            return it.name?.toLowerCase().includes(searchText);
        });
    }
}
