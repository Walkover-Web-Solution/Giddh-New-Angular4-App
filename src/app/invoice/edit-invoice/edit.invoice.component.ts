/**
 * Created by kunalsaxena on 6/29/17.
 */

import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';


@Component({
  selector: 'edit-invoice',

  templateUrl: 'edit.invoice.component.html'
})

export class EditInvoiceComponent implements OnInit {
  public templateId: string = 'template1';
  public heading: string = 'Walkover Web Soluitons'
  public templateID$: Observable<string>;
  public heading$: Observable<string>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>) {
    console.log('edit-invoice-component');

    this.templateID$ = store.select(state => {
      return state.invoice.templateId;
    }).takeUntil(this.destroyed$);
    this.templateID$.subscribe(val => {
      this.templateId = val;
      console.log(this.templateId);
    });

    this.heading$ = store.select(state => {
      return state.invoice.heading;
    }).takeUntil(this.destroyed$);
    this.heading$.subscribe(val => {
      this.heading = val;
      console.log(this.heading);
    });
  }
  public ngOnInit() {
    console.log('edit-invoice-component');

  }

}
