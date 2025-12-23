import { Pipe, PipeTransform } from "@angular/core";

/**
 * ReplaceAll pipe used to replace all occurrences of a search string
 * with a replacement string in the input value
 *
 * @export
 * @class ReplaceAllPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'replaceAll',
    pure: true,
    standalone: false
})
export class ReplaceAllPipe implements PipeTransform {

    /**
     * Transforms the input value by replacing all occurrences of the search string
     * with the replacement string
     *
     * @param {*} value Value to be transformed
     * @param {string} [searchValue=''] String to search for
     * @param {*} replaceValue Value to replace all occurrences with
     * @return {*}  {string} Transformed string with all occurrences replaced
     * @memberof ReplaceAllPipe
     */
    transform(value: any = '', searchValue: string = '', replaceValue: any = ''): string {
        if (!value || !searchValue) {
            return String(value);
        }
        return String(value).replaceAll(searchValue, String(replaceValue));
    }
}
