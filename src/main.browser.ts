/**
 * Angular bootstrapping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './app/environment';

/**
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs';

const debuggerOn = true;

Observable.prototype.debug = function(message: string) {
    return this.do(
        nextValue => {
            if (debuggerOn) {
                console.log(message, nextValue);
            }
        },
        error => {
            if (debuggerOn) {
                console.error(message, error);
            }
        },
        () => {
            if (debuggerOn) {
                console.error('Observable completed - ', message);
            }
        }
    );
};

declare module 'rxjs/Observable' {
    interface Observable<T> {
        // tslint:disable-next-line:variable-name
        debug: (...any) => Observable<T>;
    }
}

/**
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
}

/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
  case 'loading':
    document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
    break;
  case 'interactive':
  case 'complete':
  default:
    main();
}

function _domReadyHandler() {
 document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
 main();
}
