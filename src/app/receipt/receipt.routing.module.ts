import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ReceiptComponent } from 'app/receipt/receipt.component';
// import { PreviewDownloadReceiptComponent } from './models/preview-download-receipt.component';
// import { ReceiptUpdateComponent } from './receipt-update/receiptUpdate.component';

@NgModule({

  declarations: [
    // PreviewDownloadReceiptComponent,
    // ReceiptUpdateComponent
    ],
  imports: [
    RouterModule.forChild([
      {
        path: '', component: ReceiptComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ReceiptRoutingModule {
}
