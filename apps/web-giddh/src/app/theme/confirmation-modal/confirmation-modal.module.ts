import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { ConfirmationModalComponent } from "./confirmation-modal.component";

@NgModule({
    declarations: [ConfirmationModalComponent],
    imports: [CommonModule, MatButtonModule],
    exports: [ConfirmationModalComponent]
})
export class ConfirmationModalModule {}
