import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { GiddhNumberFormatModule } from '../helpers/pipes/number-format/number-format.module';
import { AmountFieldComponent } from './amount-field.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [AmountFieldComponent],
    imports: [GiddhNumberFormatModule, CommonModule],
    exports: [AmountFieldComponent],
    providers: [DecimalPipe]
})
/**
 * AmountFieldComponentModule module
 * Implements AmountFieldComponentModule functionality
 */
export class AmountFieldComponentModule { }
