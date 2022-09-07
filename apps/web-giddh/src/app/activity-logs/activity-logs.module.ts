import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivityLogsComponent } from './activity-logs.component';
import { ActivityLogsRoutingModule } from './activity-logs.routing.module';
import { ActivityLogsJsonComponent } from './components/activity-logs-json/activity-logs-json.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DataTypeModule } from '../shared/helpers/pipes/dataType/dataType.module';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
