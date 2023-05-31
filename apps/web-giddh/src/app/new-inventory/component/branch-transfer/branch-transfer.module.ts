import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { GiddhDatepickerModule } from '../../../theme/giddh-datepicker/giddh-datepicker.module';
import { BranchTransferComponent } from './branch-transfer/branch-transfer.component';
import { BranchTransferRoutingModule } from './branch-transfer.routing.module';

@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        BranchTransferRoutingModule,
        FormFieldsModule,
        MatButtonModule,
        GiddhDatepickerModule,
        MatButtonModule

    ],
    exports: [
        BranchTransferComponent
    ],
    declarations: [MainComponent, BranchTransferComponent]
})
export class BranchTransferModule { }
