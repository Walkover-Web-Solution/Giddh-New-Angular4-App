import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InvoiceRoutingModule } from '../invoice/invoice.routing.module';
import { ProformaInvoiceModule } from '../proforma-invoice/proforma-invoice.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { SharedModule } from '../shared/shared.module';
import { DiscountControlModule } from '../theme/discount-control/discount-control.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import {
    PurchaseAdvanceSearchComponent,
} from './purchase-advance-search/purchase-advance-search.component';
import { PurchaseOrderPreviewComponent } from './purchase-order-preview/purchase-order-preview.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseRecordComponent } from './purchase-record/component/purchase-record.component';
import { PurchaseSettingComponent } from './purchase-setting/purchase-setting.component';
import { PurchaseComponent } from './purchase.component';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';


@NgModule({
    declarations: [
        PurchaseOrderComponent,
        CreatePurchaseOrderComponent,
        PurchaseOrderPreviewComponent,
        PurchaseComponent,
        PurchaseRecordComponent,
        PurchaseSettingComponent,
        PurchaseAdvanceSearchComponent
    ],
    imports: [
        PurchaseRoutingModule,
        CollapseModule,
        PaginationModule.forRoot(),
        DatepickerModule,
        BsDropdownModule.forRoot(),
        Daterangepicker,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        HighlightModule,
        TooltipModule.forRoot(),
        ClickOutsideModule,
        TabsModule.forRoot(),
        AlertModule,
        ElementViewChildModule,
        PerfectScrollbarModule,
        InvoiceRoutingModule,
        ShSelectModule,
        SharedModule,
        SalesShSelectModule,
        CurrencyModule,
        NgxMaskModule.forRoot(),
        TaxControlModule,
        DiscountControlModule,
        ProformaInvoiceModule,
        NoDataModule,
        NgxBootstrapSwitchModule.forRoot(),
    ],
    entryComponents: [],
    exports: [

    ]
})
export class PurchaseModule {
}
