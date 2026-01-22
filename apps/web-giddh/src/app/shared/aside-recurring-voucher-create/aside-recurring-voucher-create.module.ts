import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { AsideRecurrenceVoucherCreateComponent } from './aside-recurring-voucher-create.component';
import { MatDivider, MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from '@angular/material/dialog';

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
        MatDatepickerModule,
        MatSelectModule,
        MatRadioModule,
        MatDividerModule
],
    exports: [
        AsideRecurrenceVoucherCreateComponent
    ]
})
export class AsideRecurringVoucherCreateModule { }
