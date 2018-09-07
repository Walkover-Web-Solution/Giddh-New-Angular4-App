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
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';

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
  providers: [],
  imports: [
    PaginationModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchRoutingModule,
    DatepickerModule,
    TypeaheadModule,
    ModalModule,
    LaddaModule,
    DecimalDigitsModule,
    Daterangepicker,
    BsDropdownModule,
    ClickOutsideModule
  ],
})
export class SearchModule {
}
