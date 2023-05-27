import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingDetailComponent } from './billing-details.component';
import { BillingDetailRoutingModule } from './billing-details.routing.module';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { SnackBarModule } from '../theme/snackbar/snackbar.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';


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
        AmountFieldComponentModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        FormFieldsModule
    ],
    declarations: [BillingDetailComponent]
})
export class BillingDetailModule {
}
