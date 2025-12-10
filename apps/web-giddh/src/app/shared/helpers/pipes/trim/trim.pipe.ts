import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'trim',
  standalone: false,
    pure: true
})
export class TrimPipe implements PipeTransform {
    /**
     * Trims the string with whitespace
     *
     * @param {string} stringWithSpace String with whitespace
     * @return {*}  {string} Trimmed string
     * @memberof TrimPipe
     */
    transform(stringWithSpace: string): string {
        return String(stringWithSpace?.trim());
    }
}
