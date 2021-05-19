import { NgModule } from '@angular/core';
import { SendEmailInvoiceComponent } from './send-email-invoice.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';

@NgModule({
	imports: [
		FormsModule,
        CommonModule,
        SharedModule
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
