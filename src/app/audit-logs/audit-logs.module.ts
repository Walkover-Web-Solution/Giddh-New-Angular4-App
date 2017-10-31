import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AuditLogsGridComponent } from './components/audit-logs-grid/audit-logs-grid.component';
import { AuditLogsSidebarComponent } from './components/sidebar-components/audit-logs.sidebar.component';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogsRoutingModule } from './audit-logs.routing.module';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    AuditLogsComponent,
    AuditLogsSidebarComponent,
    AuditLogsGridComponent
  ],
  exports: [
    AuditLogsComponent,
    AuditLogsSidebarComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuditLogsRoutingModule,
    DatepickerModule,
    BsDatepickerModule,
    LaddaModule
  ],
})
export class AuditLogsModule {
}
