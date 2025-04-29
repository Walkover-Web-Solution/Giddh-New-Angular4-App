import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { CurrencyModule } from '../helpers/pipes/currencyPipe/currencyType.module';
import { AmountFieldComponent } from './amount-field.component';

@NgModule({
    declarations: [AmountFieldComponent],
    imports: [CurrencyModule, CommonModule],
    exports: [AmountFieldComponent],
    providers: [DecimalPipe]
})
export class AmountFieldComponentModule { }
