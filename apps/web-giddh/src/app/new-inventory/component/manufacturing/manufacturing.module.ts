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

@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        FormFieldsModule,
        MatButtonModule,
        ManufacturingRoutingModule
    ],
    exports: [
        CreateManufacturingComponent,
        ListManufacturingComponent
    ],
    declarations: [MainComponent, CreateManufacturingComponent, ListManufacturingComponent]
})
export class ManufacturingModule { }
