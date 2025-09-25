import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { DeleteVoucherConfirmationModalComponent } from "./delete-voucher-confirmation-modal.component";

@NgModule({
    declarations: [
        DeleteVoucherConfirmationModalComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        ReactiveFormsModule
    ],
    exports: [
        DeleteVoucherConfirmationModalComponent
    ]
})
export class DeleteVoucherConfirmationModalModule {
    
}