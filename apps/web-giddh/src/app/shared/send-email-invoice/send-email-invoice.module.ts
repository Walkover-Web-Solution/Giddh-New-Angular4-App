import { NgModule } from '@angular/core';
import { SendEmailInvoiceComponent } from './send-email-invoice.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
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
