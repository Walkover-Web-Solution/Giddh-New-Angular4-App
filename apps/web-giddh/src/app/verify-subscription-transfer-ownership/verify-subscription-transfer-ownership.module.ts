import { NgModule } from '@angular/core';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { VerifySubscriptionTransferOwnershipComponent } from './verify-subscription-transfer-ownership.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoaderModule } from '../loader/loader.module';
import { SnackBarModule } from '../theme/snackbar/snackbar.module';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    imports: [
        TranslateDirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        SnackBarModule,
        MatDialogModule,
        MatButtonModule,
        LoaderModule,
        CommonModule
    
    ],
    exports: [
        VerifySubscriptionTransferOwnershipComponent
    
    ],
    declarations: [
        VerifySubscriptionTransferOwnershipComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ]
})
export class VerifySubscriptionTransferOwnershipModule { }
