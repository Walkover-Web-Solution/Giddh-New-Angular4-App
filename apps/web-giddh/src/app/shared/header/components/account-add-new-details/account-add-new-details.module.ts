import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { TranslateDirectiveModule } from 'apps/web-giddh/src/app/theme/translate/translate.directive.module';
import { AccountAddNewDetailsComponent } from './account-add-new-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BulkAddDialogComponent } from '../bulk-add-dialog/bulk-add-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { FormFieldsModule } from 'apps/web-giddh/src/app/theme/form-fields/form-fields.module';
import { NewConfirmModalModule } from 'apps/web-giddh/src/app/theme/new-confirm-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SalesPersonService } from '../../../sales-person/utility/sales-person.service';
import { MobileNumberInputComponent } from '../../../mobile-number-input';

@NgModule({
    declarations: [AccountAddNewDetailsComponent, BulkAddDialogComponent],
    exports: [AccountAddNewDetailsComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        MatSlideToggleModule,
        RouterModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule,
        MatRadioModule,
        MatTabsModule,
        FormFieldsModule,
        NewConfirmModalModule,
        MatTooltipModule,
        MobileNumberInputComponent
    ],
    providers: [SalesPersonService]
})
export class AccountAddNewDetailsModule { }
