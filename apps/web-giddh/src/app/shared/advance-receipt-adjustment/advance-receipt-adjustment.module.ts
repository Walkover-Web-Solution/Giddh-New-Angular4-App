import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { LaddaModule } from 'angular2-ladda';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
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
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        SelectModule,
        AmountFieldComponentModule,
        NgxMaskModule.forRoot(),
        CurrencyModule,
        TranslateDirectiveModule,
        ShSelectModule,
        ReplacePipeModule,
        MatButtonModule,
        MatInputModule,
        MatRadioModule,
        FormFieldsModule
    ],
    exports: [AdvanceReceiptAdjustmentComponent]
})
export class AdvanceReceiptAdjustmentModule {

}
