import { DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CompanyActions } from "../../../actions/company.actions";
import { SettingsProfileActions } from "../../../actions/settings/profile/settings.profile.action";
import { SubscriptionsActions } from "../../../actions/userSubscriptions/subscriptions.action";
import { uniqBy } from "../../../lodash-optimized";
import { SubscriptionsUser } from "../../../models/api-models/Subscriptions";
import { GeneralService } from "../../../services/general.service";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { AppState } from "../../../store";
import * as moment from 'moment';
import { FormControl } from "@angular/forms";

@Component({
    selector: "subscription",
    templateUrl: "./subscription.component.html",
    styleUrls: ["./subscription.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionComponent implements OnInit, OnChanges, OnDestroy {
    /** This will have active tab value */
    @Input() public activeTab: string = '';
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public subscriptions: SubscriptionsUser[] = [];
    public subscriptions$: Observable<SubscriptionsUser[]>;
    public selectedSubscription: any;
    public plansList: any[] = [];
    public expiringList: any[] = [
        { name: '7 Days', value: 7 },
        { name: '15 Days', value: 15 },
        { name: '1 Month', value: 31 },
        { name: '6 Months', value: 180 },
        { name: '1 Year', value: 365 }
    ];
    public transactionBalanceList: any[] = [
        { name: 'Less than 1,000', value: 1000 },
        { name: 'Less than 5,000', value: 5000 },
        { name: 'Less than 10,000', value: 10000 },
        { name: 'Less than 50,000', value: 50000 }
    ];
    public filters: any = { plan: '', expiration: '', transactionBalance: '' };
    /** Control for the Search plan and companies field */
    public searchSubscription: FormControl = new FormControl();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private subscriptionsActions: SubscriptionsActions,
        private route: Router,
        private activeRoute: ActivatedRoute,
        private subscriptionService: SubscriptionsService,
        private generalService: GeneralService,
        private settingsProfileActions: SettingsProfileActions,
        private companyActions: CompanyActions,
        private decimalPipe: DecimalPipe,
        private changeDetectionRef: ChangeDetectorRef
    ) {
        this.subscriptions$ = this.store.pipe(select(state => state.subscriptions.subscriptions), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        this.subscriptionService.getSubScribedCompanies().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === "success" && res?.body) {
                this.store.dispatch(this.subscriptionsActions.SubscribedCompaniesResponse(res));
            }
        });

        this.subscriptions$.subscribe(response => {
            if (response) {
                this.subscriptions = response.map(subscription => {
                    subscription.remainingDays = Number(moment(subscription.expiry, GIDDH_DATE_FORMAT).diff(moment(), 'days'));
                    subscription.startedAt = moment(subscription.startedAt, GIDDH_DATE_FORMAT).format("D MMM, y");
                    subscription.expiry = moment(subscription.expiry, GIDDH_DATE_FORMAT).format("D MMM, y");
                    return subscription;
                });
                this.plansList = uniqBy(response.map(subscription => { return { name: subscription.planDetails?.name, uniqueName: subscription.planDetails?.uniqueName } }), "uniqueName");
                this.changeDetectionRef.detectChanges();
            }
        });

        // listen for search field value changes
        this.searchSubscription.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.filterSubscriptions();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {

    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectSubscription(subscription: any): void {
        this.selectedSubscription = subscription;
    }

    public filterSubscriptions(): void {
        let subscriptions = [];
        this.subscriptions = [];
        this.subscriptions$.subscribe(response => {
            if (response) {
                response.forEach(subscription => {
                    let flag = true;
                    if (
                        (this.searchSubscription?.value && subscription?.planDetails?.name?.toLowerCase()?.indexOf(this.searchSubscription?.value?.toLowerCase()) === -1 && subscription?.subscriptionId?.toLowerCase()?.indexOf(this.searchSubscription?.value?.toLowerCase()) === -1) ||
                        (this.filters?.plan && subscription?.planDetails?.uniqueName !== this.filters?.plan) ||
                        (this.filters?.expiration && (subscription?.remainingDays < 0 || subscription?.remainingDays > this.filters?.expiration)) ||
                        (this.filters?.transactionBalance && (subscription?.planDetails?.transactionLimit < 0 || subscription?.planDetails?.transactionLimit > this.filters?.transactionBalance))
                    ) {
                        flag = false;
                    }

                    if (flag) {
                        subscriptions.push(subscription);
                    }
                });
                this.subscriptions = subscriptions;
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    public clearFilters(): void {
        this.searchSubscription = new FormControl();
        this.filters.plan = '';
        this.filters.expiration = '';
        this.filters.transactionBalance = '';
        this.filterSubscriptions();
    }
}