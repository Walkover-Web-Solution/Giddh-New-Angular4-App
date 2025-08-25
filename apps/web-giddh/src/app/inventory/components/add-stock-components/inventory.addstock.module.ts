import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmModalModule } from '../../../theme';
import { ShSelectModule } from '../../../theme/ng-virtual-select/sh-select.module';
import { InventoryAddStockComponent } from './inventory.addstock.component';
import { DecimalDigitsModule } from '../../../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { LaddaModule } from 'angular2-ladda';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    declarations: [InventoryAddStockComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ShSelectModule,
        
        ConfirmModalModule,
        DecimalDigitsModule,
        MatSlideToggleModule,
        LaddaModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatMenuModule
    ],
    exports: [InventoryAddStockComponent]
})
export class InventoryAddStockModule {}
