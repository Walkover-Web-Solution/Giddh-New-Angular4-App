import { NgModule } from '@angular/core';
import { AccountDetailModalComponent } from './account-detail-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [AccountDetailModalComponent],
  declarations: [AccountDetailModalComponent],
  providers: [],
})
export class AccountDetailModalModule {
}
