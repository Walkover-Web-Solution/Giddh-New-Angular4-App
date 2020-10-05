import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { SalesTaxListComponent } from 'apps/web-giddh/src/app/sales/tax-list/sales.tax.list.component';
import {
    ElementViewChildModule,
} from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { QuickAccountModule } from 'apps/web-giddh/src/app/theme/quick-account-component/quickAccount.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxUploaderModule } from 'ngx-uploader';

import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { AsideMenuSalesOtherTaxes } from './aside-menu-sales-other-taxes/aside-menu-sales-other-taxes';
import { SalesInvoiceComponent } from './create/sales.invoice.component';
import { DiscountListComponent } from './discount-list/discountList.component';
import { SalesAsideMenuAccountComponent } from './sales-aside-menu-account/sales.aside.menu.account.component';
import { SalesComponent } from './sales.component';
import { SalesRoutingModule } from './sales.routing.module';
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
        TypeaheadModule.forRoot(),
        CollapseModule,
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
