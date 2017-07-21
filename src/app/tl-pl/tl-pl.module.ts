import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TlPlComponent } from './tl-pl.component';
import { SearchSidebarComponent } from './components/sidebar-components/search.sidebar.component';
import { TlPlGridComponent } from './components/tl-pl-grid/tl-pl-grid.component';
import { TlPlFilterComponent } from './components/tl-pl-filter/tl-pl-filter.component';
import { TlPlRoutingModule } from './tl-pl.routing.module';
import { TlPlExportComponent } from './components/tl-pl-export/tl-pl-export.component';
import { TlPlExportCsvComponent } from './components/tl-pl-export/tl-pl-export-csv.component';
import { TlPlExportPdfComponent } from './components/tl-pl-export/tl-pl-export-pdf.component';
import { TlPlExportXlsComponent } from './components/tl-pl-export/tl-pl-export-xls.component';
import { TlPlGridRowComponent } from './components/tl-pl-grid/tl-pl-grid-row.component';
import { TrialAccordionDirective } from './components/tl-pl-grid/trial-accordion.directive';

@NgModule({
  declarations: [
    TlPlComponent,
    SearchSidebarComponent,
    TlPlGridComponent,
    TlPlFilterComponent,
    TlPlExportComponent,
    TlPlExportCsvComponent,
    TlPlExportPdfComponent,
    TlPlExportXlsComponent,
    TlPlGridRowComponent,
    TrialAccordionDirective
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
