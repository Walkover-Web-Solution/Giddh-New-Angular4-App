import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { LaddaModule } from 'angular2-ladda';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SharedModule } from '../shared/shared.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { ActivityLogsComponent } from './activity-logs.component';
import { ActivityLogsRoutingModule } from './activity-logs.routing.module';
import { ActivityLogsFormComponent } from './components/activity-logs-form/activity-logs-form.component';
import { ActivityLogsGridComponent } from './components/activity-logs-grid/activity-logs-grid.component';
import { ActivityLogsTableComponent } from './components/activity-logs-table/activity-logs-table.component';
import { ActivityLogsSidebarComponent } from './components/sidebar-components/activity-logs.sidebar.component';
import { ActivityLogsServiceModule } from './services/activity-logs.service.module';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ActivityLogsComponent,
        ActivityLogsSidebarComponent,
        ActivityLogsGridComponent,
        ActivityLogsTableComponent,
        ActivityLogsFormComponent
    ],
    exports: [
        ActivityLogsComponent,
        ActivityLogsSidebarComponent
    ],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ActivityLogsRoutingModule,
        DatepickerModule,
        LaddaModule,
        ShSelectModule,
        ActivityLogsServiceModule,
        CurrencyModule,
        SharedModule,
        MatGridListModule
    ],
})
export class ActivityLogsModule {
}
