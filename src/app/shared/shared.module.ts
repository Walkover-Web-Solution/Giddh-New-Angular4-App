import { AccountFilterPipe } from './header/pipe/accountfilter.pipe';
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
import { ConfirmModalComponent, FormWizardModule, NgxTypeAheadComponent, TaxControlComponent } from './theme';
import { ToastrModule } from 'ngx-toastr';
import { SelectModule } from './theme/select/select.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartModule } from 'angular2-highcharts';

import {
  AccountAddComponent,
  AccountOperationsComponent,
  AccountsSideBarComponent,
  CompanyAddComponent,
  GroupAccountsListComponent,
  GroupsAccountSidebarComponent,
  GroupsRecursiveListComponent,
  GroupsRecursiveListItemComponent,
  ManageGroupsAccountsComponent
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
import { NgUploaderModule } from 'ngx-uploader';
import { NumberToWordsPipe } from './helpers/pipes/numberToWords.pipe';
import { DatePickerModule } from './theme/datepicker/date-picker.module';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function highchartsFactory() {
  const hc = require('highcharts');
  const dd = require('highcharts/modules/drilldown');
  dd(hc);

  return hc;
}

@NgModule({
  declarations: [
    LayoutComponent, HeaderComponent, FooterComponent, AccountsSideBarComponent,
    ManageGroupsAccountsComponent, CompanyAddComponent, ConfirmModalComponent, AccountOperationsComponent,
    GroupsRecursiveListComponent, GroupsRecursiveListItemComponent, GroupAccountsListComponent, AccountFilterPipe,
    AccountAddComponent, AccountUpdateComponent, DigitsOnlyDirective, ElementViewContainerRef, GroupsAccountSidebarComponent, UniqueNameDirective,
    GroupAddComponent, GroupUpdateComponent, ShareGroupModalComponent, ShareAccountModalComponent, CheckscrollDirective, NgxTypeAheadComponent,
    TaxControlComponent, NumberToWordsPipe],
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
    ToastrModule.forRoot(),
    FormWizardModule,
    SelectModule,
    Select2Module, TagsModule,
    ClickOutsideModule,
    Daterangepicker,
    ChartModule,
    TextMaskModule,
    NgUploaderModule,
  ],
  exports: [LayoutComponent, HeaderComponent, FooterComponent, LaddaModule, Ng2BootstrapModule, ToastrModule, ManageGroupsAccountsComponent,
    AccountFilterPipe, SelectModule, Select2Module, ClickOutsideModule, PerfectScrollbarModule, UniqueNameDirective,
    Daterangepicker, DigitsOnlyDirective, ChartModule, CheckscrollDirective, NgxTypeAheadComponent, TextMaskModule,
    TaxControlComponent, NumberToWordsPipe, NgUploaderModule, ConfirmModalComponent, DatePickerModule
  ],
  entryComponents: [ManageGroupsAccountsComponent, CompanyAddComponent, ConfirmModalComponent, AccountOperationsComponent,
    GroupsRecursiveListComponent, GroupsRecursiveListItemComponent, GroupAccountsListComponent, AccountAddComponent, GroupsAccountSidebarComponent,
    NgxTypeAheadComponent],
  providers: [{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
