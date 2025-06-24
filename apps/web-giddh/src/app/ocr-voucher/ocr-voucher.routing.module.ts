import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OcrVoucherComponent } from './ocr-voucher.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: OcrVoucherComponent
            }
        ])
    ],
    exports: [RouterModule]
})

export class OcrVoucherRoutingModule {

}
