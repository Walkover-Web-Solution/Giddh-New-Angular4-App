import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { DeleteVoucherConfirmationModalComponent } from "./delete-voucher-confirmation-modal.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        DeleteVoucherConfirmationModalComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        DeleteVoucherConfirmationModalComponent
    ]
})
/**
 * DeleteVoucherConfirmationModalModule module
 * Implements DeleteVoucherConfirmationModalModule functionality
 */
export class DeleteVoucherConfirmationModalModule {
    
}