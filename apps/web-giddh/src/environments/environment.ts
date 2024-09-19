/* tslint:disable */

import { ApplicationRef, NgModuleRef } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

Error.stackTraceLimit = Infinity;

export const environment: Environment = {
    production: false,
    AppUrl: 'http://localhost:3000/',
    ApiUrl: 'https://apitest.giddh.com/',
    UkApiUrl: 'http://giddh-api-prod-g.eu-west-2.elasticbeanstalk.com/',
    isElectron: false,
    APP_FOLDER: '',
    showDevModule: true,

    /** Angular debug tools in the dev console
     * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
     * @param modRef
     * @return {any}
     */
    decorateModuleRef(modRef: NgModuleRef<any>) {
        const appRef = modRef.injector.get(ApplicationRef);
        const cmpRef = appRef.components[0];

        let _ng = (<any>window).ng;
        enableDebugTools(cmpRef);
        (<any>window).ng.probe = _ng.probe;
        (<any>window).ng.coreTokens = _ng.coreTokens;
        return modRef;
    },
    ENV_PROVIDERS: []
};
