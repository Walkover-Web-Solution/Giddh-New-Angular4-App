import { NgModule } from '@angular/core';
import { InventoryInOutRoutingModule } from './inventory-in-out.routing.module';
import { InventoryInOutComponent } from './inventory-in-out.component';
import { StockListComponent } from './components/sidebar-components/stock-list.component';
import { InventorySidebarComponent } from './components/sidebar-components/inventory.sidebar.component';
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

@NgModule({
  declarations: [
    InventoryInOutComponent,
    InventorySidebarComponent,
    PersonListComponent,
    StockListComponent,
    InventoryHeaderComponent,
    InventoryInOutReportComponent,
    AsideMenuComponent,
    TransferNoteComponent,
    InwardNoteComponent,
    OutwardNoteComponent
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
    BsDatepickerModule.forRoot(), CommonModule, SelectModule, LaddaModule
  ],
})
export class InventoryInOutModule {
  constructor() {
    console.log('InventoryInOutModule');
  }

}
