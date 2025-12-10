import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SendEmailComponent } from './send-email.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
// import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatDialogModule,
        TranslateDirectiveModule,
        MatButtonModule
    
    ],
    exports: [
        SendEmailComponent
    
    ],
    declarations: [
        SendEmailComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ]
})
export class SendEmailModule {
}
