import { NgModule } from '@angular/core';
import { TooltipModule, TypeaheadModule, CollapseModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
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
    CreateAccountModalComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    CollapseModule.forRoot()
  ],
  exports: [
    TooltipModule
  ],
  providers: []
})
export class SalesModule {}
