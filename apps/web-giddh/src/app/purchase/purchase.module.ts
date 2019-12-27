import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgModule } from '@angular/core';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase.invoice.component';
import { PurchaseComponent } from './purchase.component';
import { AsideMenuPurchaseInvoiceSettingComponent } from './purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { AlertModule, TabsModule } from 'ngx-bootstrap';
import { ReconcileDesignComponent } from './purchase-invoice/reconcileDesign/reconcileDesign.component';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

/**
 * Created by kunalsaxena on 9/1/17.
 */

@NgModule({
    declarations: [PurchaseInvoiceComponent, PurchaseComponent, AsideMenuPurchaseInvoiceSettingComponent, ReconcileDesignComponent],
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
        PerfectScrollbarModule
    ],
    entryComponents: [
        PaginationComponent
    ],
    exports: [
        AsideMenuPurchaseInvoiceSettingComponent
    ]
})
export class PurchaseModule {
}
