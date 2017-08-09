/**
 * Created by kunalsaxena on 6/29/17.
 */

import {
  Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges, Component
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {getTemplate} from "codelyzer/util/ngQuery";
import {InvoiceAction} from "../../services/actions/invoice/invoice.actions";

@Component({
  selector: 'edit-invoice',

  templateUrl: 'edit.invoice.component.html'
})

export class EditInvoiceComponent implements OnInit {
  public templateId: string = 'template1';
  public heading: string = 'Walkover Web Soluitons';
  public templateID$: Observable<string>;
  public heading$: Observable<string>;
  public tableMeta$: Observable<TableMetaMap>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private invoiceAction: InvoiceAction) {

    this.store.dispatch(this.invoiceAction.getTemplateState());


    // this.tableMeta$ = this.store.select( state => {
    //   return state.invoice.table;
    //   }).takeUntil(this.destroyed$);
    //   this.tableMeta$.subscribe(val => {
    //     console.log(val);
    //   });
  }
  public ngOnInit() {

    console.log('edit-invoice-component');
    // TODO: Fetch current template object and bind to template component
    this.templateID$ = this.store.select(state => {
      return state.invoice.template.templateId;
    }).takeUntil(this.destroyed$);
    this.templateID$.subscribe(val => {
      this.templateId = val;
      // console.log(this.templateId);
    });

    this.heading$ = this.store.select(state => {
      return state.invoice.template.heading;
    }).takeUntil(this.destroyed$);
    this.heading$.subscribe(val => {
      this.heading = val;
      console.log(this.heading);
    });
    this.store.subscribe(val => {
      console.log(val);
    });
  }

}
export interface TableMetaMap {
  [ colName: string ]: number;
}
