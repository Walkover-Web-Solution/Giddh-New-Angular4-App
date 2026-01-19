import { NgModule } from "@angular/core";
import { VoucherNamePipe } from "./voucher-name.pipe";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        VoucherNamePipe
    ],
    exports: [
        VoucherNamePipe
    ]
})
/**
 * VoucherNameModule module
 * Implements VoucherNameModule functionality
 */
export class VoucherNameModule {
    
}