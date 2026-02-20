import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { LaddaModule } from 'angular2-ladda';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { GiddhDatePipe } from '../pipes/giddh-date.pipe';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { AmountFieldComponentModule } from '../amount-field/amount-field.module';
import { NgxMaskModule } from '../helpers/directives/ngx-mask';
import { ReplacePipeModule } from '../helpers/pipes/replace/replace.module';
import { AdvanceReceiptAdjustmentComponent } from './advance-receipt-adjustment.component';
import { GiddhNumberFormatModule } from '../helpers/pipes/number-format/number-format.module';

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
        AmountFieldComponentModule,
        NgxMaskModule.forRoot(),
        GiddhNumberFormatModule,
        TranslateDirectiveModule,
        ReplacePipeModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatRadioModule,
        FormFieldsModule,
        GiddhDatePipe
    ],
    exports: [AdvanceReceiptAdjustmentComponent]
})
export class AdvanceReceiptAdjustmentModule {

}
