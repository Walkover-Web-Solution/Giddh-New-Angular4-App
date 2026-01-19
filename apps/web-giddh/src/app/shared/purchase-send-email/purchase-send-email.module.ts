import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { PurchaseSendEmailModalComponent } from "./purchase-send-email.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        PurchaseSendEmailModalComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        PurchaseSendEmailModalComponent
    ]
})
/**
 * PurchaseSendEmailModule module
 * Implements PurchaseSendEmailModule functionality
 */
export class PurchaseSendEmailModule {

}