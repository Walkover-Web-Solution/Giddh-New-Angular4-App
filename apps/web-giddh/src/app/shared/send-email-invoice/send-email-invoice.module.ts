import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SendEmailInvoiceComponent } from './send-email-invoice.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateDirectiveModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDialogModule,
        FormFieldsModule
    ],
    exports: [
        SendEmailInvoiceComponent
    ],
    declarations: [
        SendEmailInvoiceComponent
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SendEmailInvoiceModule {
}
