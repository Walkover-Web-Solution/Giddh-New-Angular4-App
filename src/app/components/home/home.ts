/// <reference path="../../../typings/_custom.d.ts" />

/*
 * Angular 2
 */
import {Component, View} from 'angular2/annotations';

/*
 * Directives
 * angularDirectives: Angular's core/form/router directives
 * appDirectives: Our collection of directives from /directives
 */
import {appDirectives, angularDirectives} from 'app/directives/directives';

// Use webpack's `require` to get files as a raw string using raw-loader
let styles   = require('./home.css');
let template = require('./home.html');

// Simple external file component example
@Component({
  selector: 'home'
})
@View({
  directives: [ angularDirectives, appDirectives ],
  // include our .html and .css file
  styles: [ styles ],
  template: template
})
export class Home {
  constructor() {

  }
}
