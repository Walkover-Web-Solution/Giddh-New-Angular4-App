import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';
import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact.routing.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { ContactAdvanceSearchComponent } from './advanceSearch/contactAdvanceSearch.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { PaymentAsideComponent } from './payment-aside/payment-aside.component';
import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
import { LightboxModule } from 'ngx-lightbox';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRippleModule } from "@angular/material/core";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatChipsModule } from "@angular/material/chips";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { ContactPreviewComponent } from './preview/preview.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { LedgerStatementModule } from '../shared/ledger-statement-t-view/ledger-statement.module';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LedgerModule } from '../ledger/ledger.module';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { AsideMenuAccountModule } from '../shared/aside-menu-account/aside.menu.account.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { AccountUpdateNewDetailsModule } from '../shared/header/components/account-update-new-details/account-update-new-details.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { GiddhNumberFormatPipe } from '../shared/helpers/pipes/number-format/number-format.pipe';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { SelectTableColumnModule } from '../shared/select-table-column/select-table-column.module';
import { SharedModule } from '../shared/shared.module';
import { FroalaTemplateEditorModule } from '../shared/template-froala/template-froala.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ResizableDirective } from '../shared/directives/resizable.directive';
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';
import { AgeRangeEditorComponent } from '../theme/age-range-editor/age-range-editor.component';
@NgModule({
    declarations: [
        ContactComponent,
        ContactAdvanceSearchComponent,
        AgingReportComponent,
        PaymentAsideComponent,
        ContactPreviewComponent,
        AccountStatementComponent
    ],
    exports: [
        GiddhNumberFormatModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ContactRoutingModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        SharedModule,
        ClickOutsideModule,
        DigitsOnlyModule,
        DecimalDigitsModule,
        ElementViewChildModule,
        GiddhNumberFormatModule,
        Daterangepicker,
        NgxDaterangepickerMd.forRoot(),
        NgxMaskModule.forRoot(),
        NoDataModule,
        LightboxModule,
        MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTabsModule,
        MatRippleModule,
        FormFieldsModule,
        MatChipsModule,
        MatTableModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        AccountUpdateNewDetailsModule,
        AsideMenuAccountModule,
        SelectTableColumnModule,
        GiddhPageLoaderModule,
        MatSlideToggleModule,
        MatListModule,
        ScrollingModule,
        WatchVideoModule,
        FroalaTemplateEditorModule,
        LedgerStatementModule,
        MatSortModule,
        MatPaginatorModule,
        LedgerModule,
        MatCardModule,
        AmountFieldComponentModule,
        HamburgerMenuModule,
        ResizableDirective,
        GiddhDatePipe,
        AgeRangeEditorComponent
    ],
    providers: [
        GiddhNumberFormatPipe
    ]
})
export class ContactModule {
}
