import { NgModule } from '@angular/core';
import { AccountDetailModalComponent } from './account-detail-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
    imports: [CommonModule, FormsModule, ModalModule],
    exports: [AccountDetailModalComponent],
    declarations: [AccountDetailModalComponent],
    providers: [],
})
export class AccountDetailModalModule {
}
