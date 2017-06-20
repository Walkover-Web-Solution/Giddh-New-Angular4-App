/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { HomeState, HomeActions } from './services';
import { AppState } from './reducers/roots';
import { Store } from '@ngrx/store';
import { ToastyConfig } from 'ng2-toasty';
/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'body',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K2L9QG"
       height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
    <router-outlet></router-outlet>
    <ng2-toasty></ng2-toasty>
  `
})
export class AppComponent implements OnInit {
  // tslint:disable-next-line:no-empty
  constructor(public _toastyConfig: ToastyConfig) {
    this._toastyConfig.theme = 'bootstrap';
    this._toastyConfig.position = 'top-right';
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() { }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
