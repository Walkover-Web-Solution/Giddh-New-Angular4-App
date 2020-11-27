import { takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, AfterViewInit, TemplateRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SubscriptionsActions } from '../../../actions/userSubscriptions/subscriptions.action';
import { SubscriptionsUser, CompaniesWithTransaction, UserDetails } from '../../../models/api-models/Subscriptions';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { CompanyResponse, SubscriptionRequest, CreateCompanyUsersPlan } from '../../../models/api-models/Company';
import { GeneralService } from '../../../services/general.service';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { CompanyActions } from '../../../actions/company.actions';
import { GIDDH_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { DEFAULT_SIGNUP_TRIAL_PLAN } from '../../../app.constant';

@Component({
    selector: 'subscriptions',
    styleUrls: ['./subscriptions.component.scss'],
    templateUrl: './subscriptions.component.html'
})

export class SubscriptionsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChild('addCompanyNewModal', {static: true}) public addCompanyNewModal: ModalDirective;
    @ViewChild('companynewadd', {static: true}) public companynewadd: ElementViewContainerRef;

    /* This will have active tab value */
    @Input() public activeTab: string = '';

    public subscriptions: SubscriptionsUser[] = [];
    public allSubscriptions: SubscriptionsUser[] = [];
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
    public searchSubscribedPlan: any;
    public showSubscribedPlansList: boolean = false;
    public selectedCompany: any;
    public allAssociatedCompanies: CompanyResponse[] = [];
    /* This will contain the plan unique name of default trial plan */
    public defaultTrialPlan: string = DEFAULT_SIGNUP_TRIAL_PLAN;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

    constructor(private store: Store<AppState>, private _subscriptionsActions: SubscriptionsActions, private modalService: BsModalService, private _route: Router, private activeRoute: ActivatedRoute, private subscriptionService: SubscriptionsService, private generalService: GeneralService, private settingsProfileActions: SettingsProfileActions, private companyActions: CompanyActions) {
        this.subscriptions$ = this.store.pipe(select(s => s.subscriptions.subscriptions), takeUntil(this.destroyed$));
        this.companies$ = this.store.pipe(select(cmp => cmp.session.companies), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this.generalService.user) {
            this.loggedInUser = this.generalService.user;
        }

        this.store.pipe(select(state => state.company && state.company.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if(activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        this.companies$.subscribe(companies => {
            if (companies) {
                let orderedCompanies = _.orderBy(companies, 'name');
                let filteredCompanies = [];

                orderedCompanies.forEach((company) => {
                    if (company.showOnSubscription) {
                        filteredCompanies.push(company);
                    }
                });

                this.allAssociatedCompanies = filteredCompanies;
                this.companyListForFilter = filteredCompanies;

                this.store.pipe(select(state => state.company && state.company.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
                    if(activeCompany) {
                        this.sortAssociatedCompanies();
                        this.showCurrentCompanyPlan();
                    }
                });
            }
        });

        this.isPlanShow = false;
        this.subscriptionService.getSubScribedCompanies().subscribe((res) => {
            if (res && res.status === "success") {
                if (!res.body || !res.body[0]) {
                    this.isPlanShow = true;
                    this.isLoading = false;
                } else {
                    this.store.dispatch(this._subscriptionsActions.SubscribedCompaniesResponse(res));
                }
            } else {
                this.isPlanShow = true;
                this.isLoading = false;
            }
        });

        this.subscriptions$.subscribe(userSubscriptions => {
            if(userSubscriptions && userSubscriptions.length > 0) {
                userSubscriptions.forEach(userSubscription => {
                    if(userSubscription.createdAt) {
                        userSubscription.createdAt = moment(userSubscription.createdAt, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                    }

                    this.subscriptions.push(userSubscription);
                    this.allSubscriptions.push(userSubscription);
                });
                this.isLoading = false;
            }
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

    /**
     * Hook to detect input directive changes
     *
     * @param {SimpleChanges} changes
     * @memberof SubscriptionsComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.activeTab = changes.activeTab.currentValue;
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
    }

    /**
     * This will open the activity log popup
     *
     * @param {*} [event]
     * @memberof SubscriptionsComponent
     */
    public toggleActivityLogAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.activityLogAsideMenuState = this.activityLogAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * This will toggle the company details popup
     *
     * @param {*} company
     * @memberof SubscriptionsComponent
     */
    public toggleCompanyDetailsAsidePane(company): void {
        this.selectedCompany = company;
        this.companyDetailsAsideMenuState = this.companyDetailsAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * This will toggle the class in body
     *
     * @memberof SubscriptionsComponent
     */
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

    /**
     * This will open the deactive company popup
     *
     * @param {TemplateRef<any>} MoveCompany
     * @memberof SubscriptionsComponent
     */
    public openModal(MoveCompany: TemplateRef<any>) {
        this.modalRef = this.modalService.show(MoveCompany);
    }

    /**
     * This will open the add company popup
     *
     * @param {TemplateRef<any>} AddCompany
     * @memberof SubscriptionsComponent
     */
    public openAddCompanyModal(AddCompany: TemplateRef<any>) {
        this.modalRef = this.modalService.show(AddCompany);
    }

    /**
     * This will open the move company popup
     *
     * @param {TemplateRef<any>} deactivateCompany
     * @param {*} company
     * @memberof SubscriptionsComponent
     */
    public openModalMove(deactivateCompany: TemplateRef<any>, company: any) {
        this.selectedCompany = company;
        this.modalRef = this.modalService.show(deactivateCompany);
    }

    /**
     * This will renew the subscription automatically
     *
     * @memberof SubscriptionsComponent
     */
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

    /**
     * This will update the profile
     *
     * @param {*} obj
     * @memberof SubscriptionsComponent
     */
    public patchProfile(obj): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    }

    /**
     * This will format the date and will convert to moment
     *
     * @param {string} date
     * @returns {moment.Moment}
     * @memberof SubscriptionsComponent
     */
    public formatDate(date: string): moment.Moment {
        return moment(date.split("-").reverse().join("-"));
    }

    /**
     * This will calculate the remaining days in plan
     *
     * @param {string} expiry
     * @returns {string}
     * @memberof SubscriptionsComponent
     */
    public calculateRemainingDays(expiry: string): string {
        if (expiry) {
            let currentDate = moment();
            let expiryDate = moment(expiry.split("-").reverse().join("-"));
            let difference = expiryDate.diff(currentDate, 'days');
            return (difference <= 15) ? difference + " days remaining" : "Active"
        } else {
            return "-";
        }
    }

    /**
     * This will filter the companies list
     *
     * @param {*} term
     * @memberof SubscriptionsComponent
     */
    public filterCompanyList(term): void {
        this.companyListForFilter = [];
        this.allAssociatedCompanies.forEach((company) => {
            if (company.showOnSubscription && company.name.toLowerCase().includes(term.toLowerCase())) {
                this.companyListForFilter.push(company);
            }
        });

        this.sortAssociatedCompanies();
    }

    /**
     * This will search the subscribed plans
     *
     * @param {*} event
     * @memberof SubscriptionsComponent
     */
    public searchPlan(event): void {
        this.subscriptions = [];

        this.allSubscriptions.forEach(item => {
            if (item.planDetails && item.planDetails.name && item.planDetails.name.toLowerCase().includes(event.toLowerCase())) {
                this.subscriptions.push(item);
            }
        });
    }

    /**
     * This function will refresh the subscribed companies if move company was succesful and will close the popup
     *
     * @param {*} event
     * @memberof SubscriptionsComponent
     */
    public addOrMoveCompanyCallback(event): void {
        if (event === true) {
            this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
        }
        this.modalRef.hide();
    }

    /**
     * This will sort the associated companies and will put the current company on top
     *
     * @memberof SubscriptionsComponent
     */
    public sortAssociatedCompanies(): void {
        if(this.companyListForFilter && this.companyListForFilter.length > 0) {
            let companyListForFilter = _.orderBy(this.companyListForFilter, 'name');

            let loop = 0;
            let activeCompanyIndex = -1;
            companyListForFilter.forEach(company => {
                if (this.activeCompany && this.activeCompany.uniqueName === company.uniqueName) {
                    activeCompanyIndex = loop;
                }
                loop++;
            });

            this.companyListForFilter = this.generalService.changeElementPositionInArray(companyListForFilter, activeCompanyIndex, 0);
        }
    }

    /**
     * This will free the data stored in selectedCompany variable on close of company details popup
     *
     * @param {*} event
     * @memberof SubscriptionsComponent
     */
    public hideCompanyDetails(event) {
        this.selectedCompany = {};
    }

    // public getSubscriptionList() {
    //   this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
    //   this.store.pipe(select(s =>  s.subscriptions.subscriptions), takeUntil(this.destroyed$))
    //     .subscribe(s => {
    //       if (s && s.length) {
    //         this.subscriptions = s;
    //         this.store.dispatch(this._subscriptionsActions.SubscribedCompaniesList(s && s[0]));
    //         this.store.dispatch(this._subscriptionsActions.SubscribedUserTransactions(s && s[0]));
    //         this.store.pipe(select(s =>  s.subscriptions.transactions), takeUntil(this.destroyed$))
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
