import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxAuthorityComponent } from './tax-authority.component';
// import { FormFieldsModule } from '../form-fields/form-fields.module';
// Temporarily disabled;
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DatepickerWrapperModule } from '../../shared/datepicker-wrapper/datepicker.wrapper.module';
// import { GiddhPageLoaderModule } from '../../shared/giddh-page-loader/giddh-page-loader.module';
import { GiddhDateRangepickerModule } from '../giddh-daterangepicker/giddh-daterangepicker.module';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';
import { HamburgerMenuModule } from '../../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TaxSidebarModule } from '../../shared/tax-sidebar/tax-sidebar.module';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { VatReportFiltersComponent } from '../../vat-report/vat-report-filters/vat-report-filters.component';
// Using VatReportModule instead
import { TaxAuthorityReportComponent } from './reports/tax-authority-report/tax-authority-report.component';
import { RateWiseReportComponent } from './reports/rate-wise-report/rate-wise-report.component';
import { VatReportModule } from '../../vat-report/vat-report.module';
import { AmountFieldComponentModule } from '../../shared/amount-field/amount-field.module';
import { AccountWiseReportComponent } from './reports/account-wise-report/account-wise-report.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatTableModule,
        MatDialogModule,
        GiddhDateRangepickerModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        TaxSidebarModule,
        VatReportModule
    
    ],
    exports: [
        TaxAuthorityComponent,
        TaxAuthorityReportComponent,
        RateWiseReportComponent,
        AccountWiseReportComponent,
        CreateComponent
    
    ],
    declarations: [
        TaxAuthorityComponent,
        TaxAuthorityReportComponent,
        RateWiseReportComponent,
        AccountWiseReportComponent,
        CreateComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ]
})
export class TaxAuthorityModule { }
