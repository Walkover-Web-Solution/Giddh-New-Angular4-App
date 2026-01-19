import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmModalComponent } from './confirm-modal.component';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [ConfirmModalComponent],
    imports: [CommonModule, MatButtonModule, MatDialogModule],
    exports: [
        ConfirmModalComponent
    ],
})
/**
 * ConfirmModalModule module
 * Implements ConfirmModalModule functionality
 */
export class ConfirmModalModule {
}