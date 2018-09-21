/* tslint:disable */
import { NgModuleRef } from '@angular/core';
import { Environment } from './model';

export const environment: Environment = {
  production: true,
  showDevModule: false,
  AppUrl: 'http://test.giddh.com/',
  ApiUrl: 'http://apitest.giddh.com/',
  isElectron: false,
  OtpToken: '73k6G_GDzvhy4XE33EQCaKUnC0PHwEZBvf0qsZ3Q9S3ZBcXH-f_6JT_4fH-Qx1Y5LxIIwzqy7cFQVMoyUSXBfLL5WBX6oQWifweWIQlJQ8YkRZ1lAmu3oqwvNJXP1Y5ZTXDHO1IV5-Q63zwNbzxTFw==',
  APP_FOLDER: 'app/',
  /** Angular debug tools in the dev console
   * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
   * @param modRef
   * @return {any}
   */
  decorateModuleRef(modRef: NgModuleRef<any>) {
    // disableDebugTools();
    return modRef;
  },
  ENV_PROVIDERS: []
};
