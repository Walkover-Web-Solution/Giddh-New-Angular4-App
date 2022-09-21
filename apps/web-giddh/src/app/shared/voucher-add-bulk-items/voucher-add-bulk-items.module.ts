import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { VoucherAddBulkItemsComponent } from "./voucher-add-bulk-items.component";

@NgModule({
    declarations: [
        VoucherAddBulkItemsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateDirectiveModule,
        PerfectScrollbarModule
    ],
    exports: [
        VoucherAddBulkItemsComponent
    ]
})
export class VoucherAddBulkItemsModule {

}