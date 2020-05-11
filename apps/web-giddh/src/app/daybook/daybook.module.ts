import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DaybookRoutingModule } from './daybook.routing.module';
import { DaybookComponent } from './daybook.component';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { DaybookAdvanceSearchModelComponent } from 'apps/web-giddh/src/app/daybook/advance-search/daybook-advance-search.component';
import { ShSelectModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module';
import { DecimalDigitsModule } from 'apps/web-giddh/src/app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ModalModule, PaginationComponent, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ExportDaybookComponent } from './export-daybook/export-daybook.component';

@NgModule({
    declarations: [DaybookComponent, ExportDaybookComponent, DaybookAdvanceSearchModelComponent],
    providers: [],
    imports: [CommonModule,
        ReactiveFormsModule, DecimalDigitsModule,
        FormsModule, ModalModule,
        BsDatepickerModule,
        PaginationModule,
        DatepickerModule,
        Daterangepicker,
        DaybookRoutingModule,
        ShSelectModule,
        TooltipModule,
        ElementViewChildModule,
        SharedModule
    ],
    entryComponents: [
        PaginationComponent
    ]
})
export class DaybookModule {
}
