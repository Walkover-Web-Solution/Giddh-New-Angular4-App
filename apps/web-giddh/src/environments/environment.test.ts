/* tslint:disable */
import { enableProdMode, NgModuleRef } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

enableProdMode();

export const environment: Environment = {
  production: true,
  showDevModule: false,
  AppUrl: 'http://test.giddh.com/',
  ApiUrl: 'http://localhost:9292/giddh-api/',
  isElectron: false,
  OtpToken: 'tjvgxpu1uTolUyia4i71jgTjhO0B75K2UK1u23MOndbObbwBw2c1O_zdSc-RLxd0Fc9REpC46NQzzu0hMIxKWL-hqS_xOSxZpVtLE_9WOlk=',
  APP_FOLDER: 'app/',
  /** Angular debug tools in the dev console
   * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
   * @param modRef
   * @return {any}
   */
  decorateModuleRef(modRef: NgModuleRef<any>) {
    disableDebugTools();
    return modRef;
  },
  ENV_PROVIDERS: []
};
