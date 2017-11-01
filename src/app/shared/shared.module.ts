import { AccountFilterPipe } from './header/pipe/accountfilter.pipe';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header';
import { FooterComponent } from './footer/footer.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { AccountAddNewComponent, AccountOperationsComponent, AccountsSideBarComponent, AccountUpdateComponent, AccountUpdateNewComponent, CompanyAddComponent, GroupsAccountSidebarComponent, ManageGroupsAccountsComponent } from './header/components';
import { ClickOutsideModule } from 'ng-click-outside';
import { GroupAddComponent } from './header/components/group-add/group-add.component';
import { GroupUpdateComponent } from './header/components/group-update/group-update.component';
import { ShareGroupModalComponent } from './header/components/share-group-modal/share-group-modal.component';
import { ShareAccountModalComponent } from './header/components/share-account-modal/share-account-modal.component';
// social login injection
import { AuthServiceConfig, GoogleLoginProvider, LinkedinLoginProvider, SocialLoginModule } from 'ng4-social-login';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { FormWizardModule } from '../theme/ng2-wizard';
import { SelectModule } from '../theme/ng-select/ng-select';
import { Select2Module } from '../theme/select2';
import { LaddaModule } from 'angular2-ladda';
import { ElementViewChildModule } from './helpers/directives/elementViewChild/elementViewChild.module';
import { DisableFormFieldModule } from './helpers/directives/disableFormField/disableFormField.module';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

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
  return SOCIAL_CONFIG || {id: null, providers: []};
}

@NgModule({
  declarations: [
    LayoutComponent, HeaderComponent, FooterComponent, AccountsSideBarComponent,
    ManageGroupsAccountsComponent, CompanyAddComponent, AccountOperationsComponent, AccountFilterPipe, AccountAddNewComponent, AccountUpdateComponent, AccountUpdateNewComponent, GroupsAccountSidebarComponent,
    GroupAddComponent, GroupUpdateComponent, ShareGroupModalComponent, ShareAccountModalComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    TypeaheadModule,
    TooltipModule,
    BsDropdownModule,
    PopoverModule,
    PerfectScrollbarModule.forChild(),
    SocialLoginModule,
    FormWizardModule,
    // SelectModule,
    Select2Module,
    ClickOutsideModule,
    SelectModule,
    ConfirmModalModule,
    LaddaModule,
    ElementViewChildModule,
    DisableFormFieldModule
    // Ng2UiAuthModule.forRoot(MyAuthConfig)
  ],
  exports: [LayoutComponent, HeaderComponent, FooterComponent, ManageGroupsAccountsComponent,
    AccountFilterPipe, SelectModule, Select2Module, ClickOutsideModule, PerfectScrollbarModule, AccountAddNewComponent,
    ConfirmModalModule
  ],
  entryComponents: [ManageGroupsAccountsComponent, CompanyAddComponent, AccountOperationsComponent, AccountAddNewComponent, GroupsAccountSidebarComponent,
    AccountAddNewComponent],
  providers: [
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
