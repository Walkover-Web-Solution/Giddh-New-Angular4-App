import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
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
import { LoaderComponent } from '../loader/loader.component';
import { ProformaAddBulkItemsComponent } from '../proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component';
import { RevisionHistoryComponent } from './revision-history/revision-history.component';
import { PurchaseOrderPreviewModalComponent } from './purchase-order-preview/purchase-order-preview.component';
import { PurchaseSendEmailModalComponent } from './purchase-send-email/purchase-send-email.component';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { CompanyBranchComponent } from './primary-sidebar/company-branch/company-branch.component';
import { AmountFieldComponentModule } from './amount-field/amount-field.module';
import { AccountAddNewDetailsModule } from './header/components/account-add-new-details/account-add-new-details.module';
import { LedgerDiscountModule } from '../material-ledger/components/ledger-discount/ledger-discount.module';
import { ConfirmationModalModule } from '../common/confirmation-modal/confirmation-modal.module';
import { DatepickerWrapperModule } from './datepicker-wrapper/datepicker.wrapper.module';
import { ValidateSectionPermissionDirectiveModule } from './validate-section-permission/validate-section-permission.module';
import { HamburgerMenuModule } from './header/components/hamburger-menu/hamburger-menu.module';
import { GenericAsideMenuAccountComponent } from './generic-aside-menu-account/generic.aside.menu.account.component';
import { GiddhPageLoaderModule } from './giddh-page-loader/giddh-page-loader.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { GiddhDateRangepickerModule } from '../theme/giddh-daterangepicker/giddh-daterangepicker.module';
import { DeleteTemplateConfirmationModalModule } from '../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.module';
import { CustomFieldsModule } from './header/components/custom-fields/custom-fields.module';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
const SOCIAL_CONFIG = isElectron ? null : new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
    }
], false);

export function provideConfig() {
    return SOCIAL_CONFIG || { id: null, providers: [] };
}

@NgModule({
    declarations: [
        MfReportComponent,
        LayoutComponent,
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
        AccountUpdateNewDetailsComponent,
        WelcomeComponent,
        LoaderComponent,
        ProformaAddBulkItemsComponent,
        RevisionHistoryComponent,
        PurchaseOrderPreviewModalComponent,
        PurchaseSendEmailModalComponent,
        PrimarySidebarComponent,
        CompanyBranchComponent,
        GenericAsideMenuAccountComponent
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
        CurrencyModule,
        TranslateDirectiveModule,
        AmountFieldComponentModule,
        AccountAddNewDetailsModule,
        LedgerDiscountModule,
        ConfirmationModalModule,
        DatepickerWrapperModule,
        HamburgerMenuModule,
        ValidateSectionPermissionDirectiveModule,
        GiddhPageLoaderModule,
        GiddhDatepickerModule,
        GiddhDateRangepickerModule,
        DeleteTemplateConfirmationModalModule,
        CustomFieldsModule,
        NgxBootstrapSwitchModule.forRoot(),
        MatSlideToggleModule
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
        ModalModule,
        HeaderComponent,
        ManageGroupsAccountsComponent,
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
        AccountUpdateNewDetailsComponent,
        WelcomeComponent,
        TabsModule,
        BsDropdownModule,
        ElementViewChildModule,
        TooltipModule,
        BsDatepickerModule,
        NgxDaterangepickerMd,
        LoaderComponent,
        ProformaAddBulkItemsComponent,
        RevisionHistoryComponent,
        PurchaseOrderPreviewModalComponent,
        PurchaseSendEmailModalComponent,
        CurrencyModule,
        PrimarySidebarComponent,
        TranslateDirectiveModule,
        CompanyBranchComponent,
        AmountFieldComponentModule,
        AccountAddNewDetailsModule,
        LedgerDiscountModule,
        ConfirmationModalModule,
        DatepickerWrapperModule,
        HamburgerMenuModule,
        ValidateSectionPermissionDirectiveModule,
        GenericAsideMenuAccountComponent,
        GiddhPageLoaderModule,
        GiddhDatepickerModule,
        GiddhDateRangepickerModule,
        DeleteTemplateConfirmationModalModule
    ],
    entryComponents: [
        ManageGroupsAccountsComponent,
        CompanyAddNewUiComponent,
        AccountOperationsComponent,
        GroupsAccountSidebarComponent,
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
        }
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
