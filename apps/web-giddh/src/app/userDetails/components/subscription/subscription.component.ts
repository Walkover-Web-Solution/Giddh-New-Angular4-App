import { Component, OnInit, ViewChild, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, SimpleChanges, OnChanges, TemplateRef } from "@angular/core";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { MatAccordion } from "@angular/material/expansion";
import { MatDialog } from "@angular/material/dialog";
import { SubscriptionsActions } from '../../../actions/userSubscriptions/subscriptions.action';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SubscriptionsUser } from "../../../models/api-models/Subscriptions";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SubscriptionsService } from "../../../services/subscriptions.service";
import { uniqBy } from "../../../lodash-optimized";
import * as moment from "moment";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";


export interface PeriodicElement {
    consumed: number;
    balance: number;
    dues: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { consumed: 2000, balance: 8000, dues: '₹500' },
    { consumed: 6, balance: 14, dues: '₹4,000' },
    { consumed: 6, balance: 14, dues: '₹2,000' },
];

@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SubscriptionComponent implements OnInit, OnDestroy, OnChanges {

    // This will change the search bar height dynamically
    public menuBarHeight: Number = 40;
    public menuOneWidth: Number;
    public menuTwoWidth: Number;
    // This will change the rowspan of main content and oak plan list dynamically
    public sideBarBoxLength: Number = 15;
    public sideBarBoxWidth: Number;
    public mainContentWidth: Number;
    // This will change the height of oak plan list dynamically
    public rowLength: Number = 180;
    // This will change the length of overall summary box dynamically
    public overallSummaryTopRow: Number = 6;
    public overallSummaryBottomRow: Number = 4;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    // This will use for companies list in accordian
    @ViewChild(MatAccordion) accordion: MatAccordion;
    // This will use for move company to another company
    @ViewChild("moveCompany", { static: false }) public moveCompany: any;
    public modalRef: BsModalRef;
    // This will store the subscriptions in blank array
    public subscriptions: SubscriptionsUser[] = [];
    // This will get the subscriptions data 
    public subscriptions$: Observable<SubscriptionsUser[]>;
    // This will selected the subscriptions data 
    public selectedSubscription: any;
    // This will hold the plan list data by unique name 
    public plansList: any[] = [];
    //This will select the company
    public selectedCompany: any;
    // This will show the plan 
    public isPlanShow: boolean = false;
    // This will search the subscriptions and plans in subscription list 
    public searchSubscription: FormControl = new FormControl();
    /** To destroy observers */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public showLoader: boolean = false;
    public imgPath: string = '';
    // This will filter the plan dropdwon , expiry dropdown and transaction balance dropdown in subscription list 
    public filters: any = { plan: '', expiration: '', transactionBalance: '' };

    // This will store the static data in expiry list 
    public expiringList: any[] = [
        { name: '7 Days', value: 7 },
        { name: '15 Days', value: 15 },
        { name: '1 Month', value: 31 },
        { name: '6 Months', value: 180 },
        { name: '1 Year', value: 365 }
    ];

    // This will store the static data in transaction balance list 
    public transactionBalanceList: any[] = [
        { name: 'Less than 1,000', value: 1000 },
        { name: 'Less than 5,000', value: 5000 },
        { name: 'Less than 10,000', value: 10000 },
        { name: 'Less than 50,000', value: 50000 }
    ];



    constructor(
        public dialog: MatDialog,
        public breakpointObserver:
            BreakpointObserver,
        private subscriptionsActions: SubscriptionsActions,
        private store: Store<AppState>,
        private subscriptionService: SubscriptionsService,
        private modalService: BsModalService,
        private changeDetectionRef: ChangeDetectorRef) {

        this.subscriptions$ = this.store.pipe(select(state => state.subscriptions.subscriptions), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {

        this.getCompanies();
        // This subscription subscribes and get the response
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

        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.breakpointObserver.observe([
            '(min-width: 768px)',
            '(min-width: 1024px)',
            '(min-width: 1536px)'
        ]).subscribe((state: BreakpointState) => {

            if (state.breakpoints['(min-width: 768px)']) {
                this.rowLength = 120;
                //         this.menuBarHeight = 5.5;
                //         this.sideBarBoxLength = 13;
                this.sideBarBoxWidth = 5;
                this.mainContentWidth = 11;
                this.menuOneWidth = 5;
                this.menuTwoWidth = 11;
            }
            if (state.breakpoints['(min-width: 1024px)']) {
                this.rowLength = 120;
                this.menuBarHeight = 40;
                this.sideBarBoxLength = 15;
                this.overallSummaryTopRow = 5;
                this.overallSummaryBottomRow = 3;
                this.sideBarBoxWidth = 4;
                this.mainContentWidth = 12;
                this.menuOneWidth = 4;
                this.menuTwoWidth = 12;
            }
            if (state.breakpoints['(min-width: 1536px)']) {
                this.rowLength = 150;
                this.menuBarHeight = 40;
                this.sideBarBoxLength = 15;
                this.overallSummaryTopRow = 6;
                this.overallSummaryBottomRow = 4;
                this.sideBarBoxWidth = 4;
                this.mainContentWidth = 12;
                this.menuOneWidth = 4;
                this.menuTwoWidth = 12;
            }
        })
    }

    // This function will use for get subscribed companies 
    public getCompanies(): void {
        this.showLoader = true;
        //This service will use for get subscribed companies
        this.subscriptionService.getSubScribedCompanies().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.showLoader = false;
            if (res?.status === "success" && res?.body) {
                this.store.dispatch(this.subscriptionsActions.SubscribedCompaniesResponse(res));
            }


        });
    }

    displayedColumns: string[] = ['consumed', 'balance', 'dues'];
    dataSource = ELEMENT_DATA;

    openDialog() {
        const dialogRef = this.dialog.open(this.moveCompany, { height: '50%', width: '40%' });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
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
            this.store.dispatch(this.subscriptionsActions.SubscribedCompanies());
        }
        this.modalRef.hide();
    }

    //This will open the deactive company popup
    public openModal(MoveCompany: TemplateRef<any>) {
        this.modalRef = this.modalService.show(MoveCompany);
    }

    //This will open the move company popup
    public openModalMove(deactivateCompany: TemplateRef<any>, company: any) {
        this.selectedCompany = company;
        this.modalRef = this.modalService.show(deactivateCompany);
    }

    // This function will use for destroy on next and complete
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    // This function will use for select subscriptions
    public selectSubscription(subscription: any): void {
        this.selectedSubscription = subscription;
    }

    // This function will use for on changes
    public ngOnChanges(changes: SimpleChanges): void { }

    // This function will use for filter plans , withing and expiry in dropdown and searching subscriptions
    public filterSubscriptions(): void {
        let subscriptions = [];
        this.subscriptions = [];
        this.subscriptions$.subscribe(response => {
            if (response) {
                response.forEach(subscription => {
                    let flag = true;
                    if (
                        (this.searchSubscription?.value && subscription?.planDetails?.name?.toLowerCase()?.indexOf(this.searchSubscription?.value?.toLowerCase()) === -1) ||
                        (this.filters?.plan && subscription?.planDetails?.uniqueName !== this.filters?.plan) ||
                        (this.filters?.expiration && (subscription?.remainingDays < 0 || subscription?.remainingDays > this.filters?.expiration)) ||
                        (this.filters?.transactionBalance && (subscription?.remainingTransactions < 0 || subscription?.remainingTransactions > this.filters?.transactionBalance))
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

    // This function will use for reset filter plans , withing and expiry in dropdown and searching subscriptions
    public clearFilters(): void {
        this.searchSubscription = new FormControl();
        this.filters.plan = '';
        this.filters.expiration = '';
        this.filters.transactionBalance = '';
        this.filterSubscriptions();
    }
}