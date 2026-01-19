import { NgModule } from '@angular/core';
import { AsideMenuRecurringEntryComponent } from './aside.menu.recurringEntry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LaddaModule } from 'angular2-ladda';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';


/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [AsideMenuRecurringEntryComponent],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        TranslateDirectiveModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        GiddhDatepickerModule,
        MatCheckboxModule,
        MatButtonModule,
        FormFieldsModule
    ],
    exports: [AsideMenuRecurringEntryComponent]
})
/**
 * AsideMenuRecurringEntryModule module
 * Implements AsideMenuRecurringEntryModule functionality
 */
export class AsideMenuRecurringEntryModule {
}
