import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { TranslateDirectiveModule } from 'apps/web-giddh/src/app/theme/translate/translate.directive.module';
import { AccountAddNewDetailsComponent } from './account-add-new-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BulkAddDialogComponent } from '../bulk-add-dialog/bulk-add-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
// import { FormFieldsModule } from 'apps/web-giddh/src/app/theme/form-fields/form-fields.module';
// Temporarily disabled;
import { NewConfirmModalModule } from 'apps/web-giddh/src/app/theme/new-confirm-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SalesPersonService } from '../../../sales-person/utility/sales-person.service';
import { MobileNumberInputComponent } from '../../../mobile-number-input';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        AccountAddNewDetailsComponent,
        BulkAddDialogComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    exports: [
        AccountAddNewDetailsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        MatSlideToggleModule,
        RouterModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule,
        MatRadioModule,
        MatTabsModule,
        MatTooltipModule,
        MobileNumberInputComponent
    
    ],
    providers: [
        SalesPersonService
    ]
})
export class AccountAddNewDetailsModule { }
