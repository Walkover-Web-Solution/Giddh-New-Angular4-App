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
import { DatepickerWrapperModule } from '../../../shared/datepicker-wrapper/datepicker.wrapper.module';
import { BranchTransferCreateComponent } from './branch-transfer-create/branch-transfer-create.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
        FormsModule,
        ClickOutsideModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule 

    ],
    exports: [
        BranchTransferListComponent,
        BranchTransferCreateComponent
    ],
    declarations: [MainComponent, BranchTransferListComponent, BranchTransferCreateComponent]
})
export class BranchTransferModule { }
