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
import { AsideMenuAccountComponent } from './aside-menu-account/aside.menu.account.component';
import { DiscountListComponent } from './discount-list/discountList.component';
import { AsideMenuProductServiceComponent } from './aside-menu-product-service/component';
import { SalesAddStockComponent } from './aside-menu-product-service/components/create-stock/sales.create.stock.component';
import { SalesAddStockGroupComponent } from './aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal';
import { CreateAccountModalComponent } from './aside-menu-product-service/components/create-account-modal/create.account.modal';
import { CreateAccountServiceComponent } from './aside-menu-product-service/components/create-account-service/create.account.service';
import { SalesRoutingModule } from './sales.routing.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { Select2Module } from '../theme/select2';
import { SharedModule } from '../shared/shared.module';
import { LaddaModule } from 'angular2-ladda';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { ElementViewChildModule } from 'app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { QuickAccountModule } from 'app/theme/quick-account-component/quickAccount.module';
import { SalesTaxListComponent } from 'app/sales/tax-list/sales.tax.list.component';

export const FIXED_CATEGORY_OF_GROUPS = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost', 'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];

@NgModule({
  declarations: [
    SalesComponent,
    SalesInvoiceComponent,
    AsideMenuAccountComponent,
    AsideMenuProductServiceComponent,
    DiscountListComponent,
    SalesAddStockComponent,
    SalesAddStockGroupComponent,
    CreateAccountModalComponent,
    CreateAccountServiceComponent,
    SalesTaxListComponent
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
    QuickAccountModule.forRoot()
  ],
  exports: [
    TooltipModule,
    SalesAddStockGroupComponent
  ],
  entryComponents: [ ],
  providers: []
})
export class SalesModule {
}
