import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ConfirmModalModule } from '../../../theme';

import { ShSelectModule } from '../../../theme/ng-virtual-select/sh-select.module';
import { InventoryAddStockComponent } from './inventory.addstock.component';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';

@NgModule({
    declarations: [InventoryAddStockComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ShSelectModule,
        BsDropdownModule.forRoot(),
        ConfirmModalModule,
        NgxBootstrapSwitchModule.forRoot()
    ],
    exports: [InventoryAddStockComponent]
})
export class InventoryAddStockModule {}
