import { Pipe, PipeTransform } from "@angular/core";

/**
 * Replace pipe used to replace expression at runtime in
 * multi-lingual text
 *
 * @export
 * @class ReplacePipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'replace',
    pure: true
})
export class ReplacePipe implements PipeTransform {

    /**
     * Transforms the static expression value with the dynamic value provided
     *
     * @param {*} value Value to be transformed
     * @param {string} [expressionToReplace=''] Static expression that is to be replaced
     * @param {*} replaceWith Dynamic value to replace the static expression
     * @return {*}  {string} Transformed dynamic text
     * @memberof ReplacePipe
     */
    transform(value: any = '', expressionToReplace: string = '', replaceWith: any): string {
        return String(value)?.replace(expressionToReplace, replaceWith);
    }
}
