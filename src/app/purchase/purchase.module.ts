import { NgModule } from '@angular/core';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase.invoice.component';
import { PurchaseComponent } from './purchase.component';
import { AsideMenuPurchaseInvoiceSettingComponent } from './purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component';
import { SharedModule } from '../shared/shared.module';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
/**
 * Created by kunalsaxena on 9/1/17.
 */

@NgModule({
  declarations: [PurchaseInvoiceComponent, PurchaseComponent, AsideMenuPurchaseInvoiceSettingComponent],
  imports: [
    PurchaseRoutingModule,
    CollapseModule,
    PaginationModule,
    DatepickerModule,
    BsDropdownModule,
    SharedModule
  ]
})
export class PurchaseModule { }
