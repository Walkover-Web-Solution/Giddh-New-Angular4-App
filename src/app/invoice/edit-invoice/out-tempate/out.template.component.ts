import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges
} from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { Store} from '@ngrx/store';
import { AppState} from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {TableMetaMap} from '../edit.invoice.component';
import ownKeys = Reflect.ownKeys;
@Component({
  selector: 'invoice-template',

  templateUrl: 'out.template.component.html',
  styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit {
  @Input() public templateId: string = 'template1';
  @Input() public heading: string;
  @Input() public tableMetaMap: Observable<TableMetaMap>
  public itemWidth: number;
  public itemCodeWidth: number;
  public tableMeta$: Observable<TableMetaMap>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor( private store: Store<AppState>) {
    console.log('out-template-component constructor called');

    this.tableMeta$ = this.store.select( state => {
      return state.invoice.table;
    }).takeUntil(this.destroyed$);
    this.tableMeta$.subscribe(val => {
      if (val['item']) {
        this.itemWidth = 20 + val['item'];
        console.log(this.itemWidth);
      }
      if (val['itemCode']) {
        this.itemCodeWidth = 30 + val['itemCode'];
      }
    });
  }

  public ngOnInit() {
    console.log('out-template-component initialised');

  }
}

export interface TableMetaMap {
  [ colName: string ]: number;
}
