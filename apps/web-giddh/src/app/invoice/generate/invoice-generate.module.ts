import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InvoiceGenerateComponent } from './invoice.generate.component';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhPageLoaderModule } from '../../shared/giddh-page-loader/giddh-page-loader.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ClickOutsideModule } from 'ng-click-outside';
import { AmountFieldComponentModule } from '../../shared/amount-field/amount-field.module';

import { NoDataModule } from '../../shared/no-data/no-data.module';
import { VoucherModule } from '../../voucher/voucher.module';
import { DatepickerWrapperModule } from '../../shared/datepicker-wrapper/datepicker.wrapper.module';
import { ValidateSectionPermissionDirectiveModule } from '../../shared/validate-section-permission/validate-section-permission.module';

@NgModule({
    declarations: [
        InvoiceGenerateComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        ClickOutsideModule,
        TranslateDirectiveModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),

        NoDataModule,
        VoucherModule,
        DatepickerWrapperModule,
        AmountFieldComponentModule,
        GiddhPageLoaderModule,
        ValidateSectionPermissionDirectiveModule
    ],
    exports: [
        InvoiceGenerateComponent
    ]
})
export class InvoiceGenerateModule { }
