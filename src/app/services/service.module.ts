import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';
import { CurrentUserService } from './currentUser.service';
import { HttpWrapperService } from './httpWrapper.service';
import { ErrorHandlerService } from './errorhandler.service';
import { ToasterService } from './toaster.service';

/**
 * Home Module
 */

import { HomeActions } from './actions/home.actions';
import { SharedModule } from '../shared/shared.module';
import { CompanyActions } from './actions/company.actions';
import { EffectsModule } from '@ngrx/effects';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule,
    SharedModule.forRoot(),
    EffectsModule.run(CompanyActions)],
  exports: [CommonModule, FormsModule, RouterModule, EffectsModule]
})
export class ServiceModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        StorageService,
        CurrentUserService,
        HttpWrapperService,
        AuthenticationService,
        ErrorHandlerService,
        ToasterService
      ]
    };
  }
}
