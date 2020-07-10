import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { AlertModule, TabsModule } from 'ngx-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { InvoiceRoutingModule } from '../invoice/invoice.routing.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import {
    AsideMenuPurchaseInvoiceSettingComponent,
} from './purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase.invoice.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { PurchaseOrderInvoicePreviewComponent } from './purchase-order-invoice-preview/purchase-order-invoice-preview.component'
import { OrderHistoryComponent } from './order-history/order-history.component'
import { ReconcileDesignComponent } from './purchase-invoice/reconcileDesign/reconcileDesign.component';
import { PurchaseRecordComponent } from './purchase-record/component/purchase-record.component';
import { PurchaseSettingComponent } from './purchase-setting/purchase-setting.component';
import { PurchaseComponent } from './purchase.component';
import { PurchaseAdvanceSearchComponent } from './purchase-advance-search/purchase-advance-search.component';
import { PurchaseSendEmailModalComponent } from './purchase-send-email/purchase-send-email.component';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SharedModule } from '../shared/shared.module';

/**
 * Created by kunalsaxena on 9/1/17.
 */

@NgModule({
    declarations: [
        PurchaseInvoiceComponent,
        PurchaseOrderComponent,
        CreatePurchaseOrderComponent,
        PurchaseOrderInvoicePreviewComponent,
        PurchaseComponent,
        AsideMenuPurchaseInvoiceSettingComponent,
        ReconcileDesignComponent,
        PurchaseRecordComponent,
        OrderHistoryComponent,
        PurchaseSettingComponent,
        PurchaseAdvanceSearchComponent,
        PurchaseSendEmailModalComponent],
    imports: [
        PurchaseRoutingModule,
        CollapseModule,
        PaginationModule,
        DatepickerModule,
        BsDropdownModule,
        Daterangepicker,
        LaddaModule,
        HighlightModule,
        TooltipModule,
        ClickOutsideModule,
        TabsModule,
        AlertModule,
        ElementViewChildModule,
        PerfectScrollbarModule,
        InvoiceRoutingModule,
        ShSelectModule,
        SharedModule
    ],
    entryComponents: [],
    exports: [
        AsideMenuPurchaseInvoiceSettingComponent,
    ]
})
export class PurchaseModule {
}
