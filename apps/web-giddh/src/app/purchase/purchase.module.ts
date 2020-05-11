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
import { SharedModule } from '../shared/shared.module';
import { InvoiceRoutingModule } from '../invoice/invoice.routing.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import {
    AsideMenuPurchaseInvoiceSettingComponent,
} from './purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase.invoice.component';
import { ReconcileDesignComponent } from './purchase-invoice/reconcileDesign/reconcileDesign.component';
import { PurchaseRecordComponent } from './purchase-record/component/purchase-record.component';
import { PurchaseComponent } from './purchase.component';
import { PurchaseRoutingModule } from './purchase.routing.module';

/**
 * Created by kunalsaxena on 9/1/17.
 */

@NgModule({
    declarations: [
        PurchaseInvoiceComponent,
        PurchaseComponent,
        AsideMenuPurchaseInvoiceSettingComponent,
        ReconcileDesignComponent,
        PurchaseRecordComponent],
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
        SharedModule
    ],
    entryComponents: [],
    exports: [
        AsideMenuPurchaseInvoiceSettingComponent
    ]
})
export class PurchaseModule {
}
