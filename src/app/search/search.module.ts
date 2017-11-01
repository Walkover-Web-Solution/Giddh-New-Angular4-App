import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search.routing.module';
import { SearchSidebarComponent } from './components/sidebar-components/search.sidebar.component';
import { SearchGridComponent } from './components/search-grid/search-grid.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
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
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchRoutingModule,
    SharedModule,
    DatepickerModule,
    TypeaheadModule,
    ModalModule
  ],
})
export class SearchModule {
}
