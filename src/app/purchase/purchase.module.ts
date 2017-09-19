import { NgModule } from '@angular/core';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase.invoice.component';
import { PurchaseComponent } from './purchase.component';
import { AsideMenuPurchaseInvoiceSettingComponent } from './purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component';
import { CollapseModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
/**
 * Created by kunalsaxena on 9/1/17.
 */

@NgModule({
  declarations: [PurchaseInvoiceComponent, PurchaseComponent, AsideMenuPurchaseInvoiceSettingComponent],
  imports: [
    PurchaseRoutingModule,
    CollapseModule.forRoot(),
    SharedModule
  ]
})
export class PurchaseModule { }
