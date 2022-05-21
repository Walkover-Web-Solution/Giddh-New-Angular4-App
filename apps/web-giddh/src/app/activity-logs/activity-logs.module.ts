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
import { ActivityLogsJsonComponent } from './components/activity-logs-json/activity-logs-json.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DataTypeModule } from '../shared/helpers/pipes/dataType/dataType.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoDataModule } from '../shared/no-data/no-data.module';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ActivityLogsJsonComponent,
        ActivityLogsComponent
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
        DataTypeModule,
        SharedModule,
        MatGridListModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatTooltipModule,
        NoDataModule
    ],
})
export class ActivityLogsModule {
}
