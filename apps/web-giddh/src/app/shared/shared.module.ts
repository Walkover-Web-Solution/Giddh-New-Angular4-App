// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CheckPermissionDirective } from './../permissions/check-permission.directive';
import { AccountFilterPipe } from './header/pipe/accountfilter.pipe';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header';
import { FooterComponent } from './footer/footer.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FixedFooterComponent } from './fixed-footer/fixed-footer.component';

import { AccountAddNewComponent, AccountOperationsComponent, AccountsSideBarComponent, AccountUpdateNewComponent, CompanyAddComponent, CompanyAddNewUiComponent, GroupsAccountSidebarComponent, ManageGroupsAccountsComponent } from './header/components';
import { ClickOutsideModule } from 'ng-click-outside';
import { GroupAddComponent } from './header/components/group-add/group-add.component';
import { GroupUpdateComponent } from './header/components/group-update/group-update.component';
import { ShareGroupModalComponent } from './header/components/share-group-modal/share-group-modal.component';
import { ShareAccountModalComponent } from './header/components/share-account-modal/share-account-modal.component';
// social login injection
import { AuthServiceConfig, GoogleLoginProvider, LinkedinLoginProvider, SocialLoginModule } from '../theme/ng-social-login-module';
// import {  } from 'ng-social-login-module/esm2015/lib/auth.module';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { FormWizardModule } from '../theme/ng2-wizard';
import { LaddaModule } from 'angular2-ladda';
import { ElementViewChildModule } from './helpers/directives/elementViewChild/elementViewChild.module';
import { DisableFormFieldModule } from './helpers/directives/disableFormField/disableFormField.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { VsForDirective } from '../theme/ng2-vs-for/ng2-vs-for';
import { DecimalDigitsModule } from './helpers/directives/decimalDigits/decimalDigits.module';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { TextCaseChangeModule } from './helpers/directives/textCaseChange/textCaseChange.module';
import { HighlightModule } from 'apps/web-giddh/src/app/shared/helpers/pipes/highlightPipe/highlight.module';
import { DigitsOnlyModule } from 'apps/web-giddh/src/app/shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ExportGroupLedgerComponent } from './header/components/group-export-ledger-modal/export-group-ledger.component';
import { UniversalListModule } from '../theme/universal-list/universal.list.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { LedgerDiscountComponent } from '../../app/ledger/components/ledgerDiscount/ledgerDiscount.component';

import { KeyboardShortutModule } from './helpers/directives/keyboardShortcut/keyboardShortut.module';

import { CKEditorModule } from 'ng2-ckeditor';
import { AsideMenuOtherTaxes } from './aside-menu-other-taxes/aside-menu-other-taxes';
import { CreateCompanyComponent } from './header/components/create-company/create-company.component';

const getGoogleCredentials = (baseHref: string) => {
  if (baseHref === 'https://giddh.com/' || isElectron) {
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
const SOCIAL_CONFIG = isElectron ? null : new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    // provider: new GoogleLoginProvider('641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com')
    provider: new GoogleLoginProvider(getGoogleCredentials(AppUrl).GOOGLE_CLIENT_ID)
  },
  {
    id: LinkedinLoginProvider.PROVIDER_ID,
    provider: new LinkedinLoginProvider('817roify24ig8g')
  }
], false);

export function provideConfig() {
  return SOCIAL_CONFIG || {id: null, providers: []};
}

@NgModule({
  declarations: [
    LayoutComponent, LedgerDiscountComponent, HeaderComponent, FooterComponent, FixedFooterComponent, AccountsSideBarComponent,
    ManageGroupsAccountsComponent, CompanyAddComponent, CompanyAddNewUiComponent, AccountOperationsComponent, AccountFilterPipe, AccountAddNewComponent, AccountUpdateNewComponent, GroupsAccountSidebarComponent,
    GroupAddComponent, GroupUpdateComponent, ShareGroupModalComponent, ShareAccountModalComponent, VsForDirective, CheckPermissionDirective, ExportGroupLedgerComponent,CreateCompanyComponent,
    AsideMenuOtherTaxes],
  imports: [
    KeyboardShortutModule,

    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    TypeaheadModule,
    UniversalListModule,
    NgbTypeaheadModule,
    TooltipModule,
    BsDropdownModule,
    PopoverModule,
    PerfectScrollbarModule,
    SocialLoginModule,
    FormWizardModule,
    // SelectModule,
    ClickOutsideModule,
    ConfirmModalModule,
    LaddaModule,
    ElementViewChildModule,
    DisableFormFieldModule,
    ShSelectModule,
    DecimalDigitsModule,
    DigitsOnlyModule,
    // BsDatepickerModule,
    Daterangepicker,
    TextCaseChangeModule,
    HighlightModule,
    TabsModule,
    CKEditorModule

    // Ng2UiAuthModule.forRoot(MyAuthConfig)
  ],
  exports: [LayoutComponent, LedgerDiscountComponent, HeaderComponent, FooterComponent, FixedFooterComponent, ManageGroupsAccountsComponent,
    AccountFilterPipe, ClickOutsideModule, PerfectScrollbarModule, AccountAddNewComponent, AccountUpdateNewComponent,
    ConfirmModalModule, NgbTypeaheadModule, VsForDirective, AccountsSideBarComponent, TextCaseChangeModule, KeyboardShortutModule,CompanyAddNewUiComponent,
    CKEditorModule, AsideMenuOtherTaxes,
  ],
  entryComponents: [ManageGroupsAccountsComponent, CompanyAddComponent, CompanyAddNewUiComponent, AccountOperationsComponent, GroupsAccountSidebarComponent,
    AccountAddNewComponent, AccountUpdateNewComponent],
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
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}

