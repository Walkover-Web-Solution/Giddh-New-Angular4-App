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
import { RateWiseComponent } from './reports/rate-wise/rate-wise.component';
import { AccountWiseComponent } from './reports/account-wise/account-wise.component';
import { VatReportModule } from '../../vat-report/vat-report.module';
import { AmountFieldComponentModule } from '../../shared/amount-field/amount-field.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),
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
        AmountFieldComponentModule
    ],
    exports: [
        TaxAuthorityComponent,
        TaxAuthorityReportComponent,
        RateWiseComponent,
        AccountWiseComponent,
        CreateComponent
    ],
    declarations: [
        TaxAuthorityComponent,
        TaxAuthorityReportComponent,
        RateWiseComponent,
        AccountWiseComponent,
        CreateComponent
    ]
})
export class TaxAuthorityModule { }
