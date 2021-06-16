import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { HamburgerMenuComponentModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';

import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogsRoutingModule } from './audit-logs.routing.module';
import { AuditLogsFormComponent } from './components/audit-logs-form/audit-logs-form.component';
import { AuditLogsGridComponent } from './components/audit-logs-grid/audit-logs-grid.component';
import { AuditLogsTableComponent } from './components/audit-logs-table/audit-logs-table.component';
import { AuditLogsSidebarComponent } from './components/sidebar-components/audit-logs.sidebar.component';

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
        LaddaModule,
        ShSelectModule,
        CurrencyModule,
        DatepickerWrapperModule,
        HamburgerMenuComponentModule
    ],
})
export class AuditLogsModule {
}
