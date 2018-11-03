import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToasterService } from 'app/services/toaster.service';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'filing-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
  providers: [
    {
      provide: BsDropdownConfig, useValue: {autoClose: true},
    },
    {
      provide: AlertConfig, useValue: {}
    }
  ],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in <=> out', animate('400ms ease-in-out')),
    ])
  ]
})
export class FilingHeaderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public currentPeriod: string = null;
  @Input() public selectedGst: string = null;
  public reconcileIsActive: boolean = false;
  public gstAuthenticated$: Observable<boolean>;
  public GstAsidePaneState: string = 'out';
  public selectedService: string;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _toasty: ToasterService,
    private _reconcileAction: GstReconcileActions
  ) {
    this.gstAuthenticated$ = this.store.select(p => p.gstReconcile.gstAuthenticated).pipe(take(1));
    // this.gstAuthenticated$.subscribe(s => {
    //   if (!s) {
    //     this.toggleSettingAsidePane(null, 'RECONCILE');
    //   }
    // });
  }

  public ngOnInit() {

  }

  /**
   * pullFromGstIn
   */
  public pullFromGstIn(ev) {
    console.log(ev);
    this.store.dispatch(this._reconcileAction.showPullFromGstInModal());
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges() {
    //
  }

  /**
   * toggleSettingAsidePane
   */
  public toggleSettingAsidePane(event, selectedService?: 'JIO_GST' | 'TAX_PRO' | 'RECONCILE'): void {
    if (event) {
      event.preventDefault();
    }

    if (selectedService === 'RECONCILE') {
      let checkIsAuthenticated;
      this.gstAuthenticated$.pipe(take(1)).subscribe(auth => checkIsAuthenticated = auth);
    }
    this.selectedService = selectedService;
    this.GstAsidePaneState = this.GstAsidePaneState === 'out' ? 'in' : 'out';
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
