import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmModalComponent } from './confirm-modal.component';
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [ConfirmModalComponent],
    imports: [CommonModule, MatButtonModule],
    exports: [
        ConfirmModalComponent
    ],
})
export class ConfirmModalModule {
}
