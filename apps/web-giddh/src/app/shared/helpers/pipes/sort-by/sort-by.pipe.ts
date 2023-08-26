import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    public transform(array: string[], args?: any): any {
        if (array) {
            let sortField = args[0]; // the field we want to sort by
            array.sort((a: any, b: any) => {
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