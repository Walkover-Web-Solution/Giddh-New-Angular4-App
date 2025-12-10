import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingDetailComponent } from './billing-details.component';
import { BillingDetailRoutingModule } from './billing-details.routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { SnackBarModule } from '../theme/snackbar/snackbar.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BillingDetailRoutingModule,
        MatSnackBarModule,
        SnackBarModule,
        MatCardModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatButtonModule,
        HamburgerMenuModule,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ]
})
export class BillingDetailModule {
}
