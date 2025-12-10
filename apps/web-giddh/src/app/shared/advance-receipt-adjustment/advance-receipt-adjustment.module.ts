import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { LaddaModule } from 'angular2-ladda';
// import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { AmountFieldComponentModule } from '../amount-field/amount-field.module';
import { NgxMaskModule } from '../helpers/directives/ngx-mask';
import { ReplacePipeModule } from '../helpers/pipes/replace/replace.module';
import { AdvanceReceiptAdjustmentComponent } from './advance-receipt-adjustment.component';
import { GiddhNumberFormatModule } from '../helpers/pipes/number-format/number-format.module';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";

@NgModule({
    declarations: [
        AdvanceReceiptAdjustmentComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        LaddaModule.forRoot({ style: 'slide-left',
        spinnerSize: 30
    
    ]
        }),
        // AmountFieldComponentModule, // NG6002 error - temporarily disabled
        NgxMaskModule.forRoot(),
        GiddhNumberFormatModule,
        TranslateDirectiveModule,
        ReplacePipeModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatRadioModule,
        // // FormFieldsModule, // Temporarily disabled for compilation
    exports: [
        AdvanceReceiptAdjustmentComponent
    ]
})
export class AdvanceReceiptAdjustmentModule {

}
