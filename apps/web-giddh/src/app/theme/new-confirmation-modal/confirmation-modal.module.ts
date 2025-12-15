import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NewConfirmationModalComponent } from './confirmation-modal.component';

@NgModule({
    declarations: [NewConfirmationModalComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule
    ],
    exports: [
        NewConfirmationModalComponent
    ],
})
export class NewConfirmationModalModule {
}
