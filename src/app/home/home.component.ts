
import { Store } from '@ngrx/store';
import { HomeActions } from './actions/home.actions';
import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../reducers/roots';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  /**
   * Set our default values
   */
  public localState = { value: '' };
  /**
   * TypeScript public modifiers
   */
  constructor(
  // tslint:disable-next-line:no-empty
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
  }
}
