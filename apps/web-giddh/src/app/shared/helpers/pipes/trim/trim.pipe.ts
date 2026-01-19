import { Pipe, PipeTransform } from "@angular/core";

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'trim',
    pure: true,
    standalone: false
})
/**
 * TrimPipe pipe
 * Implements TrimPipe functionality
 */
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
