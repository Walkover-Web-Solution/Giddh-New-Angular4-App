import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SubscriptionsActions } from '../../../actions/userSubscriptions/subscriptions.action';
import { CompaniesWithTransaction, SubscriptionsUser } from '../../../models/api-models/Subscriptions';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'subscriptions',
    styleUrls: ['./subscriptions.component.css'],
    templateUrl: './subscriptions.component.html'
})

export class SubscriptionsComponent implements OnInit, AfterViewInit, OnDestroy {
    public subscriptions: SubscriptionsUser[] = [];
    public subscriptions$: Observable<SubscriptionsUser[]>;
    public seletedUserPlans: SubscriptionsUser;
    public selectedPlanCompanies: CompaniesWithTransaction[];
    public isPlanShow: boolean = false;
    public srchString = '';
    public transactions: any;
    public companies: any;
    public companyTransactions: any;
    public moment = moment;
    public modalRef: BsModalRef;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>,
                private _subscriptionsActions: SubscriptionsActions,
                private modalService: BsModalService, private _route: Router, private activeRoute: ActivatedRoute) {

        this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
        this.subscriptions$ = this.store.select(s => s.subscriptions.subscriptions)
            .pipe(takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        // this.getSubscriptionList();

        this.subscriptions$.subscribe(userSubscriptions => {
            this.subscriptions = userSubscriptions;

            if (this.subscriptions.length > 0) {
                this.seletedUserPlans = this.subscriptions[0];
                if (this.seletedUserPlans.companiesWithTransactions) {
                    this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
                }
            }
        });
        this.activeRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val.isPlanPage) {
                this.isPlanShow = true;
            }
        });

    }

    public ngAfterViewInit() {
        if (this.subscriptions.length > 0) {
            this.seletedUserPlans = this.subscriptions[0];
            if (this.seletedUserPlans.companiesWithTransactions) {
                this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
            }
        }
    }

    public GoToBillingDetails() {
        this._route.navigate(['billing-detail', 'buy-plan']);
    }

    public selectedSubscriptionPlan(subsciption: SubscriptionsUser) {
        if (subsciption) {
            this.seletedUserPlans = subsciption;
            if (this.seletedUserPlans.companiesWithTransactions) {
                this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
            }
        }
    }

    public isSubscriptionPlanShow(event: any) {
        if (event) {
            this.isPlanShow = !event;
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public filterCompanyList(ev) {
        let companies: CompaniesWithTransaction[] = [];
        companies = this.seletedUserPlans.companiesWithTransactions;
        let filterd = companies.filter((cmp) => {
            return cmp.name.toLowerCase().includes(ev.toLowerCase());
        });
        this.selectedPlanCompanies = filterd;
    }

    // public getSubscriptionList() {
    //   this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
    //   this.store.select(s =>  s.subscriptions.subscriptions)
    //     .pipe(takeUntil(this.destroyed$))
    //     .subscribe(s => {
    //       if (s && s.length) {
    //         this.subscriptions = s;
    //         this.store.dispatch(this._subscriptionsActions.SubscribedCompaniesList(s && s[0]));
    //         this.store.dispatch(this._subscriptionsActions.SubscribedUserTransactions(s && s[0]));
    //         this.store.select(s =>  s.subscriptions.transactions)
    //           .pipe(takeUntil(this.destroyed$))
    //           .subscribe(s => this.transactions = s);
    //       }
    //     });
    // }

    // public getCompanyTransactions(companyName) {
    //   if (this.subscriptions && this.subscriptions.length) {
    //     this.store.dispatch(this._subscriptionsActions.SubscribedCompanyTransactions(this.subscriptions && this.subscriptions[0], companyName));
    //   }
    // }

    // public openModal(template: TemplateRef<any>, company, subscription) {
    //    this.getCompanyTransactions(company.uniqueName);
    //   this.modalRef = this.modalService.show(
    //     template,
    //     Object.assign({}, { class: 'subscription_modal' })
    //   );
    //   let cont = {
    //     subscription,
    //     company
    //   }
    //   this.modalRef.content = cont;
    // }

}
