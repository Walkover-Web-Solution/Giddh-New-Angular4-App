import { NgModule } from '@angular/core';
import { InventoryInOutRoutingModule } from './inventory-in-out.routing.module';
import { InventoryInOutComponent } from './inventory-in-out.component';
import { InOutStockListComponent } from './components/sidebar-components/stock-list.component';
import { InventoryInOutSidebarComponent } from './components/sidebar-components/inventory.sidebar.component';
import { PersonListComponent } from './components/sidebar-components/person-list.component';
import { InventoryHeaderComponent } from './components/header-components/inventory-header-component';
import { InventoryInOutReportComponent } from './components/inventory-in-out-report/inventory-in-out-report.component';
import { CommonModule } from '@angular/common';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AsideMenuComponent } from './components/aside-menu/aside-menu.component';
import { TransferNoteComponent } from './components/forms/transfer-note/transfer-note.component';
import { InwardNoteComponent } from './components/forms/inward-note/inward-note.component';
import { OutwardNoteComponent } from './components/forms/outward-note/outward-note.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from '../theme/ng-select/ng-select';
import { InventoryUserComponent } from './components/forms/inventory-user/inventory-user.component';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { InventoryModule } from '../inventory/inventory.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';

@NgModule({
    declarations: [
        InventoryInOutComponent,
        InventoryInOutSidebarComponent,
        PersonListComponent,
        InOutStockListComponent,
        InventoryHeaderComponent,
        InventoryInOutReportComponent,
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
        ShSelectModule,
        PaginationModule,
        Daterangepicker,
        ReactiveFormsModule,
        FormsModule,
        BsDatepickerModule.forRoot(), CommonModule, SelectModule, LaddaModule,
        BsDropdownModule,
        InventoryModule,
        TabsModule,
        DecimalDigitsModule
    ],
})
export class InventoryInOutModule {
    constructor() {
    }

}
