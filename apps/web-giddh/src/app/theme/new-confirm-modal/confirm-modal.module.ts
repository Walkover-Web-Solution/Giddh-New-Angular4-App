import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmModalComponent } from './confirm-modal.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [ConfirmModalComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule
    ],
    exports: [
        ConfirmModalComponent
    ],
})
/**
 * NewConfirmModalModule module
 * Implements NewConfirmModalModule functionality
 */
export class NewConfirmModalModule {
}
