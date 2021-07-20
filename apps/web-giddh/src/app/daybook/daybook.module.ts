import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DaybookRoutingModule } from './daybook.routing.module';
import { DaybookComponent } from './daybook.component';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { DaybookAdvanceSearchModelComponent } from 'apps/web-giddh/src/app/daybook/advance-search/daybook-advance-search.component';
import { ShSelectModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module';
import { DecimalDigitsModule } from 'apps/web-giddh/src/app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ExportDaybookComponent } from './export-daybook/export-daybook.component';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { SharedModule } from '../shared/shared.module';
import { LedgerModule } from '../ledger/ledger.module';
import { SalesModule } from '../sales/sales.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
@NgModule({
    declarations: [DaybookComponent, ExportDaybookComponent, DaybookAdvanceSearchModelComponent],
    providers: [],
    imports: [CommonModule,
        ReactiveFormsModule, DecimalDigitsModule,
        FormsModule, ModalModule,
        BsDatepickerModule,
        PaginationModule,
        DatepickerModule,
        Daterangepicker,
        DaybookRoutingModule,
        ShSelectModule,
        TooltipModule,
        ElementViewChildModule,
        CurrencyModule,
        SharedModule,
        NgxMaskModule.forRoot(),
        LedgerModule,
        SalesModule,
        NoDataModule
    ],
    entryComponents: [
        PaginationComponent
    ]
})
export class DaybookModule {
}
