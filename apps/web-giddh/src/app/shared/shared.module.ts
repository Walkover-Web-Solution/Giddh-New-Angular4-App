import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { DigitsOnlyModule } from 'apps/web-giddh/src/app/shared/helpers/directives/digitsOnly/digitsOnly.module';
import { HighlightModule } from 'apps/web-giddh/src/app/shared/helpers/pipes/highlightPipe/highlight.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/lib/perfect-scrollbar.interfaces';
import { LedgerDiscountComponent } from '../../app/ledger/components/ledgerDiscount/ledgerDiscount.component';
import { ConfirmationModalComponent } from '../common/confirmation-modal/confirmation-modal.component';
import { MfReportComponent } from '../manufacturing/report/mf.report.component';
import { CommandKModule } from '../theme/command-k/command.k.module';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { SelectModule } from '../theme/ng-select/ng-select';
import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from '../theme/ng-social-login-module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { WelcomeComponent } from '../welcome/welcome.component';
import { CheckPermissionDirective } from './../permissions/check-permission.directive';
import { AsideMenuOtherTaxes } from './aside-menu-other-taxes/aside-menu-other-taxes';
import { HeaderComponent } from './header';
import { PrimarySidebarComponent } from './primary-sidebar/primary-sidebar.component';
import { AccountOperationsComponent, CompanyAddNewUiComponent, GroupsAccountSidebarComponent, ManageGroupsAccountsComponent } from './header/components';
import { AccountAddNewDetailsComponent } from './header/components/account-add-new-details/account-add-new-details.component';
import { AccountUpdateNewDetailsComponent } from './header/components/account-update-new-details/account-update-new-details.component';
import { GroupAddComponent } from './header/components/group-add/group-add.component';
import { ExportGroupLedgerComponent } from './header/components/group-export-ledger-modal/export-group-ledger.component';
import { GroupUpdateComponent } from './header/components/group-update/group-update.component';
import { ShareAccountModalComponent } from './header/components/share-account-modal/share-account-modal.component';
import { ShareGroupModalComponent } from './header/components/share-group-modal/share-group-modal.component';
import { AccountFilterPipe } from './header/pipe/accountfilter.pipe';
import { DecimalDigitsModule } from './helpers/directives/decimalDigits/decimalDigits.module';
import { ElementViewChildModule } from './helpers/directives/elementViewChild/elementViewChild.module';
import { KeyboardShortutModule } from './helpers/directives/keyboardShortcut/keyboardShortut.module';
import { NgxMaskModule } from './helpers/directives/ngx-mask';
import { TextCaseChangeModule } from './helpers/directives/textCaseChange/textCaseChange.module';
import { LayoutComponent } from './layout/layout.component';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
import { AsideHelpSupportComponent } from './header/components/aside-help-support/aside-help-support.component';
import { AsideSettingComponent } from './header/components/aside-setting/aside-setting.component';
import { DeleteTemplateConfirmationModelComponent } from '../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.component';
import { DatepickerWrapperComponent } from './datepicker-wrapper/datepicker.wrapper.component';
import { LoaderComponent } from '../loader/loader.component';
import { ProformaAddBulkItemsComponent } from '../proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GiddhDatepickerComponent } from '../theme/giddh-datepicker/giddh-datepicker.component';
import { MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { RevisionHistoryComponent } from './revision-history/revision-history.component';
import { PurchaseOrderPreviewModalComponent } from './purchase-order-preview/purchase-order-preview.component';
import { PurchaseSendEmailModalComponent } from './purchase-send-email/purchase-send-email.component';
import { GiddhDaterangepickerComponent } from '../theme/giddh-daterangepicker/giddh-daterangepicker.component';
import { HamburgerMenuComponent } from './header/components/hamburger-menu/hamburger-menu.component';
import { AmountFieldComponent } from './amount-field/amount-field.component';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { GiddhPageLoaderComponent } from './giddh-page-loader/giddh-page-loader.component';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import localeEn from '@angular/common/locales/en-GB';
import localeHi from '@angular/common/locales/hi';
import localeMr from '@angular/common/locales/mr';
registerLocaleData(localeEn);
registerLocaleData(localeHi);
registerLocaleData(localeMr);

const getGoogleCredentials = () => {
    if (PRODUCTION_ENV || isElectron || isCordova) {
        return {
            GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com'
        };
    } else {
        return {
            GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com'
        };
    }
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
const SOCIAL_CONFIG = (isElectron || isCordova) ? null : new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(getGoogleCredentials().GOOGLE_CLIENT_ID)
    }
], false);

export function provideConfig() {
    return SOCIAL_CONFIG || { id: null, providers: [] };
}

export const GIDDH_DATEPICKER_FORMAT = {
    parse: { dateInput: 'dd-MM-yyyy' },
    display: {
        dateInput: 'input'
    }
};

export class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd-MM-yyyy', this.locale);
        } else {
            return formatDate(date, 'MMM yyyy', this.locale);
        }
    }
}

@NgModule({
    declarations: [
        MfReportComponent,
        LayoutComponent,
        LedgerDiscountComponent,
        HeaderComponent,
        AsideHelpSupportComponent,
        AsideSettingComponent,
        ManageGroupsAccountsComponent,
        CompanyAddNewUiComponent,
        AccountOperationsComponent,
        AccountFilterPipe,
        OnBoardingComponent,
        GroupsAccountSidebarComponent,
        GroupAddComponent,
        GroupUpdateComponent,
        ShareGroupModalComponent,
        ShareAccountModalComponent,
        CheckPermissionDirective,
        ExportGroupLedgerComponent,
        AsideMenuOtherTaxes,
        AccountAddNewDetailsComponent,
        AccountUpdateNewDetailsComponent,
        WelcomeComponent,
        ConfirmationModalComponent,
        DeleteTemplateConfirmationModelComponent,
        DatepickerWrapperComponent,
        LoaderComponent,
        ProformaAddBulkItemsComponent,
        GiddhDatepickerComponent,
        RevisionHistoryComponent,
        PurchaseOrderPreviewModalComponent,
        PurchaseSendEmailModalComponent,
        HamburgerMenuComponent,
        GiddhDaterangepickerComponent,
        GiddhPageLoaderComponent,
        AmountFieldComponent,
        PrimarySidebarComponent
    ],
    imports: [
        KeyboardShortutModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        DatepickerModule,
        TypeaheadModule.forRoot(),
        TooltipModule,
        BsDropdownModule,
        PopoverModule.forRoot(),
        PerfectScrollbarModule,
        SocialLoginModule,
        SelectModule,
        ClickOutsideModule,
        ConfirmModalModule,
        LaddaModule,
        ElementViewChildModule,
        ShSelectModule,
        DecimalDigitsModule,
        DigitsOnlyModule,
        BsDatepickerModule.forRoot(),
        PaginationModule,
        Daterangepicker,
        TextCaseChangeModule,
        HighlightModule,
        TabsModule,
        NgxMaskModule,
        CommandKModule,
        NgxDaterangepickerMd.forRoot(),
        ScrollingModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        CurrencyModule,
        TranslateDirectiveModule
    ],
    exports: [
        CommonModule,
        DatepickerModule,
        DecimalDigitsModule,
        PopoverModule,
        FormsModule,
        ReactiveFormsModule,
        LaddaModule,
        LayoutComponent,
        ShSelectModule,
        LedgerDiscountComponent,
        ModalModule,
        HeaderComponent,
        ManageGroupsAccountsComponent,
        ConfirmationModalComponent,
        AccountFilterPipe,
        SelectModule,
        PaginationModule,
        ClickOutsideModule,
        PerfectScrollbarModule,
        OnBoardingComponent,
        ConfirmModalModule,
        AsideHelpSupportComponent,
        AsideSettingComponent,
        TextCaseChangeModule,
        KeyboardShortutModule,
        CompanyAddNewUiComponent,
        AsideMenuOtherTaxes,
        MfReportComponent,
        AccountAddNewDetailsComponent,
        AccountUpdateNewDetailsComponent,
        WelcomeComponent,
        TabsModule,
        BsDropdownModule,
        ElementViewChildModule,
        TooltipModule,
        BsDatepickerModule,
        NgxDaterangepickerMd,
        DeleteTemplateConfirmationModelComponent,
        DatepickerWrapperComponent,
        LoaderComponent,
        ProformaAddBulkItemsComponent,
        GiddhDatepickerComponent,
        RevisionHistoryComponent,
        PurchaseOrderPreviewModalComponent,
        PurchaseSendEmailModalComponent,
        HamburgerMenuComponent,
        GiddhPageLoaderComponent,
        AmountFieldComponent,
        CurrencyModule,
        PrimarySidebarComponent,
        TranslateDirectiveModule
    ],
    entryComponents: [
        ManageGroupsAccountsComponent,
        CompanyAddNewUiComponent,
        AccountOperationsComponent,
        GroupsAccountSidebarComponent,
        AccountAddNewDetailsComponent,
        OnBoardingComponent,
        AccountUpdateNewDetailsComponent
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        MatDatepickerModule,
        MatNativeDateModule,
        { provide: MAT_DATE_FORMATS, useValue: GIDDH_DATEPICKER_FORMAT },
        { provide: DateAdapter, useClass: PickDateAdapter },
        { provide: LOCALE_ID, useValue: 'en' }
    ]
})
export class SharedModule {
    public static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}
