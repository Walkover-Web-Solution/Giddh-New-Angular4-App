import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { PurchaseComponent } from './purchase.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase.invoice.component';
import { Location } from '@angular/common';
/**
 * Created by kunalsaxena on 9/1/17.
 */

const INVOICE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [NeedsAuthentication],
    component: PurchaseComponent,
    children: [
      { path: '', redirectTo: 'purchase', pathMatch: 'full' },
      { path: 'invoice', component: PurchaseInvoiceComponent },
    ]
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(INVOICE_ROUTES),
  ],
  exports: [
    RouterModule,
  ],
  providers: [Location]
})
export class PurchaseRoutingModule { }
