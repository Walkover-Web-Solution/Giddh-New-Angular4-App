import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
