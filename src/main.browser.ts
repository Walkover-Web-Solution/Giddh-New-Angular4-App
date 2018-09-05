/**
 * Angular bootstrapping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';
/**
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';
import { Observable } from 'rxjs';

// import { Observable } from 'rxjs';

const debuggerOn = true;

const debug = <T>() => (source: Observable<T>) => new Observable<T>((subscriber) => {
  source.subscribe({
    next(value) {
      if (debuggerOn) {
        subscriber.next(value);
      }
    },
    error(err) {
      if (debuggerOn) {
        subscriber.error(err);
      }
    },
    complete() {
      if (debuggerOn) {
        subscriber.complete();
      }
    },
  });
});

/**
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  if (module.hot) {
    module.hot.accept();
  }
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(environment.decorateModuleRef)
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
