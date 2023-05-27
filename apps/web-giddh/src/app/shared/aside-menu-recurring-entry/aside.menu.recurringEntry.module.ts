import { NgModule } from '@angular/core';
import { AsideMenuRecurringEntryComponent } from './aside.menu.recurringEntry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { SelectModule } from '../../theme/ng-select/ng-select';
import { LaddaModule } from 'angular2-ladda';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';


@NgModule({
    declarations: [AsideMenuRecurringEntryComponent],
    imports: [
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        CommonModule,
        SelectModule,
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
export class AsideMenuRecurringEntryModule {
}
