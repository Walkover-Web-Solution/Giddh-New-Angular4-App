import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ElementViewChildModule } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
// import { SharedModule } from '../shared/shared.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { AsideMenuSalesOtherTaxesModule } from './aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DiscountListComponent } from './discount-list/discountList.component';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";
export const FIXED_CATEGORY_OF_GROUPS = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost', 'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];

@NgModule({
    declarations: [
        DiscountListComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ElementViewChildModule,
        TaxControlModule,
        LaddaModule.forRoot({ style: 'slide-left',
        spinnerSize: 30
    
    ]
        }),
        DigitsOnlyModule,
        DecimalDigitsModule,
        // AsideMenuRecurringEntryModule, // NG6002 error - temporarily disabled
        ClickOutsideModule,
        AsideMenuSalesOtherTaxesModule,
        MatCheckboxModule
    ],
    exports: [
        DiscountListComponent
    ],
    providers: []
})
export class SalesModule {
}
