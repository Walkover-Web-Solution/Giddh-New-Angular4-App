import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'aside-pane',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ],
  styles: [`
  :host.in {
    left: auto;
    top: 0;
    right: 0;
    bottom: 0;
    width: 580px;
    z-index: 1045;
    position:fixed;
    display:block;
  }
  :host.out {
    display:none;
  }
  :host.in #close {
    display: block;
    position: fixed;
    left: auto;
    right: 572px;
    top: 0;
    z-index: 5;
    border: 0;
    border-radius: 0;
  }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      width: 580px;
      background: #fff;
    }

    .aside-pane {
      width: 100%;
    }

    .flexy-child {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .flexy-child-1 {
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

    :host.in #back {
      display: block;
      position: fixed;
      left: none;
      right: 572px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }

    .btn-lg {
      min-width: 140px;
      background:#FFF3EC;
      color:#FF5F00;
      border-radius:0px;
      box-shadow:none;
    }
    .btn-lg:hover{
      background:#FF5F00;
      color:#FFFFFF;
      box-shadow: 0px 4px 4px -3px #afabab;
      border-radius:0px;
    }
  `],
  templateUrl: './aside-pane.components.html'
})
export class AsidePaneComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public autoFocus: boolean = false;
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public animatePaneAside: EventEmitter<any> = new EventEmitter();
  // @Input() public openGroupPane: boolean;

  // public
  public isAddStockOpen: boolean = false;
  public isAddGroupOpen: boolean = false;
  public isAddUnitOpen: boolean = false;
  public hideFirstScreen: boolean = false;
  public hideFirstStep: boolean = false;
  public openGroupAsidePane$: Observable<boolean>;
  public createGroupSuccess$: Observable<boolean>;
  public manageInProcess$: Observable<any>;
  public addGroup: boolean;
  public addStock: boolean;
  public createStockSuccess$: Observable<boolean>;
  public createCustomStockSuccess$: Observable<boolean>;
  public autoFocusOnChild: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private inventoryAction: InventoryAction,
    private _router: Router,
  ) {
    this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
    this.createGroupSuccess$ = this.store.select(state => state.inventory.createGroupSuccess).pipe(takeUntil(this.destroyed$));
    this.createCustomStockSuccess$ = this.store.select(s => s.inventory.createCustomStockSuccess).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.createStockSuccess$.subscribe(s => {
      if (s) {
        debugger;
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
      }
    });
    this.createGroupSuccess$.subscribe(s => {
      if (s) {
        this.hideFirstScreen = false;
        this.isAddGroupOpen = false;
      }
    });
    this.createCustomStockSuccess$.subscribe(s => {
      if (s) {
        // this.hideFirstScreen = false;
        // this.isAddUnitOpen = false;
      }
    });
  }

  public toggleStockPane() {
    this.hideFirstScreen = true;
    this.isAddStockOpen = false;
    this.isAddStockOpen = !this.isAddStockOpen;
  }

  public toggleGroupPane() {
    this.hideFirstScreen = true;
    this.isAddGroupOpen = false;
    this.isAddGroupOpen = !this.isAddGroupOpen;
  }

  public toggleUnitPane() {
    this.hideFirstScreen = true;
    this.isAddUnitOpen = false;
    this.isAddUnitOpen = !this.isAddUnitOpen;
  }
  public toggleImport() {
    this.closeAsidePane();
    this._router.navigate(['pages', 'import', 'stock']);
  }
  public backButtonPressed() {
    this.hideFirstScreen = false;
    this.isAddStockOpen = false;
    this.isAddGroupOpen = false;
    this.isAddUnitOpen = false;
  }
  public closeAsidePane(e?: any) {
    this.hideFirstStep = false;
    this.isAddStockOpen = false;
    this.isAddGroupOpen = false;
    this.isAddUnitOpen = false;
    this.addGroup = false;
    this.addStock = false;
    if (e) {
      //
    } else {
      this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(false));
      this.closeAsideEvent.emit();
      let objToSend = { isOpen: false, isGroup: false, isUpdate: false };
      this.store.dispatch(this.inventoryAction.ManageInventoryAside(objToSend));
    }
  }

  public animateAside(e: any) {
    this.animatePaneAside.emit(e);
  }

  public ngOnChanges(c) {
    if (c.autoFocus && c.autoFocus.currentValue) {
      this.autoFocusOnChild = true;
    } else {
      this.autoFocusOnChild = false;
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
