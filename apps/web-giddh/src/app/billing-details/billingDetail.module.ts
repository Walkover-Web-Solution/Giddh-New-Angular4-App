import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingDetailComponent } from './billingDetail.component';
import { BillingDetailRoutingModule } from './billingDetail.routing.module';
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
