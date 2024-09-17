/* tslint:disable */
import { NgModuleRef } from '@angular/core';
import { Environment } from './model';

export const environment: Environment = {
    production: true,
    showDevModule: false,
    AppUrl: 'http://localhost:3000',
    ApiUrl: 'https://apitest.giddh.com/',
    DevApiUrl: 'http://giddh-api-prod-g.eu-west-2.elasticbeanstalk.com/',
    isElectron: false,
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
