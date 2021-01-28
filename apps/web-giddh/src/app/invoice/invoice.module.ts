import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { ProformaInvoiceModule } from '../proforma-invoice/proforma-invoice.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { DownloadBulkInvoiceComponent } from './download-bulk-invoice/download-bulk-invoice.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    declarations: [],
    imports: [
        InvoiceRoutingModule,
        ProformaInvoiceModule,
        DigitsOnlyModule,
        PurchaseModule,
        DownloadBulkInvoiceComponent,
        SharedModule
    ],
    exports: [
        InvoiceRoutingModule,
    ]
})
export class InvoiceModule {
}
