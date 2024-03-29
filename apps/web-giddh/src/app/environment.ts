
// /**
//  * Angular 2
//  */
// import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';
// import { ApplicationRef, enableProdMode } from '@angular/core';

// /**
//  * Environment Providers
//  */
// let PROVIDERS: any[] = [
//   /**
//    * Common env pipes
//    */
// ];

// /**
//  * Angular debug tools in the dev console
//  * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
//  */
// let _decorateModuleRef = <T>(value: T): T => value;

// if ('development' !== ENV) {
//   enableProdMode();

//   /**
//    * Production
//    */
//   _decorateModuleRef = (modRef: any) => {
//     disableDebugTools();

//     return modRef;
//   };

//   PROVIDERS = [
//     ...PROVIDERS,
//     /**
//      * Custom providers in production.
//      */
//   ];

// } else {

//   _decorateModuleRef = (modRef: any) => {
//     const appRef = modRef.injector.get(ApplicationRef);
//     const cmpRef = appRef.components[0];

//     let _ng = (window as any).ng;
//     enableDebugTools(cmpRef);
//     (window as any).ng.probe = _ng.probe;
//     (window as any).ng.coreTokens = _ng.coreTokens;
//     return modRef;
//   };

//   /**
//    * Development
//    */
//   PROVIDERS = [
//     ...PROVIDERS,
//     /**
//      * Custom providers in development.
//      */
//   ];

// }

// export const decorateModuleRef = _decorateModuleRef;

// export const ENV_PROVIDERS = [
//   ...PROVIDERS
// ];
