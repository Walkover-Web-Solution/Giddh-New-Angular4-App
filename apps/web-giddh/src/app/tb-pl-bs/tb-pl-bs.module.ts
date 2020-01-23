import { CurrencyModule } from './../shared/helpers/pipes/currencyPipe/currencyType.module';
import { TbSynramComponent } from './components/tb-synram/tb-synram.component';
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
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
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
import { TbsearchPipe } from '../shared/header/pipe/tbsearch.pipe';
import { LaddaModule } from 'angular2-ladda';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { RecTypeModule } from '../shared/helpers/pipes/recType/recType.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        TbPlBsComponent,
        TbGridComponent,
        TbPlBsFilterComponent,
        TlPlGridRowComponent,
        TbComponent,
        TbSynramComponent,
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
        TbsearchPipe,
    ],
    exports: [
        TbPlBsComponent, CurrencyModule
    ],
    providers: [],
    imports: [
        CommonModule,
        ModalModule,
        FormsModule,
        ReactiveFormsModule,
        Daterangepicker,
        TbPlBsRoutingModule,
        TabsModule,
        DatePickerCustomModule,
        LaddaModule,
        HighlightModule,
        RecTypeModule,
        ShSelectModule,
        ClickOutsideModule,
        BsDropdownModule,
        CurrencyModule,
        TooltipModule,
        AccountDetailModalModule,
        SharedModule
    ],
})
export class TBPlBsModule {
}
