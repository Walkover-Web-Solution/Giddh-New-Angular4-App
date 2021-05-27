import { NgModule } from '@angular/core';
import { VoucherTypeToNamePipe } from './voucherTypeToNamePipe.pipe';

@NgModule({
    imports: [],
    exports: [VoucherTypeToNamePipe],
    declarations: [VoucherTypeToNamePipe],
    providers: [VoucherTypeToNamePipe],
})
export class VoucherTypeToNamePipeModule {
}
