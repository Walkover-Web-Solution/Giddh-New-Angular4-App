import { NgModule } from '@angular/core';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { VerifySubscriptionTransferOwnershipComponent } from './verify-subscription-transfer-ownership.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoaderModule } from '../loader/loader.module';
import { SnackBarModule } from '../theme/snackbar/snackbar.module';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        TranslateDirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        FormFieldsModule,
        MatSnackBarModule,
        SnackBarModule,
        MatDialogModule,
        MatButtonModule,
        LoaderModule,
        CommonModule
    ],
    exports: [VerifySubscriptionTransferOwnershipComponent
    ],
    declarations: [
        VerifySubscriptionTransferOwnershipComponent
    ]
})
export class VerifySubscriptionTransferOwnershipModule { }
