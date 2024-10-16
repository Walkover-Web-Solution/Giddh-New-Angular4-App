import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxAuthorityComponent } from './tax-authority.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormFieldsModule } from '../form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DatepickerWrapperModule } from '../../shared/datepicker-wrapper/datepicker.wrapper.module';
import { GiddhPageLoaderModule } from '../../shared/giddh-page-loader/giddh-page-loader.module';
import { GiddhDateRangepickerModule } from '../giddh-daterangepicker/giddh-daterangepicker.module';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';
import { HamburgerMenuModule } from '../../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TaxSidebarModule } from '../../shared/tax-sidebar/tax-sidebar.module';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaxAuthorityReportComponent } from './reports/tax-authority-report/tax-authority-report.component';
import { RateWiseReportComponent } from './reports/rate-wise-report/rate-wise-report.component';
import { VatReportModule } from '../../vat-report/vat-report.module';
import { AmountFieldComponentModule } from '../../shared/amount-field/amount-field.module';
import { AccountWiseReportComponent } from './reports/account-wise-report/account-wise-report.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormFieldsModule,
        MatButtonModule,
        MatTableModule,
        MatDialogModule,
        GiddhDateRangepickerModule,
        DatepickerWrapperModule,
        GiddhPageLoaderModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        TaxSidebarModule,
        VatReportModule,
        AmountFieldComponentModule,
        MatPaginatorModule
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
        CreateComponent
    ]
})
export class TaxAuthorityModule { }
