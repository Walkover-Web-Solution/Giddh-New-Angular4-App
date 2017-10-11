import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'aside-menu-product-service',
  styles: [`
    :host{
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 500px;
      z-index: 1045;
    }
    #close{
      display: none;
    }
    :host.in #close{
      display: block;
      position: fixed;
      left: -42px;
      top: 0;
      z-index: 5;
    }
    .aside-pane{
      display: flex;
      width: 100%;
    }
    .flexy-child{
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .flexy-child-1{
      flex-grow: 1;
    }
  `],
  templateUrl: './component.html'
})
export class AsideMenuProductServiceComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  // public
  public isAddStockOpen: boolean = false;

  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>
  ) {
    // constructor methods
  }

  public ngOnInit() {
    //
  }

  public toggleStockPane() {
    this.isAddStockOpen = !this.isAddStockOpen;
  }

  public closeAsidePane() {
    this.closeAsideEvent.emit();
  }
}
