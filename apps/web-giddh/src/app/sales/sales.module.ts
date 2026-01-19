import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ElementViewChildModule } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { SharedModule } from '../shared/shared.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { AsideMenuSalesOtherTaxesModule } from './aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DiscountListComponent } from './discount-list/discountList.component';
export const FIXED_CATEGORY_OF_GROUPS = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost', 'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        DiscountListComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ElementViewChildModule,
        TaxControlModule,
        SharedModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        DigitsOnlyModule,
        DecimalDigitsModule,
        AsideMenuRecurringEntryModule,
        ClickOutsideModule,
        AsideMenuSalesOtherTaxesModule,
        MatCheckboxModule
    ],
    exports: [
        DiscountListComponent
    ],
    providers: []
})
/**
 * SalesModule module
 * Implements SalesModule functionality
 */
export class SalesModule {
}
