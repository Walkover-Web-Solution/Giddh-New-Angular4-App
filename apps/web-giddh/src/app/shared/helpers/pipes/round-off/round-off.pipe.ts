import { Pipe, PipeTransform } from '@angular/core';

import { giddhRoundOff } from '../../helperFunctions';

/**
 * Round off pipe that uses giddhRoundOff helper function to
 * rounds off based on the decimal places provided
 *
 * @export
 * @class GiddhRoundOffPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'giddhRoundOff'
})
export class GiddhRoundOffPipe implements PipeTransform {

    /**
     * Rounds off the value provide with the decimal places (default is 2)
     *
     * @param {*} value Value to be round off
     * @param {...any[]} args Decimal places to round off (default is 2)
     * @returns {number} Rounded off number
     * @memberof GiddhRoundOffPipe
     */
    transform(value: any, ...args: any[]): number {
        return giddhRoundOff(value, args[0] || 2);
    }

}
