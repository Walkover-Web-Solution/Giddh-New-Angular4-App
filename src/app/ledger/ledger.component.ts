import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import {
  Component,
  OnInit
} from '@angular/core';
import { LedgerVM } from './ledger.vm';

@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html'
})
export class LedgerComponent implements OnInit {
  public lc: LedgerVM;
  constructor(private store: Store<AppState>) {
    this.lc = new LedgerVM();
  }

  public ngOnInit() {
    console.log('hello ledger module');
    // this.exampleData = [
    // ];
  }
}
