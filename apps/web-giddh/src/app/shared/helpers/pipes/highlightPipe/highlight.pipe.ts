import { Pipe, PipeTransform } from '@angular/core';

// tslint:disable-next-line:pipe-naming
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
    public transform(text: string, search): string {
        if (search && text) {
            let pattern = search?.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            pattern = pattern?.split(' ')?.filter((t) => {
                return t?.length > 0;
            }).join('|');
            const regex = new RegExp(pattern, 'gi');

            return text?.replace(regex, (match) => `<span class="ui-select-highlight">${match}</span>`);
        } else {
            return text;
        }
    }
}
