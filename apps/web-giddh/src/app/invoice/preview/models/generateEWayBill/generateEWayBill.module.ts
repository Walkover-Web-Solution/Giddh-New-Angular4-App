import { NgModule } from "@angular/core";
import { GenerateEWayBillComponent } from "./generateEWayBill.component";
import { CommonModule } from "@angular/common";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
    declarations: [
        GenerateEWayBillComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        ModalModule.forRoot()
    ],
    exports: [
        GenerateEWayBillComponent
    ]
})
export class GenerateEWayBillModule { }