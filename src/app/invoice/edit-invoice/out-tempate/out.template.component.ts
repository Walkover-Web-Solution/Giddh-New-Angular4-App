import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges
} from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { Store} from '@ngrx/store';
import { AppState} from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'invoice-template',

  templateUrl: 'out.template.component.html',
  styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit {
  public templateId: string;
  public templateID$: Observable<string>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor( private store: Store<AppState>) {
    console.log('out-template-component constructor called');
    this.templateID$ = store.select(state => {
      return state.invoice.templateId;
    }).takeUntil(this.destroyed$);
    this.templateID$.subscribe(val => {console.log(val);
    });
  }

  public ngOnInit() {
    console.log('out-template-component initialised');

  }
}
