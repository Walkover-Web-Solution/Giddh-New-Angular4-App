import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../giddh-page-loader/giddh-page-loader.module";
import { PurchaseOrderPreviewModalComponent } from "./purchase-order-preview.component";

@NgModule({
    declarations: [
        PurchaseOrderPreviewModalComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        MatDialogModule
    ],
    exports: [
        PurchaseOrderPreviewModalComponent
    ]
})
export class PurchaseOrderPreviewModule {

}