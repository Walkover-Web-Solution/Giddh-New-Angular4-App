import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    console.log('hello Search module');
    // this.exampleData = [
    // ];
  }
}
