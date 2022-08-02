import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search.routing.module';
import { SearchSidebarComponent } from './components/sidebar-components/search.sidebar.component';
import { SearchGridComponent } from './components/search-grid/search-grid.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ClickOutsideModule } from 'ng-click-outside';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SharedModule } from '../shared/shared.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        SearchComponent,
        SearchSidebarComponent,
        SearchGridComponent,
        SearchFilterComponent,
    ],
    exports: [
        SearchComponent,
        SearchSidebarComponent
    ],
    imports: [
        PaginationModule.forRoot(),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SearchRoutingModule,
        DatepickerModule,
        ModalModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        DecimalDigitsModule,
        Daterangepicker,
        BsDropdownModule.forRoot(),
        ClickOutsideModule,
        CurrencyModule,
        SharedModule,
        NoDataModule
    ]
})
export class SearchModule {
}
