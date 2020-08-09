import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {LaddaModule} from 'angular2-ladda';
import {DigitsOnlyModule} from 'apps/web-giddh/src/app/shared/helpers/directives/digitsOnly/digitsOnly.module';
import {HighlightModule} from 'apps/web-giddh/src/app/shared/helpers/pipes/highlightPipe/highlight.module';
import {ClickOutsideModule} from 'ng-click-outside';
import {BsDatepickerModule, BsModalService, DatepickerModule, PaginationModule} from 'ngx-bootstrap';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';

import {LedgerDiscountComponent} from '../ledger/components/ledgerDiscount/ledgerDiscount.component';
import {ConfirmationModalComponent} from '../common/confirmation-modal/confirmation-modal.component';
import {MfReportComponent} from '../manufacturing/report/mf.report.component';
import {CommandKModule} from '../theme/command-k/command.k.module';
import {ConfirmModalModule} from '../theme/confirm-modal';
import {SelectModule} from '../theme/ng-select/ng-select';
import {
    AuthServiceConfig,
    GoogleLoginProvider,
    LinkedinLoginProvider,
    SocialLoginModule,
} from '../theme/ng-social-login-module';
import {ShSelectModule} from '../theme/ng-virtual-select/sh-select.module';
import {Daterangepicker} from '../theme/ng2-daterangepicker/daterangepicker.module';
import {VsForDirective} from '../theme/ng2-vs-for/ng2-vs-for';
import {FormWizardModule} from '../theme/ng2-wizard';
import {UniversalListModule} from '../theme/universal-list/universal.list.module';
import {CheckPermissionDirective} from '../permissions/check-permission.directive';
import {AsideMenuOtherTaxes} from './aside-menu-other-taxes/aside-menu-other-taxes';
import {FixedFooterComponent} from './fixed-footer/fixed-footer.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header'
import {
    AccountAddNewDetailsComponent,
    AccountOperationsComponent,
    AccountsSideBarComponent,
    AccountUpdateNewDetailsComponent,
    CompanyAddComponent,
    CompanyAddNewUiComponent,
    GroupsAccountSidebarComponent,
    ManageGroupsAccountsComponent,
} from './header/components';
import {GroupAddComponent} from './header/components/group-add/group-add.component';
import {ExportGroupLedgerComponent} from './header/components/group-export-ledger-modal/export-group-ledger.component';
import {GroupUpdateComponent} from './header/components/group-update/group-update.component';
import {ShareAccountModalComponent} from './header/components/share-account-modal/share-account-modal.component';
import {ShareGroupModalComponent} from './header/components/share-group-modal/share-group-modal.component';
import {AccountFilterPipe} from './header/pipe/accountfilter.pipe';
import {DecimalDigitsModule} from './helpers/directives/decimalDigits/decimalDigits.module';
import {DisableFormFieldModule} from './helpers/directives/disableFormField/disableFormField.module';
import {ElementViewChildModule} from './helpers/directives/elementViewChild/elementViewChild.module';
import {KeyboardShortutModule} from './helpers/directives/keyboardShortcut/keyboardShortut.module';
import {NgxMaskModule} from './helpers/directives/ngx-mask';
import {TextCaseChangeModule} from './helpers/directives/textCaseChange/textCaseChange.module';
import {LayoutComponent} from './layout/layout.component';
import {OnBoardingComponent} from './on-boarding/on-boarding.component';
import {NgxDaterangepickerMd} from '../theme/ngx-date-range-picker';
import {AsideHelpSupportComponent} from './header/components/aside-help-support/aside-help-support.component';
import {AsideSettingComponent} from './header/components/aside-setting/aside-setting.component';
import {DeleteTemplateConfirmationModelComponent} from '../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.component';
import {DatepickerWrapperComponent} from './datepicker-wrapper/datepicker.wrapper.component';
import {LoaderComponent} from "../loader/loader.component";
import {NewUserComponent} from "../newUser.component";

// social login injection
// import {  } from 'ng-social-login-module/esm2015/lib/auth.module';

const getGoogleCredentials = () => {
    if (PRODUCTION_ENV || isElectron  || isCordova) {
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
const SOCIAL_CONFIG = (isElectron|| isCordova) ? null : new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        // provider: new GoogleLoginProvider('641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com')
        provider: new GoogleLoginProvider(getGoogleCredentials().GOOGLE_CLIENT_ID)
    },
    {
        id: LinkedinLoginProvider.PROVIDER_ID,
        provider: new LinkedinLoginProvider('817roify24ig8g')
    }
], false);

export function provideConfig() {
    return SOCIAL_CONFIG || { id: null, providers: [] };
}

@NgModule({
    declarations: [
        MfReportComponent,
        LayoutComponent,
        LedgerDiscountComponent,
        HeaderComponent,
        FooterComponent,
        FixedFooterComponent,
        AccountsSideBarComponent,
        AsideHelpSupportComponent,
        AsideSettingComponent,
        ManageGroupsAccountsComponent,
        CompanyAddComponent,
        CompanyAddNewUiComponent,
        AccountOperationsComponent,
        AccountFilterPipe,
        OnBoardingComponent,
        GroupsAccountSidebarComponent,
        GroupAddComponent,
        GroupUpdateComponent,
        ShareGroupModalComponent,
        ShareAccountModalComponent,
        VsForDirective,
        CheckPermissionDirective,
        ExportGroupLedgerComponent,
        AsideMenuOtherTaxes,
        AccountAddNewDetailsComponent,
        AccountUpdateNewDetailsComponent,
        // WelcomeComponent,
        ConfirmationModalComponent,
        DeleteTemplateConfirmationModelComponent,
        DatepickerWrapperComponent,
        LoaderComponent,
        // NewUserComponent
    ],
    imports: [
        KeyboardShortutModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        DatepickerModule,
        TypeaheadModule,
        UniversalListModule,
        NgbTypeaheadModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        PerfectScrollbarModule,
        SocialLoginModule,
        FormWizardModule,
        SelectModule,
        ClickOutsideModule,
        ConfirmModalModule,
        LaddaModule,
        ElementViewChildModule,
        DisableFormFieldModule,
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
        NgxDaterangepickerMd.forRoot()
    ],
    exports: [
        CommonModule,
        DatepickerModule,
        DecimalDigitsModule,
        PopoverModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderComponent,
        LaddaModule,
        LayoutComponent,
        ShSelectModule,
        LedgerDiscountComponent,
        ModalModule,
        HeaderComponent,
        FooterComponent,
        FixedFooterComponent,
        ManageGroupsAccountsComponent,
        ConfirmationModalComponent,
        AccountFilterPipe,
        SelectModule,
        PaginationModule,
        ClickOutsideModule,
        PerfectScrollbarModule,
        OnBoardingComponent,
        ConfirmModalModule,
        NgbTypeaheadModule,
        VsForDirective,
        AccountsSideBarComponent,
        AsideHelpSupportComponent,
        AsideSettingComponent,
        TextCaseChangeModule,
        KeyboardShortutModule,
        CompanyAddNewUiComponent,
        AsideMenuOtherTaxes,
        MfReportComponent,
        AccountAddNewDetailsComponent,
        AccountUpdateNewDetailsComponent,
        TabsModule,
        BsDropdownModule,
        ElementViewChildModule,
        TooltipModule,
        BsDatepickerModule,
        NgxDaterangepickerMd,
        DeleteTemplateConfirmationModelComponent,
        DatepickerWrapperComponent
    ],
    entryComponents: [
        ManageGroupsAccountsComponent,
        CompanyAddComponent,
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
        BsModalService
    ]
})
export class SharedModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}
