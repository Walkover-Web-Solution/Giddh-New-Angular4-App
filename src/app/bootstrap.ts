/// <reference path="../../typings/angular2/angular2.d.ts" />

import {bootstrap} from 'angular2/angular2';
import {routerInjectables} from 'angular2/router';

import {App} from 'components/app';

bootstrap(App, [
  routerInjectables
]);
