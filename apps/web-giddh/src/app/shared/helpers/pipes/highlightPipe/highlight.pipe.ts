import { Pipe, PipeTransform } from '@angular/core';

// tslint:disable-next-line:pipe-naming
@Pipe({ name: 'highlight', standalone: false })
export class HighlightPipe implements PipeTransform {
    public transform(text: string, search): string {
        if (search && text) {
            // Sanitize search input to prevent ReDoS attacks
            const sanitizedSearch = String(search).slice(0, 100); // Limit length
            let pattern = sanitizedSearch?.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

            // Split and filter terms, limiting the number of terms
            const terms = pattern?.split(' ')?.filter((t) => {
                return t?.length > 0 && t.length <= 50; // Limit individual term length
            }).slice(0, 10); // Limit number of terms

            if (!terms || terms.length === 0) {
                return text;
            }

            pattern = terms.join('|');

            // Use string replacement for better performance and security
            let result = text;
            terms.forEach(term => {
                const searchTerm = term.replace(/\\/g, ''); // Remove escape characters for search
                const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                result = result.replace(regex, (match) => `<span class="ui-select-highlight">${match}</span>`);
            });

            return result;
        } else {
            return text;
        }
    }
}
