import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DaybookRoutingModule } from './daybook.routing.module';
import { DaybookComponent } from './daybook.component';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { DaybookAdvanceSearchModelComponent } from 'apps/web-giddh/src/app/daybook/advance-search/daybook-advance-search.component';
import { DecimalDigitsModule } from 'apps/web-giddh/src/app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ExportDaybookComponent } from './export-daybook/export-daybook.component';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { SharedModule } from '../shared/shared.module';
import { SalesModule } from '../sales/sales.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { UpdateLedgerEntryPanelModule } from '../ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.module';
import { AsideMenuSalesOtherTaxesModule } from '../sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.module';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LedgerModule } from '../ledger/ledger.module';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';

@NgModule({
    declarations: [DaybookComponent, ExportDaybookComponent, DaybookAdvanceSearchModelComponent],
    providers: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DecimalDigitsModule,
        FormsModule,
        Daterangepicker,
        DaybookRoutingModule,
        ElementViewChildModule,
        GiddhNumberFormatModule,
        SharedModule,
        NgxMaskModule.forRoot(),
        AsideMenuSalesOtherTaxesModule,
        SalesModule,
        NoDataModule,
        UpdateLedgerEntryPanelModule,
        MatInputModule,
        MatTooltipModule,
        MatButtonModule,
        MatTableModule,
        MatDialogModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatRadioModule,
        MatExpansionModule,
        MatSlideToggleModule,
        LedgerModule,
        WatchVideoModule,
        NgxMatSelectSearchModule,
        MatSelectModule,
        MatMenuModule,
        FormFieldsModule
    ]
})
export class DaybookModule {
}
