import { NgModule } from '@angular/core';
import { AsideMenuRecurringEntryComponent } from './aside.menu.recurringEntry.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { SelectModule } from '../../theme/ng-select/ng-select';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared.module';

// import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { PaginationModule  } from 'ngx-bootstrap/pagination';
// import { CollapseModule } from 'ngx-bootstrap/collapse';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { TabsModule } from 'ngx-bootstrap/tabs';
// import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
    declarations: [AsideMenuRecurringEntryComponent],
    imports: [ReactiveFormsModule, BsDatepickerModule.forRoot(), CommonModule, SelectModule, LaddaModule, SharedModule],
    exports: [AsideMenuRecurringEntryComponent]
})
export class AsideMenuRecurringEntryModule {
}
