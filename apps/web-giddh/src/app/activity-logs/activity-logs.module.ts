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
import { MatMenuModule } from '@angular/material/menu';
import { NoDataModule } from '../shared/no-data/no-data.module';
// import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
// import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ActivityCompareJsonComponent } from './components/activity-compare-json/activity-compare-json.component';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        ActivityLogsComponent,
        ActivityCompareJsonComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    exports: [
        ActivityLogsComponent
    ],
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
        TranslateDirectiveModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatInputModule,
        MatMenuModule
    
    ],
})
export class ActivityLogsModule {
}
