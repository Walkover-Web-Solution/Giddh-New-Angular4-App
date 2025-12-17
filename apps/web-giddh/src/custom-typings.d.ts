/*
 * Custom Type Definitions for Angular 21
 * When including 3rd party modules you also need to include the type definition for the module
 * if they don't provide one within the module. You can try to install it with @types

npm install @types/node
npm install @types/lodash

 * If you can't find the type definition in the registry we can make an ambient/global definition in
 * this file for now. For example

declare module 'my-module' {
 export function doesSomething(value: string): string;
}

 * For Angular 21 compatibility, ensure all module declarations are properly typed
 */

declare var assert: any;
declare var _: any;
declare var $: any;

/*
 * If you're importing a module that uses Node.js modules which are CommonJS you need to import as
 * in the files such as main.browser.ts or any file within app/
 *
 * You can include your type definitions in this file until you create one for the @types
 *
 */
// support NodeJS modules without type definitions

// declare module '*';

/*
// for legacy tslint etc to understand rename 'modern-lru' with your package
// then comment out `declare module '*';`. For each new module copy/paste
// this method of creating an `any` module type definition
declare module 'modern-lru' {
  let x: any;
  export = x;
}
*/

// Global variables for Angular 21 - injected by webpack DefinePlugin
declare var VERSION: string;
declare var ENV: string;
declare var HMR: boolean;
declare var System: SystemJS;
declare var AppUrl: string;
declare var PRODUCTION_ENV: boolean;
declare var STAGING_ENV: boolean;
declare var TEST_ENV: boolean;
declare var LOCAL_ENV: boolean;
declare var APP_FOLDER: string;
declare var ApiUrl: string;
declare var UkApiUrl: string;
declare var PORTAL_URL: string;
declare var isElectron: boolean;
declare var fileChooser: any;
declare var FilePicker: any;
declare var errlyticsNeeded: boolean;
declare var errlyticsKey: string;
declare var _: any;
declare var enableVoucherAdjustmentMultiCurrency: boolean;
declare var GOOGLE_CLIENT_ID: string;
declare var GOOGLE_CLIENT_SECRET: string;
declare var RAZORPAY_KEY: string;
declare var OTP_WIDGET_ID: string;
declare var OTP_TOKEN_AUTH: string;

// Angular 21 specific module declarations
declare module 'dayjs' {
  const dayjs: any;
  export = dayjs;
}

declare module 'dayjs/plugin/quarterOfYear' {
  const quarterOfYear: any;
  export = quarterOfYear;
}

interface SystemJS {
    import: (path?: string) => Promise<any>;
}

interface GlobalEnvironment {
    VERSION: string;
    ENV: string;
    HMR: boolean;
    SystemJS: SystemJS;
    System: SystemJS;
    AppUrl: string;
    ApiUrl: string;
    UkApiUrl: string;
    PORTAL_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    OTP_WIDGET_ID: string;
    OTP_TOKEN_AUTH: string;
    isElectron: boolean;
    errlyticsNeeded: boolean;
    errlyticsKey: string;
    APP_FOLDER: string;
    RAZORPAY_KEY: string;
    enableVoucherAdjustmentMultiCurrency: boolean;
    PRODUCTION_ENV: boolean;
    STAGING_ENV: boolean;
    TEST_ENV: boolean;
    LOCAL_ENV: boolean;
}

interface Es6PromiseLoader {
    (id: string): (exportName?: string) => Promise<any>;
}

type FactoryEs6PromiseLoader = () => Es6PromiseLoader;
type FactoryPromise = () => Promise<any>;

type AsyncRoutes = {
    [component: string]: Es6PromiseLoader |
    Function |
    FactoryEs6PromiseLoader |
    FactoryPromise;
};

type IdleCallbacks = Es6PromiseLoader |
    Function |
    FactoryEs6PromiseLoader |
    FactoryPromise;

interface WebpackModule {
    hot: {
        data?: any,
        idle: any,
        accept(dependencies?: string | string[], callback?: (updatedDependencies?: any) => void): void;
        decline(deps?: any | string | string[]): void;
        dispose(callback?: (data?: any) => void): void;
        addDisposeHandler(callback?: (data?: any) => void): void;
        removeDisposeHandler(callback?: (data?: any) => void): void;
        check(autoApply?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
        apply(options?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
        status(callback?: (status?: string) => void): void | string;
        removeStatusHandler(callback?: (status?: string) => void): void;
    };
}

interface WebpackRequire {
    (id: string): any;

    (paths: string[], callback: (...modules: any[]) => void): void;

    ensure(ids: string[], callback: (req: WebpackRequire) => void, chunkName?: string): void;

    context(directory: string, useSubDirectories?: boolean, regExp?: RegExp): WebpackContext;
}

interface WebpackContext extends WebpackRequire {
    keys(): string[];
}

interface ErrorStackTraceLimit {
    stackTraceLimit: number;
}

// Extend typings
interface NodeRequire extends WebpackRequire {
}

interface ErrorConstructor extends ErrorStackTraceLimit {
}

interface NodeRequireFunction extends Es6PromiseLoader {
}

interface NodeModule extends WebpackModule {
}

interface Global extends GlobalEnvironment {
}







