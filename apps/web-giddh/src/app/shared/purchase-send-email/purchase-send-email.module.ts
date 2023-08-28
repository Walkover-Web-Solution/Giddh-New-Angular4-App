import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { PurchaseSendEmailModalComponent } from "./purchase-send-email.component";

@NgModule({
    declarations: [
        PurchaseSendEmailModalComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [
        PurchaseSendEmailModalComponent
    ]
})
export class PurchaseSendEmailModule {

}