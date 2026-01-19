import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalModule } from '../../../theme';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { InventoryAddStockComponent } from './inventory.addstock.component';
import { DecimalDigitsModule } from '../../../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { LaddaModule } from 'angular2-ladda';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [InventoryAddStockComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormFieldsModule,
        ConfirmModalModule,
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
    exports: [InventoryAddStockComponent]
})
/**
 * InventoryAddStockModule module
 * Implements InventoryAddStockModule functionality
 */
export class InventoryAddStockModule {}
