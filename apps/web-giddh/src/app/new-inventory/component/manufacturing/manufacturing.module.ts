import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { CreateManufacturingComponent } from './create-manufacturing/create-manufacturing.component';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { ListManufacturingComponent } from './list-manufacturing/list-manufacturing.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatepickerWrapperModule } from '../../../shared/datepicker-wrapper/datepicker.wrapper.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        FormFieldsModule,
        MatButtonModule,
        ManufacturingRoutingModule,
        MatButtonModule,
        MatTableModule,
        MatDialogModule,
        MatTooltipModule,
        DatepickerWrapperModule,
        PaginationModule.forRoot()
    ],
    exports: [
        CreateManufacturingComponent,
        ListManufacturingComponent
    ],
    declarations: [MainComponent, CreateManufacturingComponent, ListManufacturingComponent]
})
export class ManufacturingModule { }
