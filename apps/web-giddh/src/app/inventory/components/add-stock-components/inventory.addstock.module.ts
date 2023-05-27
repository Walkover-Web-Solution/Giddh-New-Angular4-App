import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ConfirmModalModule } from '../../../theme';
import { ShSelectModule } from '../../../theme/ng-virtual-select/sh-select.module';
import { InventoryAddStockComponent } from './inventory.addstock.component';
import { DecimalDigitsModule } from '../../../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { LaddaModule } from 'angular2-ladda';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

@NgModule({
    declarations: [InventoryAddStockComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ShSelectModule,
        BsDropdownModule.forRoot(),
        ConfirmModalModule,
        DecimalDigitsModule,
        MatSlideToggleModule,
        LaddaModule
    ],
    exports: [InventoryAddStockComponent]
})
export class InventoryAddStockModule {}
