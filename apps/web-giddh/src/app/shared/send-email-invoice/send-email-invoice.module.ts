import { NgModule } from '@angular/core';
import { SendEmailInvoiceComponent } from './send-email-invoice.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TabsModule
  ],
  exports: [
    SendEmailInvoiceComponent
  ],
  declarations: [
    SendEmailInvoiceComponent
  ],
  providers: [],
})
export class SendEmailInvoiceModule {
}
