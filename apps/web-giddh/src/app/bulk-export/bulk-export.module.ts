import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BulkExportComponent } from "./bulk-export.component";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { ShSelectModule } from "../theme/ng-virtual-select/sh-select.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";


@NgModule({
    declarations: [
        BulkExportComponent
    ],
    exports: [
        BulkExportComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ShSelectModule,
        ModalModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule
    ],
    providers: [
    ]
})
export class BulkExportModule {
}
