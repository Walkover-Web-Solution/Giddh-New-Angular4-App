import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../giddh-page-loader/giddh-page-loader.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BulkExportVoucherComponent } from "./bulk-export-voucher.component";



@NgModule({
    declarations: [
        BulkExportVoucherComponent
    ],
    exports: [
        BulkExportVoucherComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        MatCheckboxModule
    ],
    providers: [
    ]
})
export class BulkExportVoucherModule {
}
