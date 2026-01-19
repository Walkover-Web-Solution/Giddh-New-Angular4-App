import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared/shared.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { MatButtonModule } from '@angular/material/button';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogsRoutingModule } from './audit-logs.routing.module';
import { AuditLogsFormComponent } from './components/audit-logs-form/audit-logs-form.component';
import { AuditLogsGridComponent } from './components/audit-logs-grid/audit-logs-grid.component';
import { AuditLogsTableComponent } from './components/audit-logs-table/audit-logs-table.component';
import { AuditLogsSidebarComponent } from './components/sidebar-components/audit-logs.sidebar.component';
import { AuditLogsServiceModule } from './services/audit-logs.service.module';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
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
        MatMenuModule,
        MatRadioModule,
        MatTableModule,
        AuditLogsRoutingModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        AuditLogsServiceModule,
        GiddhNumberFormatModule,
        SharedModule,
        TranslateDirectiveModule,
        GiddhDatepickerModule,
        MatButtonModule,
        FormFieldsModule
    ],
})
/**
 * AuditLogsModule module
 * Implements AuditLogsModule functionality
 */
export class AuditLogsModule {
}
