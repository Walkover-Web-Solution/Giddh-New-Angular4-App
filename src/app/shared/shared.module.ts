import { AccountFilterPipe } from './header/pipe/accountfilter.pipe';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { LaddaModule } from 'angular2-ladda';

import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormWizardModule, ConfirmModalComponent } from './theme';
import { ToastrModule } from 'ngx-toastr';
import { SelectModule } from 'ng-select';

import {
  ManageGroupsAccountsComponent, AccountsSideBarComponent, CompanyAddComponent,
  AccountOperationsComponent, GroupsRecursiveListComponent, GroupsRecursiveListItemComponent,
  GroupAccountsListComponent
} from './header/components';
import { Select2Module } from './theme/select2/select2.module';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    LayoutComponent, HeaderComponent, FooterComponent, AccountsSideBarComponent,
    ManageGroupsAccountsComponent, CompanyAddComponent, ConfirmModalComponent, AccountOperationsComponent,
    GroupsRecursiveListComponent, GroupsRecursiveListItemComponent, GroupAccountsListComponent, AccountFilterPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    Ng2BootstrapModule.forRoot(),
    LaddaModule.forRoot({
      style: 'slide-left',
      spinnerSize: 30
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormWizardModule,
    SelectModule,
    Select2Module
  ],
  exports: [LayoutComponent, HeaderComponent, FooterComponent, LaddaModule, Ng2BootstrapModule, ToastrModule,
    BrowserAnimationsModule, AccountFilterPipe, SelectModule, Select2Module],
  entryComponents: [ManageGroupsAccountsComponent, CompanyAddComponent, ConfirmModalComponent, AccountOperationsComponent,
    GroupsRecursiveListComponent, GroupsRecursiveListItemComponent, GroupAccountsListComponent]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
