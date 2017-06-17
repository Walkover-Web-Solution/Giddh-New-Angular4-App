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
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  // tslint:disable-next-line:no-empty
  constructor() { }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {}

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
