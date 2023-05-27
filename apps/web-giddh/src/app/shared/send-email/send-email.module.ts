import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SendEmailComponent } from './send-email.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

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
