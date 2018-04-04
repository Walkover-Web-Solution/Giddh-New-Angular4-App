import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as _ from '../../lodash-optimized';
import { ViewChild } from '@angular/core/src/metadata/di';
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { ViewContainerRef } from '@angular/core/src/linker/view_container_ref';

@Component({
  selector: 'aside-custom-stock',
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
  `],
  templateUrl: './aside-custom-stock.component.html'
})
export class AsideCustomStockComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  public asideClose: boolean;
  public createCustomStockSuccess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>
  ) {
    this.createCustomStockSuccess$ = this.store.select(s => s.inventory.createCustomStockSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.asideClose = false;

    this.createCustomStockSuccess$.subscribe((a) => {
      if (a) {
        this.closeAsidePane();
      }
    });
  }

  public closeAsidePane(event?) {
    this.closeAsideEvent.emit();
    this.asideClose = true;
    setTimeout(() => {this.asideClose = false; }, 500);
  }

}
