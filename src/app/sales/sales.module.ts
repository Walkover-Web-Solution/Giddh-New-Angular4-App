import { NgModule } from '@angular/core';
// import { TooltipModule, TypeaheadModule, CollapseModule } from 'ngx-bootstrap';
// import { DatepickerModule,BsDatepickerModule } from 'ngx-bootstrap/datepicker';
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
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

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
    CreateAccountServiceComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SelectModule.forRoot(),
    Select2Module.forRoot(),
    TaxControlModule.forRoot(),
    SalesRoutingModule,
    ModalModule,
    TooltipModule,
    TypeaheadModule,
    CollapseModule,
    SharedModule
  ],
  exports: [
    TooltipModule
  ],
  providers: []
})
export class SalesModule { }
