import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalModule } from '../../../theme';
// import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { InventoryAddStockComponent } from './inventory.addstock.component';
import { DecimalDigitsModule } from '../../../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { LaddaModule } from 'angular2-ladda';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        InventoryAddStockComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DecimalDigitsModule,
        MatSlideToggleModule,
        LaddaModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatMenuModule,
        MatRadioModule,
        MatRadioModule,
        MatButtonModule
    
    ],
    exports: [
        InventoryAddStockComponent
    ]
})
export class InventoryAddStockModule {}
