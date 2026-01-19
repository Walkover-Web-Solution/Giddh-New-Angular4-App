import { NgModule } from '@angular/core';
import { EWayBillCreateComponent } from './create/e-way-bill-create-component';
import { HamburgerMenuModule } from '../header/components/hamburger-menu/hamburger-menu.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        EWayBillCreateComponent
    ],
    imports: [
        TranslateDirectiveModule,
        HamburgerMenuModule,
        MatFormFieldModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GiddhDatepickerModule,
        FormFieldsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        EWayBillCreateComponent
    ]
})
/**
 * EWayBillModule module
 * Implements EWayBillModule functionality
 */
export class EWayBillModule { }