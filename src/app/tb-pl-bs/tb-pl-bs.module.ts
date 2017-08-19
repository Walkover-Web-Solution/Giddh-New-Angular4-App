import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TbPlBsComponent } from './tb-pl-bs.component';
import { TbGridComponent } from './components/tb/tb-grid/tb-grid.component';
import { TbPlBsFilterComponent } from './components/filter/tb-pl-bs-filter.component';
import { TbPlBsRoutingModule } from './tb-pl-bs.routing.module';
import { TlPlExportComponent } from './components/export/tl-pl-export.component';
import { TlPlExportCsvComponent } from './components/export/tl-pl-export-csv.component';
import { TlPlExportPdfComponent } from './components/export/tl-pl-export-pdf.component';
import { TlPlExportXlsComponent } from './components/export/tl-pl-export-xls.component';
import { TlPlGridRowComponent } from './components/tb-pl-bs-grid-row.component';
import { TrialAccordionDirective } from './components/trial-accordion.directive';
import { TbComponent } from './components/tb/tb.component';
import { PlComponent } from './components/pl/pl.component';
import { PlGridComponent } from './components/pl/pl-grid/pl-grid.component';
import { PlGridRowComponent } from './components/pl/pl-grid/pl-grid-row.component';

@NgModule({
  declarations: [
    TbPlBsComponent,
    TbGridComponent,
    TbPlBsFilterComponent,
    TlPlExportComponent,
    TlPlExportCsvComponent,
    TlPlExportPdfComponent,
    TlPlExportXlsComponent,
    TlPlGridRowComponent,
    TbComponent,
    PlComponent,
    PlGridComponent,
    PlGridRowComponent,
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
