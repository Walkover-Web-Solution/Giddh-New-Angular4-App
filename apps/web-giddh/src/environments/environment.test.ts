/* tslint:disable */
import { enableProdMode, NgModuleRef } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

enableProdMode();

export const environment: Environment = {
    production: true,
    showDevModule: false,
    AppUrl: 'https://test.giddh.com',
    ApiUrl: 'http://localhost:9292/giddh-api/',
    UkApiUrl: 'http://giddh-api-prod-g.eu-west-2.elasticbeanstalk.com/',
    isElectron: false,
    APP_FOLDER: '/',
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
