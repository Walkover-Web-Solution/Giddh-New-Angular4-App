import { NgModuleRef } from '@angular/core';

export interface Environment {
  production: boolean;
  ENV_PROVIDERS: any;
  showDevModule: boolean;
  AppUrl: string;
  ApiUrl: string;
  isElectron: boolean;
  OtpToken: string;
  APP_FOLDER: string;
  decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
