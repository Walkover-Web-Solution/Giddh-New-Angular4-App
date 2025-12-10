import { NgModule } from '@angular/core';
import { AsideMenuCreateTaxComponent } from './aside-menu-create-tax.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
// import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatButtonModule } from '@angular/material/button';
import { GiddhDatepickerModule } from "../../theme/giddh-datepicker/giddh-datepicker.module";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { GiddhProgressSpinnerComponent } from '../giddh-progress-spinner/giddh-progress-spinner.component';
import { DatepickerWrapperModule } from '../datepicker-wrapper/datepicker.wrapper.module';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GiddhDatepickerModule,
        MatDialogModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        GiddhProgressSpinnerComponent
    
    ],
    exports: [
        AsideMenuCreateTaxComponent
    ],
    declarations: [
        AsideMenuCreateTaxComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    providers: [],
})
export class AsideMenuCreateTaxModule {
}
