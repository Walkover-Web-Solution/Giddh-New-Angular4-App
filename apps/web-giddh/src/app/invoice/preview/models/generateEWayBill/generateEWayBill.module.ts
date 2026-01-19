import { NgModule } from "@angular/core";
import { GenerateEWayBillComponent } from "./generateEWayBill.component";
import { CommonModule } from "@angular/common";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        GenerateEWayBillComponent
    ],
    imports: [
        CommonModule,
        MatTooltipModule, 
        TranslateDirectiveModule,
        MatBadgeModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        GenerateEWayBillComponent
    ]
})
/**
 * GenerateEWayBillModule module
 * Implements GenerateEWayBillModule functionality
 */
export class GenerateEWayBillModule { }