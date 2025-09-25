import { NgModule } from '@angular/core';
import { InventoryInOutRoutingModule } from './inventory-in-out.routing.module';
import { InventoryInOutComponent } from './inventory-in-out.component';
import { InOutStockListComponent } from './components/sidebar-components/stock-list.component';
import { InventoryInOutSidebarComponent } from './components/sidebar-components/inventory.sidebar.component';
import { PersonListComponent } from './components/sidebar-components/person-list.component';
import { InventoryHeaderComponent } from './components/header-components/inventory-header-component';
import { CommonModule } from '@angular/common';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { AsideMenuComponent } from './components/aside-menu/aside-menu.component';
import { TransferNoteComponent } from './components/forms/transfer-note/transfer-note.component';
import { InwardNoteComponent } from './components/forms/inward-note/inward-note.component';
import { OutwardNoteComponent } from './components/forms/outward-note/outward-note.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { InventoryUserComponent } from './components/forms/inventory-user/inventory-user.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InventoryModule } from '../inventory/inventory.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';

@NgModule({
    declarations: [
        InventoryInOutComponent,
        InventoryInOutSidebarComponent,
        PersonListComponent,
        InOutStockListComponent,
        InventoryHeaderComponent,
        AsideMenuComponent,
        TransferNoteComponent,
        InwardNoteComponent,
        OutwardNoteComponent,
        InventoryUserComponent
    ],
    exports: [],
    providers: [],
    imports: [InventoryInOutRoutingModule,
        CommonModule,
        MatButtonModule,
        Daterangepicker,
        ReactiveFormsModule,
        FormsModule,
        CommonModule, 
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        InventoryModule,
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        DecimalDigitsModule,
        MatCheckboxModule,
        GiddhDatepickerModule,
        FormFieldsModule
    ],
})
export class InventoryInOutModule {
    constructor() {
    }

}
