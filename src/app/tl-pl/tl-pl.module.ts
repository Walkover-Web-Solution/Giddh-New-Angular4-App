import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TlPlComponent } from './tl-pl.component';
import { SearchSidebarComponent } from './components/sidebar-components/search.sidebar.component';
import { TlPlGridComponent } from './components/search-grid/tl-pl-grid.component';
import { TlPlFilterComponent } from './components/tl-pl-filter/tl-pl-filter.component';
import { TlPlRoutingModule } from './tl-pl.routing.module';

@NgModule({
  declarations: [
    TlPlComponent,
    SearchSidebarComponent,
    TlPlGridComponent,
    TlPlFilterComponent,
  ],
  exports: [
    TlPlComponent,
    SearchSidebarComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TlPlRoutingModule,
    SharedModule,
  ],
})
export class TlPlModule {
}
