import { CurrencyModule } from './../shared/helpers/pipes/currencyPipe/currencyType.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AuditLogsGridComponent } from './components/audit-logs-grid/audit-logs-grid.component';
import { AuditLogsSidebarComponent } from './components/sidebar-components/audit-logs.sidebar.component';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogsRoutingModule } from './audit-logs.routing.module';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    AuditLogsComponent,
    AuditLogsSidebarComponent,
    AuditLogsGridComponent
  ],
  exports: [
    AuditLogsComponent,
    AuditLogsSidebarComponent,
    CurrencyModule

  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuditLogsRoutingModule,
    DatepickerModule,
    BsDatepickerModule,
    LaddaModule,
    ShSelectModule,
    CurrencyModule
  ],
})
export class AuditLogsModule {
}
