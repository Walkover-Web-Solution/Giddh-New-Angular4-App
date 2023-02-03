import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

    public transform(value: any) {
        if (value) {
            value = value.charAt(0).toUpperCase() + value.slice(1)?.toLowerCase();
        }
        return value;
    }

}
