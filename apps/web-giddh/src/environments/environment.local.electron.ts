/* tslint:disable */
import { NgModuleRef } from '@angular/core';
import { Environment } from './model';

export const environment: Environment = {
    production: true,
    showDevModule: true,
    AppUrl: 'http://localhost:4200/',
    ApiUrl: 'https://api.giddh.com/',
    UkApiUrl: 'https://routes.msg91.com/api/proxy/117230/33scfei2',
    isElectron: true,
    APP_FOLDER: '',
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
