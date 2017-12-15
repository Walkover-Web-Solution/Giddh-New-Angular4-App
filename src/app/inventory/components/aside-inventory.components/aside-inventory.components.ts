import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as _ from '../../lodash-optimized';
import { InventoryAction } from 'app/actions/inventory/inventory.actions';

@Component({
  selector: 'aside-inventory-stock-group',
  styles: [`
    :host{
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 530px;
      z-index: 1045;
    }
    #close{
      display: none;
    }
    :host.in  #close{
      display: block;
      position: fixed;
      left: -41px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }
    :host .container-fluid{
      padding-left: 0;
      padding-right: 0;
    }
    :host .aside-pane {
      width: 530px;
    }
    .aside-pane{
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
  templateUrl: './aside-inventory.components.html'
})
export class AsideInventoryComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public animatePAside: EventEmitter<any> = new EventEmitter();

  // public
  public isAddStockOpen: boolean = false;
  public isAddServiceOpen: boolean = false;
  public hideFirstStep: boolean = false;

  constructor(
    private store: Store<AppState>, private inventoryAction: InventoryAction
  ) {
  }

  public ngOnInit() {

  }

  public toggleGroupPane() {
    this.hideFirstStep = true;
    this.isAddStockOpen = false;
    this.isAddServiceOpen = !this.isAddServiceOpen;
    this.store.dispatch(this.inventoryAction.resetActiveGroup());
  }

  public closeAsidePane(e?: any) {
    this.hideFirstStep = false;
    this.isAddStockOpen = false;
    this.isAddServiceOpen = false;
    if (e) {
      //
    } else {
      this.closeAsideEvent.emit();
    }
  }

  public animateAside(e: any) {
    this.animatePAside.emit(e);
  }

}
