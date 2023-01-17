import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
    selector: 'aside-custom-stock',
    styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width:580px;
      z-index: 99999;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
      position: fixed;
      left: -41px;
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
      width: 100%;
      max-width:580px;
      background: #fff;
    }
  `],
    templateUrl: './aside-custom-stock.component.html'
})
export class AsideCustomStockComponent implements OnInit, OnDestroy {

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Stores the menu state */
    @Input() public menuState;

    public asideClose: boolean;
    public createCustomStockSuccess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>
    ) {
        this.createCustomStockSuccess$ = this.store.pipe(select(s => s.inventory.createCustomStockSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.asideClose = false;
    }

    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
        this.asideClose = true;
        setTimeout(() => {
            this.asideClose = false;
        }, 500);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
