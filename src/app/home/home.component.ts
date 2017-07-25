import { Store } from '@ngrx/store';
import { HomeActions } from './actions/home.actions';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    //
  }

  public ngOnInit() {
    console.log('hello `Home` component');
  }

  public hardRefresh() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
