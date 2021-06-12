import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'apps/web-giddh/src/app/lodash-optimized';

@Pipe({ name: 'ghSortBy' })
export class GhSortByPipePipe implements PipeTransform {

    transform(value: any[], column: string, order = ''): any[] {
        if (!value || !column || column === '' || order === '') {
            return value;
        } // no array
        if (value.length <= 1) {
            return value;
        } // array with only one item
        return orderBy(value, [column], [order]);
    }
}
