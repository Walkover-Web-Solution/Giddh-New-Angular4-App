import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as _ from '../../lodash-optimized';
import { InventoryAction } from 'app/actions/inventory/inventory.actions';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
    .vmiddle {
      position: absolute;
      top: 50%;
      bottom: 0;
      left: 0;
      display: table;
      width: 100%;
      right: 0;
      transform: translateY(-50%);
      text-align: center;
      margin: 0 auto;
    }
  `],
  templateUrl: './aside-inventory.components.html'
})
export class AsideInventoryComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public animatePaneAside: EventEmitter<any> = new EventEmitter();

  // public
  public isAddStockOpen: boolean = false;
  public isAddGroupOpen: boolean = false;
  public hideFirstStep: boolean = false;
  public openGroupAsidePane$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private inventoryAction: InventoryAction
  ) {
    this.openGroupAsidePane$ = this.store.select(s => s.inventory.showNewGroupAsidePane).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.openGroupAsidePane$.subscribe(s => {
      if (s) {
        this.toggleGroupPane();
      }
    });

  }

  public toggleGroupPane() {
    this.hideFirstStep = true;
    this.isAddStockOpen = false;
    this.isAddGroupOpen = !this.isAddGroupOpen;
  }

  public closeAsidePane(e?: any) {
    this.hideFirstStep = false;
    this.isAddStockOpen = false;
    this.isAddGroupOpen = false;
    if (e) {
      //
    } else {
      this.store.dispatch(this.inventoryAction.OpenNewGroupAsidePane(false));
      this.closeAsideEvent.emit();
    }
  }

  public animateAside(e: any) {
    this.animatePaneAside.emit(e);
  }

}
