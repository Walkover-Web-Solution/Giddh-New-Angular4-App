import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TbsearchPipe } from '../shared/header/pipe/tbsearch.pipe';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { RecTypeModule } from '../shared/helpers/pipes/recType/recType.module';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { CurrencyModule } from './../shared/helpers/pipes/currencyPipe/currencyType.module';
import { BsGridRowComponent } from './components/bs/bs-grid/bs-grid-row.component';
import { BsGridComponent } from './components/bs/bs-grid/bs-grid.component';
import { BsComponent } from './components/bs/bs.component';
import { BsExportXlsComponent } from './components/export/bs-export-xls.component';
import { PlExportXlsComponent } from './components/export/pl-export-xls.component';
import { TbExportCsvComponent } from './components/export/tb-export-csv.component';
import { TbExportPdfComponent } from './components/export/tb-export-pdf.component';
import { TbExportXlsComponent } from './components/export/tb-export-xls.component';
import { TbPlBsFilterComponent } from './components/filter/tb-pl-bs-filter.component';
import { PlGridRowComponent } from './components/pl/pl-grid/pl-grid-row.component';
import { PlGridComponent } from './components/pl/pl-grid/pl-grid.component';
import { PlComponent } from './components/pl/pl.component';
import { TlPlGridRowComponent } from './components/tb-pl-bs-grid-row.component';
import { TbGridComponent } from './components/tb/tb-grid/tb-grid.component';
import { TbComponent } from './components/tb/tb.component';
import { TrialAccordionDirective } from './components/trial-accordion.directive';
import { AccountsFilterPipe } from './pipes/accounts-filter.pipe';
import { TbPlBsComponent } from './tb-pl-bs.component';
import { TbPlBsRoutingModule } from './tb-pl-bs.routing.module';

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
        TbsearchPipe,
        AccountsFilterPipe
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
        LaddaModule,
        HighlightModule,
        RecTypeModule,
        ShSelectModule,
        ClickOutsideModule,
        BsDropdownModule,
        CurrencyModule,
        TooltipModule,
        AccountDetailModalModule,
        ScrollingModule,
        TranslateDirectiveModule,
        HamburgerMenuModule
    ],
})
export class TBPlBsModule {
}
