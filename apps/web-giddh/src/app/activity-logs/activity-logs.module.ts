import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ActivityLogsComponent } from './activity-logs.component';
import { ActivityLogsRoutingModule } from './activity-logs.routing.module';
import { ActivityLogsJsonComponent } from './components/activity-logs-json/activity-logs-json.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { DataTypeModule } from '../shared/helpers/pipes/dataType/dataType.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { SharedModule } from '../shared/shared.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { ActivityCompareJsonComponent } from './components/activity-compare-json/activity-compare-json.component';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ActivityLogsJsonComponent,
        ActivityLogsComponent,
        ActivityCompareJsonComponent
    ],
    exports: [
        ActivityLogsComponent],
    providers: [],
    imports: [
        CommonModule,
        ActivityLogsRoutingModule,
        DataTypeModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatTooltipModule,
        NoDataModule,
        GiddhPageLoaderModule,
        TranslateDirectiveModule,
        PaginationModule.forRoot(),
        FormFieldsModule,
        HamburgerMenuModule,
        SharedModule,
        MatCheckboxModule
    ],
})
export class ActivityLogsModule {
}
