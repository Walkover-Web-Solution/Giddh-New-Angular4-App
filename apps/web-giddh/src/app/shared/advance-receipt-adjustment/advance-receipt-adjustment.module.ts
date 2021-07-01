import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';

import { SelectModule } from '../../theme/ng-select/ng-select';
import { ShSelectModule } from '../../theme/ng-virtual-select/sh-select.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { AmountFieldComponentModule } from '../amount-field/amount-field.module';
import { NgxMaskModule } from '../helpers/directives/ngx-mask';
import { CurrencyModule } from '../helpers/pipes/currencyPipe/currencyType.module';
import { ReplacePipeModule } from '../helpers/pipes/replace/replace.module';
import { AdvanceReceiptAdjustmentComponent } from './advance-receipt-adjustment.component';

@NgModule({
    declarations: [AdvanceReceiptAdjustmentComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        LaddaModule,
        SelectModule,
        AmountFieldComponentModule,
        NgxMaskModule.forRoot(),
        CurrencyModule,
        TranslateDirectiveModule,
        ShSelectModule,
        ReplacePipeModule
    ],
    exports: [AdvanceReceiptAdjustmentComponent]
})
export class AdvanceReceiptAdjustmentModule {

}
