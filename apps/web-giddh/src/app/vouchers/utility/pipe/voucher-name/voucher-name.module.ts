import { NgModule } from "@angular/core";
import { VoucherNamePipe } from "./voucher-name.pipe";

@NgModule({
    declarations: [
        VoucherNamePipe
    ],
    exports: [
        VoucherNamePipe
    ]
})
export class VoucherNameModule {
    
}