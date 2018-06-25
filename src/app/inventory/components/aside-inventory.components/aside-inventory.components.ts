import { Component, EventEmitter, OnInit, Output, Input, OnChanges, OnDestroy } from '@angular/core';
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
      width: 580px;
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
      width: 580px;
      background: #fff;
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
export class AsideInventoryComponent implements OnInit, OnChanges, OnDestroy {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public animatePaneAside: EventEmitter<any> = new EventEmitter();
  // @Input() public openGroupPane: boolean;

  // public
  public isAddStockOpen: boolean = false;
  public isAddGroupOpen: boolean = false;
  public hideFirstStep: boolean = false;
  public openGroupAsidePane$: Observable<boolean>;
  public createGroupSuccess$: Observable<boolean>;
  public removeGroupSuccess$: Observable<boolean>;
  public removeStockSuccess$: Observable<boolean>;
  public UpdateGroupSuccess$: Observable<boolean>;
  public UpdateStockSuccess$: Observable<boolean>;
  public manageInProcess$: Observable<any>;
  public addGroup: boolean;
  public addStock: boolean;
  public createStockSuccess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private inventoryAction: InventoryAction
  ) {
    this.openGroupAsidePane$ = this.store.select(s => s.inventory.showNewGroupAsidePane).takeUntil(this.destroyed$);
    this.createGroupSuccess$ = this.store.select(s => s.inventory.createGroupSuccess).takeUntil(this.destroyed$);
    this.manageInProcess$ = this.store.select(s => s.inventory.inventoryAsideState).takeUntil(this.destroyed$);
    this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).takeUntil(this.destroyed$);
    this.removeStockSuccess$ = this.store.select(s => s.inventory.deleteStockSuccess).takeUntil(this.destroyed$);
    this.removeGroupSuccess$ = this.store.select(s => s.inventory.deleteGroupSuccess).takeUntil(this.destroyed$);
    this.UpdateStockSuccess$ = this.store.select(s => s.inventory.UpdateStockSuccess).takeUntil(this.destroyed$);
    this.UpdateGroupSuccess$ = this.store.select(s => s.inventory.UpdateGroupSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {

    this.manageInProcess$.subscribe(s => {
      if (s.isOpen && s.isGroup) {
        this.isAddGroupOpen = true;
        this.isAddStockOpen = false;
        if (s.isUpdate) {
          this.addGroup = false;
        } else {
          this.addGroup = true;
        }
      } else if (s.isOpen && !s.isGroup) {
        this.isAddGroupOpen = false;
        this.isAddStockOpen = true;
        if (s.isUpdate) {
          this.addStock = false;
        } else {
          this.addStock = true;
        }
      }
    });

    this.createGroupSuccess$.subscribe(d => {
      if (d && this.isAddGroupOpen) {
        this.closeAsidePane();
      }
    });

    this.createStockSuccess$.subscribe(d => {
      if (d && this.isAddStockOpen) {
        this.closeAsidePane();
      }
    });

    // subscribe createStockSuccess for resting form
    this.removeStockSuccess$.subscribe(s => {
      if (s) {
        this.closeAsidePane();
        }
    });

    this.removeGroupSuccess$.subscribe(s => {
      if (s) {
        this.closeAsidePane();
        }
    });

    this.UpdateStockSuccess$.subscribe(s => {
      if (s) {
        this.closeAsidePane();
        }
    });

    this.UpdateGroupSuccess$.subscribe(s => {
      if (s) {
        this.closeAsidePane();
        }
    });

  }

  public openGroupPane() {
    this.hideFirstStep = true;
    this.isAddStockOpen = false;
  }

  public openStockPane() {
    this.hideFirstStep = true;
    this.isAddStockOpen = true;
  }

  public closeAsidePane(e?: any) {
    this.hideFirstStep = false;
    this.isAddStockOpen = false;
    this.isAddGroupOpen = false;
    this.addGroup = false;
    this.addStock = false;
    if (e) {
      //
    } else {
      this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(false));
      this.closeAsideEvent.emit();
      let objToSend = { isOpen: false, isGroup: false, isUpdate: false };
      this.store.dispatch(this.inventoryAction.ManageInventoryAside( objToSend ));
    }
  }

  public animateAside(e: any) {
    this.animatePaneAside.emit(e);
  }

  public ngOnChanges(c) {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
