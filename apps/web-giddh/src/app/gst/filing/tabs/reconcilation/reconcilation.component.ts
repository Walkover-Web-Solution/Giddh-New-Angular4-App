import { Component, Input, ComponentFactoryResolver, ViewChild, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { GstReconcileInvoiceDetails } from 'app/models/api-models/GstReconcile';
import { Observable, ReplaySubject } from 'rxjs';
import { ReconcileActionState } from 'app/store/GstReconcile/GstReconcile.reducer';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { InvoicePurchaseActions } from 'app/actions/purchase-invoice/purchase-invoice.action';
import { ToasterService } from 'app/services/toaster.service';
import { CompanyActions } from 'app/actions/company.actions';
import { PurchaseInvoiceService } from 'app/services/purchase-invoice.service';
import { AccountService } from 'app/services/account.service';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { SettingsProfileActions } from 'app/actions/settings/profile/settings.profile.action';
import { PaginationComponent, BsDropdownConfig, AlertConfig } from 'ngx-bootstrap';
import { ElementViewContainerRef } from 'app/shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as  moment from 'moment/moment';
import { AppState } from 'app/store/roots';
import { Location } from '@angular/common';

@Component({
  selector: 'reconcile',
  templateUrl: './reconcilation.component.html',
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
export class ReconcileComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public data: GstReconcileInvoiceDetails = null;
  @Input() public currentPeriod: any = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';
  @Input() public selectedTab: string = '';

  @ViewChild('pgGstNotFoundOnPortal') public pgGstNotFoundOnPortal: ElementViewContainerRef;
  @ViewChild('pgGstNotFoundOnGiddh') public pgGstNotFoundOnGiddh: ElementViewContainerRef;
  @ViewChild('pgPartiallyMatched') public pgPartiallyMatched: ElementViewContainerRef;
  @ViewChild('pgMatched') public pgMatched: ElementViewContainerRef;

  public gstReconcileInvoiceRequestInProcess$: Observable<boolean>;
  public gstAuthenticated$: Observable<boolean>;
  public gstFoundOnGiddh$: Observable<boolean>;
  public gstNotFoundOnGiddhData$: Observable<ReconcileActionState>;
  public gstNotFoundOnPortalData$: Observable<ReconcileActionState>;
  public gstMatchedData$: Observable<ReconcileActionState>;
  public gstPartiallyMatchedData$: Observable<ReconcileActionState>;
  public reconcileActiveTab: string = 'NOT_ON_PORTAL';
  public selectedDateForGSTR1 = {};
  public moment = moment;
  public pullFromGstInProgress$: Observable<boolean>;
  public imgPath: string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private location: Location,
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions,
    private toasty: ToasterService,
    private companyActions: CompanyActions,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private accountService: AccountService,
    private _reconcileActions: GstReconcileActions,
    private componentFactoryResolver: ComponentFactoryResolver,
    private settingsProfileActions: SettingsProfileActions
  ) {
    this.reconcileTabChanged('NOT_ON_PORTAL');
    this.gstReconcileInvoiceRequestInProcess$ = this.store.select(s => s.gstReconcile.isGstReconcileInvoiceInProcess).pipe(takeUntil(this.destroyed$));
    this.gstAuthenticated$ = this.store.select(p => p.gstR.gstAuthenticated).pipe(takeUntil(this.destroyed$));
    this.gstFoundOnGiddh$ = this.store.select(p => p.gstReconcile.gstFoundOnGiddh).pipe(takeUntil(this.destroyed$));
    this.gstNotFoundOnGiddhData$ = this.store.select(p => p.gstReconcile.gstReconcileData.notFoundOnGiddh).pipe(takeUntil(this.destroyed$));
    this.gstNotFoundOnPortalData$ = this.store.select(p => p.gstReconcile.gstReconcileData.notFoundOnPortal).pipe(takeUntil(this.destroyed$));
    this.gstMatchedData$ = this.store.select(p => p.gstReconcile.gstReconcileData.matched).pipe(takeUntil(this.destroyed$));
    this.gstPartiallyMatchedData$ = this.store.select(p => p.gstReconcile.gstReconcileData.partiallyMatched).pipe(takeUntil(this.destroyed$));
    this.pullFromGstInProgress$ = this.store.select(p => p.gstReconcile.isPullFromGstInProgress).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';

    this.fireGstReconcileRequest('NOT_ON_PORTAL');
  }

  public reconcileTabChanged(action: string) {
    this.reconcileActiveTab = action;
    this.fireGstReconcileRequest(action);
  }

  public reconcilePageChanged(event: any, action: string) {
    this.fireGstReconcileRequest(action, event.page);
  }
  public fireGstReconcileRequest(action: string, page: number = 1, refresh: boolean = false) {
    if (!this.currentPeriod) {
      return;
    }
    let period = this.currentPeriod;
    this.store.dispatch(this._reconcileActions.GstReconcileInvoiceRequest(
      period, action, page.toString(), refresh)
    );
  }

  public loadReconcilePaginationComponent(s: ReconcileActionState, action: string) {
    if (s.count === 0) {
      return;
    }

    if (action !== this.reconcileActiveTab) {
      return;
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
    let viewContainerRef = null;
    switch (this.reconcileActiveTab) {
      case 'NOT_ON_GIDDH':
        viewContainerRef = this.pgGstNotFoundOnGiddh.viewContainerRef;
        break;
      case 'NOT_ON_PORTAL':
        viewContainerRef = this.pgGstNotFoundOnPortal.viewContainerRef;
        break;
      case 'MATCHED':
        viewContainerRef = this.pgMatched.viewContainerRef;
        break;
      case 'PARTIALLY_MATCHED':
        viewContainerRef = this.pgPartiallyMatched.viewContainerRef;
        break;
    }

    viewContainerRef.remove();
    let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
    viewContainerRef.insert(componentInstanceView.hostView);

    let componentInstance = componentInstanceView.instance as PaginationComponent;

    componentInstance.totalItems = s.data.totalItems;
    componentInstance.itemsPerPage = s.data.count;
    componentInstance.maxSize = 5;
    componentInstance.writeValue(s.data.page);
    componentInstance.boundaryLinks = true;
    componentInstance.pageChanged.subscribe(e => {
      this.reconcilePageChanged(e, this.reconcileActiveTab);
    });
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

 }
