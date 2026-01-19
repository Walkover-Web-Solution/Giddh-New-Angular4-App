import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../giddh-page-loader/giddh-page-loader.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { BulkExportVoucherComponent } from "./bulk-export-voucher.component";



/**
 * Handles NgModule functionality
 */
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
        ReactiveFormsModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        MatCheckboxModule,
        MatDialogModule,
        MatButtonModule
    ],
    providers: [
    ]
})
/**
 * BulkExportVoucherModule module
 * Implements BulkExportVoucherModule functionality
 */
export class BulkExportVoucherModule {
}
