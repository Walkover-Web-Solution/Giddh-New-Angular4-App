import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
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
        PerfectScrollbarModule,
        MatButtonModule,
        FormFieldsModule
    ],
    exports: [
        VoucherAddBulkItemsComponent
    ]
})
export class VoucherAddBulkItemsModule {

}
