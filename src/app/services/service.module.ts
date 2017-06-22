import { NgModule, ModuleWithProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';
import { HttpWrapperService } from './httpWrapper.service';
import { ErrorHandlerService } from './errorhandler.service';
import { ToasterService } from './toaster.service';

/**
 * Home Module
 */

import { HomeActions } from './actions/home.actions';
import { SharedModule } from '../shared/shared.module';
import { CompanyActions } from './actions/company.actions';
import { LoginActions } from './actions/login.action';
import { CompanyService } from './companyService.service';
import { NeedsAuthentication } from './decorators/needsAuthentication';
import { LocationService } from './location.service';
import { UserAuthenticated } from './decorators/UserAuthenticated';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule,
    SharedModule.forRoot(),
    EffectsModule.run(CompanyActions),
    EffectsModule.run(LoginActions)],
  exports: [CommonModule, FormsModule, RouterModule, EffectsModule]
})
export class ServiceModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        StorageService,
        HttpWrapperService,
        AuthenticationService,
        ErrorHandlerService,
        ToasterService,
        CompanyService,
        NeedsAuthentication,
        LocationService,
        UserAuthenticated
      ]
    };
  }
}
