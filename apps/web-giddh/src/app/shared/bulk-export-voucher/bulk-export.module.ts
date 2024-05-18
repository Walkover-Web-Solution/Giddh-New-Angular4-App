import { NgModule } from "@angular/core";
import { BulkExportComponent } from "./bulk-export.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../giddh-page-loader/giddh-page-loader.module";



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
