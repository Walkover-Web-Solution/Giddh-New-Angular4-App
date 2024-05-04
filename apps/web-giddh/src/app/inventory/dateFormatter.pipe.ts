import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceHyphens'
})

export class DateFormatterPipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            value = value?.replace(/-/g, ' ');
            let index = value?.length / 2;
            return value?.substring(0, index) + '-' + value?.substring(index, value?.length);
        }
        return '';
    }
}
