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
import { FormWizardModule } from './theme';

import { ManageGroupsAccountsComponent, AccountsSideBarComponent, CompanyAddComponent } from './header/components';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    LayoutComponent, HeaderComponent, FooterComponent, AccountsSideBarComponent,
    ManageGroupsAccountsComponent, CompanyAddComponent
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
    FormWizardModule
  ],
  exports: [LayoutComponent, HeaderComponent, FooterComponent, LaddaModule, Ng2BootstrapModule, ToastyModule],
  entryComponents: [ManageGroupsAccountsComponent, CompanyAddComponent]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
