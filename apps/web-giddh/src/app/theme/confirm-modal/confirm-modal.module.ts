import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmModalComponent } from './confirm-modal.component';

@NgModule({
    declarations: [ConfirmModalComponent],
    imports: [CommonModule],
    exports: [
        ConfirmModalComponent
    ],
})
export class ConfirmModalModule {
}
