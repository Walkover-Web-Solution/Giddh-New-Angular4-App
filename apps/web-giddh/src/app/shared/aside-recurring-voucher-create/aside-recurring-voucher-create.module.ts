import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { AsideRecurrenceVoucherCreateComponent } from './aside-recurring-voucher-create.component';
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';

@NgModule({
    declarations: [
        AsideRecurrenceVoucherCreateComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatDividerModule,
        TranslateDirectiveModule,
        GiddhDatepickerModule,
        FormFieldsModule
],
    exports: [
        AsideRecurrenceVoucherCreateComponent
    ]
})
export class AsideRecurringVoucherCreateModule { }
