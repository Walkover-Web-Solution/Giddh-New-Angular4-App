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
import { MatDivider } from "@angular/material/divider";

@NgModule({
    declarations: [
        AsideRecurrenceVoucherCreateComponent
    ],
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    FormsModule,
    MatDivider
],
    exports: [
        AsideRecurrenceVoucherCreateComponent
    ]
})
export class AsideRecurringVoucherCreateModule { }
