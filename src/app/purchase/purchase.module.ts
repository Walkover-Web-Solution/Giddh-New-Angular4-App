import { NgModule } from '@angular/core';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase.invoice.component';
import { PurchaseComponent } from './purchase.component';
/**
 * Created by kunalsaxena on 9/1/17.
 */

@NgModule({
  declarations: [ PurchaseInvoiceComponent, PurchaseComponent ],
  imports: [
    PurchaseRoutingModule
  ]
})
export class PurchaseModule {}
