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
import { AsideMenuOtherTaxes } from './aside-menu-other-taxes/aside-menu-other-taxes';
import { AccountOperationsComponent, ManageGroupsAccountsComponent } from './header/components';
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
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
import { ProformaAddBulkItemsComponent } from '../proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component';
import { RevisionHistoryComponent } from './revision-history/revision-history.component';
import { PurchaseOrderPreviewModalComponent } from './purchase-order-preview/purchase-order-preview.component';
import { PurchaseSendEmailModalComponent } from './purchase-send-email/purchase-send-email.component';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { AmountFieldComponentModule } from './amount-field/amount-field.module';
import { AccountAddNewDetailsModule } from './header/components/account-add-new-details/account-add-new-details.module';
import { LedgerDiscountModule } from '../material-ledger/components/ledger-discount/ledger-discount.module';
import { ConfirmationModalModule } from '../common/confirmation-modal/confirmation-modal.module';
import { DatepickerWrapperModule } from './datepicker-wrapper/datepicker.wrapper.module';
import { ValidateSectionPermissionDirectiveModule } from './validate-section-permission/validate-section-permission.module';
import { HamburgerMenuModule } from './header/components/hamburger-menu/hamburger-menu.module';
import { GiddhPageLoaderModule } from './giddh-page-loader/giddh-page-loader.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { DeleteTemplateConfirmationModalModule } from '../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.module';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MasterComponent } from './header/components/master/master.component';
import { CheckPermissionModule } from '../permissions/check-permission.module';
import { GenericAsideMenuAccountModule } from './generic-aside-menu-account/generic.aside.menu.account.module';
import { AccountUpdateNewDetailsModule } from './header/components/account-update-new-details/account-update-new-details.module';

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
        ManageGroupsAccountsComponent,
        AccountOperationsComponent,
        AccountFilterPipe,
        OnBoardingComponent,
        GroupAddComponent,
        GroupUpdateComponent,
        ShareGroupModalComponent,
        ShareAccountModalComponent,
        ExportGroupLedgerComponent,
        AsideMenuOtherTaxes,
        ProformaAddBulkItemsComponent,
        RevisionHistoryComponent,
        PurchaseOrderPreviewModalComponent,
        PurchaseSendEmailModalComponent,
        MasterComponent
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
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        PerfectScrollbarModule,
        SocialLoginModule,
        SelectModule,
        ClickOutsideModule,
        ConfirmModalModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ElementViewChildModule,
        ShSelectModule,
        DecimalDigitsModule,
        DigitsOnlyModule,
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        Daterangepicker,
        TextCaseChangeModule,
        HighlightModule,
        TabsModule.forRoot(),
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
        DeleteTemplateConfirmationModalModule,
        NgxBootstrapSwitchModule.forRoot(),
        MatSlideToggleModule,
        CheckPermissionModule,
        AccountUpdateNewDetailsModule
    ],
    exports: [
        CommonModule,
        DatepickerModule,
        DecimalDigitsModule,
        PopoverModule,
        FormsModule,
        ReactiveFormsModule,
        LaddaModule,
        ShSelectModule,
        ModalModule,
        ManageGroupsAccountsComponent,
        AccountFilterPipe,
        SelectModule,
        PaginationModule,
        ClickOutsideModule,
        PerfectScrollbarModule,
        OnBoardingComponent,
        ConfirmModalModule,
        TextCaseChangeModule,
        KeyboardShortutModule,
        AsideMenuOtherTaxes,
        MfReportComponent,
        TabsModule,
        BsDropdownModule,
        ElementViewChildModule,
        TooltipModule,
        BsDatepickerModule,
        NgxDaterangepickerMd,
        ProformaAddBulkItemsComponent,
        RevisionHistoryComponent,
        PurchaseOrderPreviewModalComponent,
        PurchaseSendEmailModalComponent,
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
        DeleteTemplateConfirmationModalModule,
        GenericAsideMenuAccountModule,
        MasterComponent
    ],
    entryComponents: [
        ManageGroupsAccountsComponent,
        AccountOperationsComponent,
        MasterComponent,
        OnBoardingComponent
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
