import { Pipe, PipeTransform } from '@angular/core';
import { slice } from '../lodash-optimized';

@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'capitalize',
    standalone: false
})
export class CapitalizePipe implements PipeTransform {

    public transform(value: any) {
        if (value) {
            value = value.charAt(0).toUpperCase() + value.slice(1)?.toLowerCase();
        }
        return value;
    }

}
