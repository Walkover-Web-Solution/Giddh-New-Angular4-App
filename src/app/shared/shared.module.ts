import { AccountFilterPipe } from './header/pipe/accountfilter.pipe';
import { TbsearchPipe } from './header/pipe/tbsearch.pipe';
import { HighlightPipe } from './header/pipe/highlight.pipe';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { LaddaModule } from 'angular2-ladda';

import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ConfirmModalComponent, FormWizardModule, NgxTypeAheadComponent, TaxControlComponent, SelectModule } from './theme';
// import { SelectModule } from './theme/select/select.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartModule } from 'angular2-highcharts';

import {
  AccountAddComponent,
  AccountAddNewComponent,
  AccountOperationsComponent,
  AccountsSideBarComponent,
  CompanyAddComponent,
  GroupsAccountSidebarComponent,
  ManageGroupsAccountsComponent,
  AccountUpdateNewComponent
} from './header/components';
import { Select2Module } from './theme/select2/select2.module';
import { TagsModule } from './theme/tags/tags.module';
import { UniqueNameDirective } from './helpers/directives/uniqueName.directive';
import { ClickOutsideModule } from 'ng-click-outside';
import { ElementViewContainerRef } from './helpers/directives/element.viewchild.directive';
import { DigitsOnlyDirective } from './helpers/directives/digitsOnly.directive';
import { AccountUpdateComponent } from './header/components/account-update/account-update.component';
import { GroupAddComponent } from './header/components/group-add/group-add.component';
import { GroupUpdateComponent } from './header/components/group-update/group-update.component';
import { ShareGroupModalComponent } from './header/components/share-group-modal/share-group-modal.component';
import { ShareAccountModalComponent } from './header/components/share-account-modal/share-account-modal.component';
import { CheckscrollDirective } from './helpers/directives/checkscroll';
import { TextMaskModule } from 'angular2-text-mask';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { NgUploaderModule } from 'ngx-uploader/src/ngx-uploader/module/ngx-uploader.module';
import { NumberToWordsPipe } from './helpers/pipes/numberToWords.pipe';
import { InvoicePageDDComponent } from './invoice-page-dd/invoice.page.dd.component';
import { FullPageHeight } from './helpers/directives/pageHeight.directive';
import { DatePickerModule } from './theme/datepicker/date-picker.module';
import { RecTypePipe } from './helpers/pipes/recType.pipe';
import { SafePipe } from './helpers/pipes/safe.pipe';
import { DecimalDigitsDirective } from './helpers/directives/decimalDigits.directive';
// social login injection
import { AuthServiceConfig, GoogleLoginProvider, LinkedinLoginProvider, SocialLoginModule } from 'ng4-social-login';
import { DisableFormFieldDirective } from './helpers/directives/disableFormField.directive';
import { ClipboardModule } from 'ngx-clipboard';
// import * as newSelect from 'ng-select';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function highchartsFactory() {
  const hc = require('highcharts');
  const dd = require('highcharts/modules/drilldown');
  dd(hc);

  return hc;
}

const SOCIAL_CONFIG = isElectron ? null : new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com')
  },
  {
    id: LinkedinLoginProvider.PROVIDER_ID,
    provider: new LinkedinLoginProvider('817roify24ig8g')
  }
]);

export function provideConfig() {
  return SOCIAL_CONFIG || { id: null, providers: [] };
}

@NgModule({
  declarations: [
    LayoutComponent, HeaderComponent, FooterComponent, AccountsSideBarComponent,
    ManageGroupsAccountsComponent, CompanyAddComponent, ConfirmModalComponent, AccountOperationsComponent, AccountFilterPipe, TbsearchPipe, HighlightPipe,
    AccountAddComponent, AccountAddNewComponent, AccountUpdateComponent, AccountUpdateNewComponent, DigitsOnlyDirective, ElementViewContainerRef, GroupsAccountSidebarComponent, UniqueNameDirective,
    GroupAddComponent, GroupUpdateComponent, ShareGroupModalComponent, ShareAccountModalComponent, CheckscrollDirective, NgxTypeAheadComponent,
    TaxControlComponent, NumberToWordsPipe, InvoicePageDDComponent, SafePipe, FullPageHeight, RecTypePipe, DecimalDigitsDirective,
    DisableFormFieldDirective],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule.forChild(),
    Ng2BootstrapModule.forRoot(),
    LaddaModule.forRoot({
      style: 'slide-left',
      spinnerSize: 30
    }),
    SocialLoginModule,
    FormWizardModule,
    // SelectModule,
    Select2Module, TagsModule,
    ClickOutsideModule,
    Daterangepicker,
    ChartModule,
    TextMaskModule,
    NgUploaderModule,
    SelectModule,
    ClipboardModule
    // Ng2UiAuthModule.forRoot(MyAuthConfig)
  ],
  exports: [LayoutComponent, HeaderComponent, FooterComponent, LaddaModule, Ng2BootstrapModule, ManageGroupsAccountsComponent,
    AccountFilterPipe, TbsearchPipe, HighlightPipe, Select2Module, ClickOutsideModule, PerfectScrollbarModule, UniqueNameDirective,
    Daterangepicker, DigitsOnlyDirective, ChartModule, CheckscrollDirective, NgxTypeAheadComponent, TextMaskModule,
    TaxControlComponent, NumberToWordsPipe, NgUploaderModule, ConfirmModalComponent, InvoicePageDDComponent, FullPageHeight,
    DatePickerModule, RecTypePipe, DecimalDigitsDirective, DisableFormFieldDirective, SelectModule, ClipboardModule
  ],
  entryComponents: [ManageGroupsAccountsComponent, CompanyAddComponent, ConfirmModalComponent, AccountOperationsComponent, AccountAddComponent, GroupsAccountSidebarComponent,
    NgxTypeAheadComponent, AccountAddNewComponent],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
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
