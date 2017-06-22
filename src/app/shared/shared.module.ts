import { Select2Module } from 'ng2-select2';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar/dist';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { LaddaModule } from 'angular2-ladda';
import { ToastyModule } from 'ng2-toasty';

import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormWizardModule, ConfirmModalComponent } from './theme';

import { ManageGroupsAccountsComponent, AccountsSideBarComponent, CompanyAddComponent } from './header/components';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    LayoutComponent, HeaderComponent, FooterComponent, AccountsSideBarComponent,
    ManageGroupsAccountsComponent, CompanyAddComponent, ConfirmModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PerfectScrollbarModule,
    Ng2BootstrapModule.forRoot(),
    LaddaModule.forRoot({
      style: 'slide-left',
      spinnerSize: 30
    }),
    ToastyModule.forRoot(),
    FormWizardModule,
    Select2Module
  ],
  exports: [LayoutComponent, HeaderComponent, FooterComponent, LaddaModule, Ng2BootstrapModule, ToastyModule],
  entryComponents: [ManageGroupsAccountsComponent, CompanyAddComponent, ConfirmModalComponent]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
