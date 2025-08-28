import { NgModule } from "@angular/core";
import { GenerateEWayBillComponent } from "./generateEWayBill.component";
import { CommonModule } from "@angular/common";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
    declarations: [
        GenerateEWayBillComponent
    ],
    imports: [
        CommonModule,
        MatTooltipModule, 
        TranslateDirectiveModule
    ],
    exports: [
        GenerateEWayBillComponent
    ]
})
export class GenerateEWayBillModule { }