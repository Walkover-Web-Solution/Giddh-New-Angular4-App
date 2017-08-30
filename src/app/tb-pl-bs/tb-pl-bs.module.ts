import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TbPlBsComponent } from './tb-pl-bs.component';
import { TbGridComponent } from './components/tb/tb-grid/tb-grid.component';
import { TbPlBsFilterComponent } from './components/filter/tb-pl-bs-filter.component';
import { TbPlBsRoutingModule } from './tb-pl-bs.routing.module';
import { TlPlGridRowComponent } from './components/tb-pl-bs-grid-row.component';
import { TrialAccordionDirective } from './components/trial-accordion.directive';
import { TbComponent } from './components/tb/tb.component';
import { PlComponent } from './components/pl/pl.component';
import { PlGridComponent } from './components/pl/pl-grid/pl-grid.component';
import { PlGridRowComponent } from './components/pl/pl-grid/pl-grid-row.component';

import { BsComponent } from './components/bs/bs.component';
import { BsGridComponent } from './components/bs/bs-grid/bs-grid.component';
import { BsGridRowComponent } from './components/bs/bs-grid/bs-grid-row.component';

import { PlBsExportXlsComponent } from './components/export/pl-bs-export-xls.component';
import { TbExportCsvComponent } from './components/export/tb-export-csv.component';
import { TbExportPdfComponent } from './components/export/tb-export-pdf.component';
import { TbExportXlsComponent } from './components/export/tb-export-xls.component';

@NgModule({
  declarations: [
    TbPlBsComponent,
    TbGridComponent,
    TbPlBsFilterComponent,
    TlPlGridRowComponent,
    TbComponent,
    PlComponent,
    PlGridComponent,
    PlGridRowComponent,
    PlBsExportXlsComponent,
    TbExportCsvComponent,
    TbExportPdfComponent,
    TbExportXlsComponent,
    BsComponent,
    BsGridComponent,
    BsGridRowComponent,
    TrialAccordionDirective
  ],
  exports: [
    TbPlBsComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TbPlBsRoutingModule,
    SharedModule,
  ],
})
export class TBPlBsModule {
}
