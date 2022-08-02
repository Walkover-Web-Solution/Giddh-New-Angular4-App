import { NgModule } from '@angular/core';
import { AsideMenuRecurringEntryComponent } from './aside.menu.recurringEntry.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { SelectModule } from '../../theme/ng-select/ng-select';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [AsideMenuRecurringEntryComponent],
    imports: [ReactiveFormsModule, BsDatepickerModule.forRoot(), CommonModule, SelectModule, LaddaModule.forRoot({
        style: 'slide-left',
        spinnerSize: 30
    }), SharedModule],
    exports: [AsideMenuRecurringEntryComponent]
})
export class AsideMenuRecurringEntryModule {
}
