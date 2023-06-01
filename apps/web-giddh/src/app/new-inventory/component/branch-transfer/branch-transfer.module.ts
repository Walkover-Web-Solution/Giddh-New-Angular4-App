import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { GiddhDatepickerModule } from '../../../theme/giddh-datepicker/giddh-datepicker.module';
import { BranchTransferRoutingModule } from './branch-transfer.routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { BranchTransferListComponent } from './branch-transfer-list/branch-transfer-list.component';
import { AsideBranchTransferComponent } from './aside-branch-transfer/aside-branch-transfer.component';
import { DatepickerWrapperModule } from '../../../shared/datepicker-wrapper/datepicker.wrapper.module';
import { BranchTransferCreateComponent } from './branch-transfer-create/branch-transfer-create.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        BranchTransferRoutingModule,
        FormFieldsModule,
        GiddhDatepickerModule,
        MatButtonModule,
        MatTooltipModule,
        MatTableModule,
        MatDialogModule,
        MatMenuModule,
        DatepickerWrapperModule,
        GiddhDatepickerModule,
        MatRadioModule,
        FormsModule

    ],
    exports: [
        BranchTransferListComponent,
        BranchTransferCreateComponent
    ],
    declarations: [MainComponent, BranchTransferListComponent, AsideBranchTransferComponent, BranchTransferCreateComponent]
})
export class BranchTransferModule { }
