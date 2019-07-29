import { auditTime, delay, take, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, ReplaySubject } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  styles: [`
      .invoice-bg {
          padding-top: 15px;
      }

      .invoce-controll ::ng-deep.nav > li > a {
          padding: 2px 0px !important;
          margin-right: 25px !important;
      }

      .invoce-controll ::ng-deep.nav-tabs > li.active > a {
          border-bottom: 2px solid #ff5f00 !important;
      }

      .invoce-controll ::ng-deep.nav > li > a {
          border-bottom: 2px solid transparent !important;
      }

      .invoce-controll ::ng-deep.nav.nav-tabs {
          margin-bottom: 28px;
          padding: 10px 0px 0 15px !important;
          /* margin-right: -15px; */
          /*margin-left: -15px; */
      }

      /*.invoice-nav.navbar-nav > li > a {*/
      /*padding: 6px 30px;*/
      /*font-size: 14px;*/
      /*color: #333;*/
      /*background-color: #e6e6e6*/
      /*}*/

      .invoce-controll .invoice-nav.navbar-nav > li > a:hover {
          background-color: #ff5f00;
          color: #fff;
      }

      .invoce-controll .invoice-nav.navbar-nav > li > a.active {
          background-color: #fff;
          color: #ff5f00;
      }

      .navbar {
          min-height: auto;
          margin-bottom: 10px;
      }

    /*.debit-note ::ng-deep.table.basic.table-bordered.mrT2,::ng-deep.no-data{*/
    /*width: 65%;*/
    /*}*/

    @media(max-width:500px){
      .invoce-controll ::ng-deep.nav.nav-tabs{
         margin-bottom: 28px;
      padding: 10px 0px 0 0 !important;
      border-bottom: 1px solid #ddd;
    overflow-x: auto;
    white-space: nowrap;
    display: inline-block;
    width: 100%;
    overflow-y: hidden;
    cursor: pointer !important;
    }

    .invoce-controll ::ng-deep.nav-tabs>li {
      display: inline-block;
    }

  `],
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit, OnDestroy {
  public isRecurringSelected: boolean = false;
  public showInvoiceNav: boolean = false;
  public selectedVoucherType: string = '';
  public activeTab: string;
  @ViewChild('staticTabs') public staticTabs: TabsetComponent;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
              private companyActions: CompanyActions,
              private router: Router,
              private _cd: ChangeDetectorRef, private _activatedRoute: ActivatedRoute) {
    //
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'invoice';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

    combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams])
      .pipe(auditTime(700))
      .subscribe(result => {
        let params = result[0];
        let queryParams = result[1];

        if (params) {
          this.selectedVoucherType = params.voucherType;
          if (queryParams) {
            if (queryParams.tab && queryParams.tabIndex) {
              if (this.staticTabs && this.staticTabs.tabs) {
                // this.staticTabs.tabs[queryParams.tabIndex].active = true;
                this.tabChanged(queryParams.tab);
              }
            }
          } else {
            if (params.voucherType === 'sales') {
              this.activeTab = 'invoice';
            } else {
              this.activeTab = params.voucherType;
            }
          }
        }
      });

    // this._activatedRoute.params.pipe(takeUntil(this.destroyed$), delay(700)).subscribe(a => {
    //   if (!a) {
    //     return;
    //   }
    //   if (a.voucherType === 'recurring') {
    //     return;
    //   }
    //   this.selectedVoucherType = a.voucherType;
    //   if (a.voucherType === 'sales') {
    //     this.activeTab = 'invoice';
    //   } else {
    //     this.activeTab = a.voucherType;
    //   }
    // });
    //
    // this._activatedRoute.queryParams.pipe(takeUntil(this.destroyed$), delay(700)).subscribe(a => {
    //   if (a.tab && a.tabIndex) {
    //     if (this.staticTabs && this.staticTabs.tabs) {
    //       this.staticTabs.tabs[a.tabIndex].active = true;
    //       this.tabChanged(a.tab);
    //     }
    //   }
    // });
  }

  public pageChanged(page: string) {
    this.showInvoiceNav = ['generate', 'preview', 'templates', 'settings', 'credit note', 'debit note', 'sales'].indexOf(page) > -1;
    // this._cd.detectChanges();
    // this.showInvoiceNav = page === 'preview';
  }

  public goToRoute(path: string) {
    this.pageChanged(path);
    if (path === 'recurring') {
      this.router.navigateByUrl('pages/invoice/' + path);
    } else {
      this.router.navigateByUrl('pages/invoice/preview/' + path);
    }
  }

  public voucherChanged(tab: string) {
    this.selectedVoucherType = tab;
    // this.goToRoute(tab);
  }

  public tabChanged(tab: string) {
    this.activeTab = tab;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
