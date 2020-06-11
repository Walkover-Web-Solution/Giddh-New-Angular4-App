import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { LaddaModule } from 'angular2-ladda';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact.routing.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule, PaginationComponent, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AsideMenuAccountInContactComponent } from './aside-menu-account/aside.menu.account.component';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { GhSortByPipeModule } from '../shared/helpers/pipes/ghSortByPipe/ghSortByPipe.module';
import { ContactAdvanceSearchComponent } from './advanceSearch/contactAdvanceSearch.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { AgingDropdownComponent } from './aging-dropdown/aging.dropdown.component'; // importing the module for table column sort
import { PaymentAsideComponent } from './payment-aside/payment-aside.component';
import { GenericAsideMenuAccountModule } from '../shared/generic-aside-menu-account/generic-aside-menu-account.module';
import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
//payemnt aside component


// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    suppressScrollY: true
};

@NgModule({
    declarations: [
        ContactComponent,
        AsideMenuAccountInContactComponent,
        ContactAdvanceSearchComponent,
        AgingReportComponent,
        AgingDropdownComponent,
        PaymentAsideComponent
    ],
    exports: [
        AsideMenuAccountInContactComponent, CurrencyModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ContactRoutingModule,
        LaddaModule,
        ShSelectModule,
        TabsModule,
        BsDropdownModule,
        TooltipModule,
        SharedModule,
        SelectModule.forRoot(),
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        PaginationModule,
        ClickOutsideModule,
        DigitsOnlyModule,
        ElementViewChildModule,
        CurrencyModule,
        Daterangepicker,
        Ng2OrderModule,
        PerfectScrollbarModule,
        GhSortByPipeModule,
        GenericAsideMenuAccountModule,
        NgxDaterangepickerMd.forRoot(),
        TextMaskModule,
        NgxMaskModule.forRoot(),

    ],
    entryComponents: [
        PaginationComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class ContactModule {
}
