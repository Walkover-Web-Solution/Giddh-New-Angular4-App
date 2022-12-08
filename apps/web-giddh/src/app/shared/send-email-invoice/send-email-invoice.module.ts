import { NgModule } from '@angular/core';
import { SendEmailInvoiceComponent } from './send-email-invoice.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateDirectiveModule,
        MatInputModule,
        MatCheckboxModule
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
