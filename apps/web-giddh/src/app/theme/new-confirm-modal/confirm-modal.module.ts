import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ConfirmModalComponent } from './confirm-modal.component';

@NgModule({
    declarations: [ConfirmModalComponent],
    imports: [
        CommonModule,
        MatButtonModule
    ],
    exports: [
        ConfirmModalComponent
    ],
})
export class NewConfirmModalModule {
}
