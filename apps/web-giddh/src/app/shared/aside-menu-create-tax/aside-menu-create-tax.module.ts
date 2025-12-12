import { NgModule } from '@angular/core';
import { AsideMenuCreateTaxComponent } from './aside-menu-create-tax.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { GiddhDatepickerModule } from "../../theme/giddh-datepicker/giddh-datepicker.module";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { GiddhProgressSpinnerComponent } from '../giddh-progress-spinner/giddh-progress-spinner.component';
import { DatepickerWrapperModule } from '../datepicker-wrapper/datepicker.wrapper.module';
import { KeyboardShortutModule } from '../helpers/directives/keyboardShortcut/keyboardShortut.module';


@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        ReactiveFormsModule,
        FormFieldsModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        GiddhDatepickerModule,
        DatepickerWrapperModule,
        MatFormFieldModule,
        MatDialogModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        GiddhProgressSpinnerComponent,
        KeyboardShortutModule
    ],
    exports: [AsideMenuCreateTaxComponent],
    declarations: [AsideMenuCreateTaxComponent],
    providers: [],
})
export class AsideMenuCreateTaxModule {
}
