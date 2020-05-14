import { takeUntil, count, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SubscriptionsActions } from '../../../actions/userSubscriptions/subscriptions.action';
import { SubscriptionsUser, CompaniesWithTransaction, UserDetails } from '../../../models/api-models/Subscriptions';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { CompanyResponse, SubscriptionRequest, CreateCompanyUsersPlan } from '../../../models/api-models/Company';
import { GeneralService } from '../../../services/general.service';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { CompanyActions } from '../../../actions/company.actions';
import { GIDDH_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'subscriptions',
    styleUrls: ['./subscriptions.component.scss'],
    templateUrl: './subscriptions.component.html'
})

export class SubscriptionsComponent implements OnInit, AfterViewInit, OnDestroy {
    public subscriptions: SubscriptionsUser[] = [];
    public subscriptions$: Observable<SubscriptionsUser[]>;
    public seletedUserPlans: SubscriptionsUser;
    public selectedPlanCompanies: CompaniesWithTransaction[];
    public isPlanShow: boolean = false;
    public searchString = '';
    public transactions: any;
    public companies: any;
    public companyTransactions: any;
    public moment = moment;
    public modalRef: BsModalRef;
    public message: BsModalRef;
    public isLoading: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeCompanyUniqueName$: Observable<string>;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompany: any = {};
    public currentCompanyPlan: any = '';
    public activityLogAsideMenuState: string = 'out';
    public companyDetailsAsideMenuState: string = 'out';
    public subscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    public loggedInUser: UserDetails;
    public subscriptionPlan: CreateCompanyUsersPlan;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    public subscriptionDates: any = { startedAt: '', expiry: '' };
    public companyListForFilter: CompanyResponse[] = [];

    constructor(private store: Store<AppState>, private _subscriptionsActions: SubscriptionsActions, private modalService: BsModalService, private _route: Router, private activeRoute: ActivatedRoute, private subscriptionService: SubscriptionsService, private generalService: GeneralService, private settingsProfileActions: SettingsProfileActions, private companyActions: CompanyActions) {
        this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
        this.subscriptions$ = this.store.pipe(select(s => s.subscriptions.subscriptions), takeUntil(this.destroyed$));
        this.companies$ = this.store.select(cmp => cmp.session.companies).pipe(takeUntil(this.destroyed$));
        this.activeCompanyUniqueName$ = this.store.pipe(select(cmp => cmp.session.companyUniqueName), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this.generalService.user) {
            this.loggedInUser = this.generalService.user;
        }

        this.companies$.subscribe(companies => {
            if (companies) {
                let orderedCompanies = _.orderBy(companies, 'name');
                this.companyListForFilter = orderedCompanies;
                this.activeCompanyUniqueName$.pipe(take(1)).subscribe(active => {
                    this.activeCompany = companies.find(cmp => cmp.uniqueName === active);
                    this.showCurrentCompanyPlan();
                });
            }
        });

        this.isPlanShow = false;
        this.subscriptionService.getSubScribedCompanies().subscribe((res) => {
            this.isLoading = false;

            if (res && res.status === "success") {
                if (!res.body || !res.body[0]) {
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

    // public filterCompanyList(ev) {
    //     let companies: CompaniesWithTransaction[] = [];
    //     companies = this.seletedUserPlans.companiesWithTransactions;
    //     let filterd = companies.filter((cmp) => {
    //         return cmp.name.toLowerCase().includes(ev.toLowerCase());
    //     });
    //     this.selectedPlanCompanies = filterd;
    // }

    /**
     * This function will set the current company plan
     *
     * @memberof SubscriptionsComponent
     */
    public showCurrentCompanyPlan() {
        if (this.activeCompany && this.subscriptions) {
            let planMatched = false;
            this.subscriptions.forEach(key => {
                if (this.activeCompany.subscription && key.subscriptionId === this.activeCompany.subscription.subscriptionId) {
                    planMatched = true;
                    this.seletedUserPlans = key;
                    if (this.seletedUserPlans && this.seletedUserPlans.companiesWithTransactions) {
                        this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
                    }
                }
            });

            if (!planMatched) {
                this.seletedUserPlans = this.subscriptions[0];
                if (this.seletedUserPlans && this.seletedUserPlans.companiesWithTransactions) {
                    this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
                }
            }
        }

        if (this.seletedUserPlans) {
            if (this.seletedUserPlans.startedAt) {
                this.subscriptionDates.startedAt = moment(this.seletedUserPlans.startedAt.split("-").reverse().join("-"));
            }
            if (this.seletedUserPlans.expiry) {
                this.subscriptionDates.expiry = moment(this.seletedUserPlans.expiry.split("-").reverse().join("-"));
            }
        }
        console.log(this.subscriptions);
        console.log(this.seletedUserPlans);
    }

    public toggleActivityLogAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.activityLogAsideMenuState = this.activityLogAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleCompanyDetailsAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.companyDetailsAsideMenuState = this.companyDetailsAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.activityLogAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }

        if (this.companyDetailsAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public openModal(MoveCompany: TemplateRef<any>) {
        this.modalRef = this.modalService.show(MoveCompany);
    }

    public openModalMove(deactivateCompany: TemplateRef<any>) {
        this.modalRef = this.modalService.show(deactivateCompany);
    }

    public renewPlan(): void {
        if (this.seletedUserPlans && this.seletedUserPlans.planDetails && this.seletedUserPlans.planDetails.amount > 0) {

            this.subscriptionPlan = {
                companies: this.seletedUserPlans.companies,
                totalCompanies: this.seletedUserPlans.totalCompanies,
                userDetails: {
                    name: this.seletedUserPlans.userDetails.name,
                    uniqueName: this.seletedUserPlans.userDetails.uniqueName,
                    email: this.seletedUserPlans.userDetails.email,
                    signUpOn: this.seletedUserPlans.userDetails.signUpOn,
                    mobileno: this.seletedUserPlans.userDetails.mobileno
                },
                additionalTransactions: this.seletedUserPlans.additionalTransactions,
                createdAt: this.seletedUserPlans.createdAt,
                planDetails: this.seletedUserPlans.planDetails,
                additionalCharges: this.seletedUserPlans.additionalCharges,
                status: this.seletedUserPlans.status,
                subscriptionId: this.seletedUserPlans.subscriptionId,
                balance: this.seletedUserPlans.balance,
                expiry: this.seletedUserPlans.expiry,
                startedAt: this.seletedUserPlans.startedAt,
                companiesWithTransactions: this.seletedUserPlans.companiesWithTransactions,
                companyTotalTransactions: this.seletedUserPlans.companyTotalTransactions,
                totalTransactions: this.seletedUserPlans.totalTransactions
            };

            this._route.navigate(['billing-detail', 'buy-plan']);
            this.store.dispatch(this.companyActions.selectedPlan(this.subscriptionPlan));
        } else {
            this.subscriptionRequestObj.userUniqueName = this.loggedInUser.uniqueName;
            if (this.seletedUserPlans.subscriptionId) {
                this.subscriptionRequestObj.subscriptionId = this.seletedUserPlans.subscriptionId;
                this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true });
            } else if (!this.seletedUserPlans.subscriptionId) {
                this.subscriptionRequestObj.planUniqueName = this.seletedUserPlans.planDetails.uniqueName;
                this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true });
            }
        }
    }

    public patchProfile(obj): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    }

    public formatDate(date: string): moment.Moment {
        return moment(date.split("-").reverse().join("-"));
    }

    public calculateRemainingDays(expiry: string): any {
        if (expiry) {
            let currentDate = moment();
            let expiryDate = moment(expiry.split("-").reverse().join("-"));
            return expiryDate.diff(currentDate, 'days');
        } else {
            return "-";
        }
    }

    public filterCompanyList(event) {
        let companies: CompanyResponse[] = [];
        this.companies$.pipe(take(1)).subscribe(cmps => companies = cmps);

        this.companyListForFilter = companies.filter((cmp) => {
            if (!cmp.nameAlias) {
                return cmp.name.toLowerCase().includes(event.toLowerCase());
            } else {
                return cmp.name.toLowerCase().includes(event.toLowerCase()) || cmp.nameAlias.toLowerCase().includes(event.toLowerCase());
            }
        });
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
