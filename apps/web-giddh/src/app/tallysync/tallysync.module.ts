import { NgModule } from '@angular/core';

import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { TallysyncRoutingModule } from './tallysync.routing.module';
import { SharedModule } from './../shared/shared.module';
import { HamburgerMenuComponentModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TallysyncComponent } from './tallysync.component';
import { InprogressComponent } from './inprogress/inprogress.component';
import { CompletedComponent } from './completed/completed.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LaddaModule } from 'angular2-ladda';
import { TextMaskModule } from 'angular2-text-mask';
import { ClickOutsideModule } from 'ng-click-outside';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxUploaderModule } from 'ngx-uploader';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { InvoiceUiDataService } from '../services/invoice.ui.data.service';
import { TallySyncService } from '../services/tally-sync.service';
@NgModule({
    declarations: [
        TallysyncComponent,
        InprogressComponent,
        CompletedComponent
    ],
    imports: [
        TallysyncRoutingModule,
        DigitsOnlyModule,
        SharedModule,
        HamburgerMenuComponentModule,
        FormsModule,
        CommonModule,
        TabsModule,
        ReactiveFormsModule,
        ModalModule,
        TooltipModule,
        PaginationModule,
        KeyboardShortutModule,
        BsDatepickerModule.forRoot(),
        CollapseModule.forRoot(),
        NgxUploaderModule,
        SelectModule,
        LaddaModule,
        ShSelectModule,
        ClickOutsideModule,
        ElementViewChildModule,
        DecimalDigitsModule,
        DatepickerModule,
        BsDropdownModule,
        SalesShSelectModule,
        TextMaskModule,
        Daterangepicker,
        SharedModule
    ],
    exports: [
        TallysyncRoutingModule
    ],
    entryComponents: [TallysyncComponent],
    providers: [InvoiceUiDataService, TallySyncService]
})
export class TallysyncModule {
}
