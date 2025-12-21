import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SendEmailComponent } from './send-email.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatDialogModule,
        TranslateDirectiveModule,
        FormFieldsModule,
        MatCheckboxModule,
        MatButtonModule
    ],
    exports: [
        SendEmailComponent
    ],
    declarations: [
        SendEmailComponent
    ]
})
export class SendEmailModule {
}
