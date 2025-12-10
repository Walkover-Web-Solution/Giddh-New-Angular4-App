
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search.routing.module';
import { SearchSidebarComponent } from './components/sidebar-components/search.sidebar.component';
import { SearchGridComponent } from './components/search-grid/search-grid.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';

import { ClickOutsideModule } from 'ng-click-outside';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
// import { SharedModule } from '../shared/shared.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { MatButtonModule } from '@angular/material/button';
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        SearchSidebarComponent,
        SearchGridComponent,
        SearchFilterComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    exports: [
        SearchComponent,
        SearchSidebarComponent
    ],
    imports: [
        MatPaginatorModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SearchRoutingModule,
        LaddaModule.forRoot({ style: 'slide-left',
        spinnerSize: 30
    
    ]
        }),
        DecimalDigitsModule,
        Daterangepicker,
        ClickOutsideModule,
        GiddhNumberFormatModule,
        // SharedModule,
        NoDataModule,
                // FormFieldsModule, // Temporarily disabled for compilation
        MatButtonModule,
        MatMenuModule,
        MatTableModule,
        MatCheckboxModule,
        MatInputModule,
        MatChipsModule,
        MatTooltipModule
    ]
})
export class SearchModule {
}
