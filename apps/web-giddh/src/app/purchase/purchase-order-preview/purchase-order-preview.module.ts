import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { PurchaseOrderPreviewModalComponent } from "./purchase-order-preview.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { GiddhPageLoaderModule } from "../../shared/giddh-page-loader/giddh-page-loader.module";

@NgModule({
    declarations: [
        PurchaseOrderPreviewModalComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        PurchaseOrderPreviewModalComponent
    ]
})
export class PurchaseOrderPreviewModule {

}
