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
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AsideMenuAccountInContactComponent } from './aside-menu-account/aside.menu.account.component';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { ContactAdvanceSearchComponent } from './advanceSearch/contactAdvanceSearch.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { AgingDropdownComponent } from './aging-dropdown/aging.dropdown.component'; // importing the module for table column sort
import { PaymentAsideComponent } from './payment-aside/payment-aside.component';
import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { GiddhCurrencyPipe } from '../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { LightboxModule } from 'ngx-lightbox';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRippleModule } from "@angular/material/core";

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
        NgxDaterangepickerMd.forRoot(),
        TextMaskModule,
        NgxMaskModule.forRoot(),
        NoDataModule,
        LightboxModule,
        MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTabsModule,
        MatRippleModule,
    ],
    entryComponents: [
        PaginationComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        GiddhCurrencyPipe
    ]
})
export class ContactModule {
}
