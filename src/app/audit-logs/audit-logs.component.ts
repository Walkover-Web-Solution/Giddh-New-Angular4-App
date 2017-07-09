import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'audit-logs',
  templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit {
  constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    console.log('hello audit-logs module');
    // this.exampleData = [
    // ];
  }
}
