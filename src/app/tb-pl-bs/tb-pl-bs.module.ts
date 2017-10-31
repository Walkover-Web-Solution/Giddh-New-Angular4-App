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

import { PlExportXlsComponent } from './components/export/pl-export-xls.component';
import { TbExportCsvComponent } from './components/export/tb-export-csv.component';
import { TbExportPdfComponent } from './components/export/tb-export-pdf.component';
import { TbExportXlsComponent } from './components/export/tb-export-xls.component';
import { BsExportXlsComponent } from './components/export/bs-export-xls.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePickerCustomModule } from '../theme/datepicker/date-picker.module';
import { SelectModule } from '../theme/ng-select/ng-select';

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
    PlExportXlsComponent,
    TbExportCsvComponent,
    TbExportPdfComponent,
    TbExportXlsComponent,
    BsExportXlsComponent,
    BsComponent,
    BsGridComponent,
    BsGridRowComponent,
    TrialAccordionDirective,
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
    TabsModule,
    DatePickerCustomModule,
    SelectModule
  ],
})
export class TBPlBsModule {
}
