import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SharedModule } from '../shared/shared.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogsRoutingModule } from './audit-logs.routing.module';
import { AuditLogsFormComponent } from './components/audit-logs-form/audit-logs-form.component';
import { AuditLogsGridComponent } from './components/audit-logs-grid/audit-logs-grid.component';
import { AuditLogsTableComponent } from './components/audit-logs-table/audit-logs-table.component';
import { AuditLogsSidebarComponent } from './components/sidebar-components/audit-logs.sidebar.component';
import { AuditLogsServiceModule } from './services/audit-logs.service.module';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        AuditLogsComponent,
        AuditLogsSidebarComponent,
        AuditLogsGridComponent,
        AuditLogsTableComponent,
        AuditLogsFormComponent
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
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ShSelectModule,
        AuditLogsServiceModule,
        CurrencyModule,
        SharedModule
    ],
})
export class AuditLogsModule {
}
