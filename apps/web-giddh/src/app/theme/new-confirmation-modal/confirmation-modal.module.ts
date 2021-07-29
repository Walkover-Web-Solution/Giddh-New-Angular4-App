import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NewConfirmationModalComponent } from './confirmation-modal.component';

@NgModule({
    declarations: [NewConfirmationModalComponent],
    imports: [
        CommonModule,
        MatButtonModule
    ],
    exports: [
        NewConfirmationModalComponent
    ],
})
export class NewConfirmationModalModule {
}
