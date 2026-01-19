import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "./confirmation-modal.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [ConfirmationModalComponent],
    imports: [CommonModule, MatButtonModule, MatDialogModule],
    exports: [ConfirmationModalComponent]
})
/**
 * ConfirmationModalModule module
 * Implements ConfirmationModalModule functionality
 */
export class ConfirmationModalModule {}
