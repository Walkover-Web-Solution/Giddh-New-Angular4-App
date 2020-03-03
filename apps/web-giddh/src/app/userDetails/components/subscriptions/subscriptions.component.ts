import { takeUntil, count, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SubscriptionsActions } from '../../../actions/userSubscriptions/subscriptions.action';
import { SubscriptionsUser, CompaniesWithTransaction } from '../../../models/api-models/Subscriptions';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { CompanyResponse } from '../../../models/api-models/Company';

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
    public isLoading: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeCompanyUniqueName$: Observable<string>;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompany: any = {};
    public currentCompanyPlan: any = '';

    constructor(private store: Store<AppState>,
        private _subscriptionsActions: SubscriptionsActions,
        private modalService: BsModalService, private _route: Router, private activeRoute: ActivatedRoute, private subscriptionService: SubscriptionsService) {
        
        this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
        this.subscriptions$ = this.store.pipe(select(s => s.subscriptions.subscriptions), takeUntil(this.destroyed$));
        this.companies$ = this.store.select(cmp => cmp.session.companies).pipe(takeUntil(this.destroyed$));
        this.activeCompanyUniqueName$ = this.store.pipe(select(cmp => cmp.session.companyUniqueName), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.companies$.subscribe(company => {
            if (company) {
                this.activeCompanyUniqueName$.pipe(take(1)).subscribe(active => {
                    this.activeCompany = company.find(cmp => cmp.uniqueName === active);
                    this.showCurrentCompanyPlan();
                });
            }
        });
        
        this.isPlanShow = false;
        this.subscriptionService.getSubScribedCompanies().subscribe((res) => {
            this.isLoading = false;

            if(res && res.status === "success") {
                if(!res.body || !res.body[0]) {
                    this.isPlanShow = true;
                }
            } else {
                this.isPlanShow = true;
            }
        });

        this.subscriptions$.subscribe(userSubscriptions => {
            this.subscriptions = userSubscriptions;
            this.showCurrentCompanyPlan();
        });

        this.activeRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val.showPlans) {
                this.isPlanShow = true;
            }
        });
    }

    public ngAfterViewInit() {
        this.showCurrentCompanyPlan();
    }

    public goToBillingDetails() {
        this._route.navigate(['billing-detail', 'buy-plan']);
    }

    public selectedSubscriptionPlan(subscription: SubscriptionsUser) {
        if (subscription) {
            this.seletedUserPlans = subscription;
            if (this.seletedUserPlans && this.seletedUserPlans.companiesWithTransactions) {
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

    /**
     * This function will set the current company plan
     *
     * @memberof SubscriptionsComponent
     */
    public showCurrentCompanyPlan() {
        if(this.activeCompany && this.subscriptions) {
            let planMatched = false;
            this.subscriptions.forEach(key => {
                if(this.activeCompany.subscription && key.subscriptionId === this.activeCompany.subscription.subscriptionId) {
                    planMatched = true;
                    this.seletedUserPlans = key;
                    if (this.seletedUserPlans && this.seletedUserPlans.companiesWithTransactions) {
                        this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
                    }
                }
            });

            if(!planMatched) {
                this.seletedUserPlans = this.subscriptions[0];
                if (this.seletedUserPlans && this.seletedUserPlans.companiesWithTransactions) {
                    this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
                }
            }
        }
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
