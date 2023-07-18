import { Pipe, PipeTransform } from "@angular/core";

/**
 * Particular pipe used to show particular account in ledger home page
 *
 * @export
 * @class ParticularPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'particular',
    pure: true
})
export class ParticularPipe implements PipeTransform {

    /**
     * Retuns the transformed particular account name
     *
     * @param {*} transaction Transaction details
     * @param {...Array<any>} args Contains the 'by' and 'to' multi-lingual label
     * @return {*}  {string} Transformed particular account name
     * @memberof ParticularPipe
     */
    transform(transaction: any, ...args: Array<any>): string {
        const toBy = args[0];
        const byParticular = args[1];
        const toParticular = args[2];

        let particular = (toBy === 'by') ? byParticular : toParticular;
        particular = particular?.replace('[PARTICULAR]', transaction?.inventory ?
            `${transaction?.particular?.name} (${transaction?.inventory?.stock?.name})` :
            transaction?.particular?.name);
        return particular;
    }

}
