import { NgModule } from '@angular/core';
// import { TooltipModule, TypeaheadModule, CollapseModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { PaginationModule  } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesComponent } from './sales.component';
import { SalesInvoiceComponent } from './create/sales.invoice.component';
import { DiscountListComponent } from './discount-list/discountList.component';
import { SalesRoutingModule } from './sales.routing.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { LaddaModule } from 'angular2-ladda';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { ElementViewChildModule } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { QuickAccountModule } from 'apps/web-giddh/src/app/theme/quick-account-component/quickAccount.module';
import { SalesTaxListComponent } from 'apps/web-giddh/src/app/sales/tax-list/sales.tax.list.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxUploaderModule } from 'ngx-uploader';
import { SalesAsideMenuAccountComponent } from './sales-aside-menu-account/sales.aside.menu.account.component';
import { AsideMenuSalesOtherTaxes } from './aside-menu-sales-other-taxes/aside-menu-sales-other-taxes';

export const FIXED_CATEGORY_OF_GROUPS = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost', 'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];

@NgModule({
    declarations: [
        SalesComponent,
        SalesInvoiceComponent,
        SalesAsideMenuAccountComponent,
        DiscountListComponent,
        SalesTaxListComponent,
        AsideMenuSalesOtherTaxes
    ],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        SelectModule.forRoot(),
        ElementViewChildModule,
        // Select2Module.forRoot(),
        TaxControlModule.forRoot(),
        SalesRoutingModule,
        ModalModule,
        TooltipModule,
        TypeaheadModule,
        CollapseModule,
        BsDatepickerModule.forRoot(),
        SharedModule,
        LaddaModule,
        DigitsOnlyModule,
        DecimalDigitsModule,
        ShSelectModule,
        SalesShSelectModule,
        QuickAccountModule.forRoot(),
        BsDropdownModule,
        AsideMenuRecurringEntryModule,
        ClickOutsideModule,
        NgxUploaderModule
    ],
    exports: [
        // TooltipModule,
        DiscountListComponent,
        // SalesTaxListComponent,
        // SalesAsideMenuAccountComponent,
        AsideMenuSalesOtherTaxes
    ],
    entryComponents: [],
    providers: []
})
export class SalesModule {
}
