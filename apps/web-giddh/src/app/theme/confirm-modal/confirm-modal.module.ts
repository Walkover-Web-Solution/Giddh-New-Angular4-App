import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmModalComponent } from './confirm-modal.component';
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";

@NgModule({
    declarations: [ConfirmModalComponent],
    imports: [CommonModule, MatButtonModule],
    exports: [
        ConfirmModalComponent
    ],
})
export class ConfirmModalModule {
}
