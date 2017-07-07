import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search.routing.module';
import { SearchSidebarComponent } from './components/sidebar-components/search.sidebar.component';
import { SearchGridComponent } from './components/search-grid/search-grid.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SearchComponent,
    SearchSidebarComponent,
    SearchGridComponent
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
    Ng2BootstrapModule.forRoot(),
    SharedModule,
  ],
})
export class SearchModule {
}
