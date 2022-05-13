import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { LaddaModule } from 'angular2-ladda';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SharedModule } from '../shared/shared.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { ActivityLogsComponent } from './activity-logs.component';
import { ActivityLogsRoutingModule } from './activity-logs.routing.module';
import { ActivityLogsTableComponent } from './components/activity-logs-table/activity-logs-table.component';
import { DataTypePipe } from './data-type.pipe';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ActivityLogsTableComponent,
        ActivityLogsComponent,
        DataTypePipe
    ],
    exports: [
        ActivityLogsComponent
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
        CurrencyModule,
        SharedModule,
        MatGridListModule,
        MatButtonModule,
        MatDialogModule
    ],
})
export class ActivityLogsModule {
}
