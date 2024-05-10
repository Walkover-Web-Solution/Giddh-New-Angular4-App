import { NgModule } from "@angular/core";
import { VoucherCopyLinkPipe } from "./voucher-copy-link.pipe";

@NgModule({
    declarations: [
        VoucherCopyLinkPipe
    ],
    exports: [
        VoucherCopyLinkPipe
    ]
})
export class VoucherCopyLinkModule {
    
}