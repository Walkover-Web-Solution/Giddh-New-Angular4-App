import { trigger, state, style, transition, animate } from '@angular/animations';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { cloneDeep, each } from 'apps/web-giddh/src/app/lodash-optimized';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { AccountDetails, TrialBalanceRequest } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { Observable, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AppState } from '../../store';
import { createSelector, select, Store } from '@ngrx/store';
import { TBPlBsActions } from '../../actions/tl-pl.actions';
import { ToasterService } from '../../services/toaster.service';
import { CompanyResponse } from '../../models/api-models/Company';

@Component({
    selector: 'trial-balance-report',
    templateUrl: './trial-balance-report.component.html',
    styleUrls: [`./trial-balance-report.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger("slideInOut", [
            state("in", style({
                transform: "translate3d(0, 0, 0)",
            })),
            state("out", style({
                transform: "translate3d(100%, 0, 0)",
            })),
            transition("in => out", animate("400ms ease-in-out")),
            transition("out => in", animate("400ms ease-in-out")),
        ]),
    ],
})
export class TrialBalanceReportComponent implements OnInit, OnChanges, OnDestroy {

    public noData: boolean;
    public accountSearchControl: UntypedFormControl = new UntypedFormControl();
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    public showClearSearch: boolean = false;
    public search: string = '';
    public from: string = '';
    public to: string = '';
    public searchInput: string = '';
    public padLeft: number = 30;
    @Input() public showLoader: boolean;
    @Input() public data: AccountDetails;
    @Input() public expandAll: boolean;
    public searchChange = new EventEmitter<string>();
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hides the data while a new search is made to refresh the virtual list */
    public hideData: boolean;
    /** True, when expand all button is toggled while search is enabled */
    public isExpandToggledDuringSearch: boolean;
    /** Account update modal state */
    public accountAsideMenuState: string = "out";
    /** Account group unique name */
    public activeGroupUniqueName: string = "";
    /** Holds account details */
    public accountDetails: any;
    public showLoader$: Observable<boolean>;
    public data$: Observable<AccountDetails>;
    public request: TrialBalanceRequest;
    @ViewChild('tbGrid', { static: true }) public tbGrid: TrialBalanceReportComponent;
    @Input() public isV2: boolean = false;
    @Input() public isDateSelected: boolean = false;
    private _selectedCompany: CompanyResponse;

    constructor(private cd: ChangeDetectorRef, private zone: NgZone,
        private store: Store<AppState>,
        public tlPlActions: TBPlBsActions,
        private toaster: ToasterService) {
        this.showLoader$ = this.store.pipe(select(p => p.tlPl.tb.showLoader), takeUntil(this.destroyed$));
    

    }

    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }

    // set company and fetch data...
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        this._selectedCompany = value;
        if (value && value.activeFinancialYear && !this.isDateSelected) {
            this.request = {
                refresh: false,
                from: value.activeFinancialYear.financialYearStarts,
                to: this.selectedCompany.activeFinancialYear.financialYearEnds
            };
        }
    }

    public ngOnInit() {
        this.accountSearchControl.valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                this.searchInput = newValue;
                this.hideData = true;
                this.searchChange.emit(this.searchInput);
                this.isExpandToggledDuringSearch = false;
                if (newValue === '') {
                    this.showClearSearch = false;
                }
                setTimeout(() => {
                    this.hideData = false;
                    this.cd.detectChanges();
                }, 10);
            });

            this.data$ = this.store.pipe(select(createSelector((p: AppState) => p.tlPl.tb.data, (p: AccountDetails) => {
                let d = cloneDeep(p) as AccountDetails;
                if (d) {
                    if (d.message) {
                        setTimeout(() => {
                            this.toaster.clearAllToaster();
                            this.toaster.infoToast(d.message);
                        }, 100);
                    }
                    this.InitData(d.groupDetails);
                    d.groupDetails.forEach(g => {
                        g.isVisible = true;
                        g.isCreated = true;
                    });
                }
                return d;
            })), takeUntil(this.destroyed$));
            this.data$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
                this.cd.markForCheck();
            });
    }

    ///****

    public InitData(d: ChildGroup[]) {
        each(d, (grp: ChildGroup) => {
            grp.isVisible = false;
            grp.isCreated = false;
            grp.isIncludedInSearch = true;
            each(grp.accounts, (acc: Account) => {
                acc.isIncludedInSearch = true;
                acc.isCreated = false;
                acc.isVisible = false;
            });
            if (grp.childGroups) {
                this.InitData(grp.childGroups);
            }
        });
    }

    public ngAfterViewInit() {
        this.cd.detectChanges();
    }

    public filterData(request: TrialBalanceRequest) {
        this.from = request.from;
        this.to = request.to;
        this.isDateSelected = request && request.selectedDateOption === '1';
        if (this.isV2) {
            this.store.dispatch(this.tlPlActions.GetV2TrialBalance(cloneDeep(request)));
        } else {
            this.store.dispatch(this.tlPlActions.GetTrialBalance(cloneDeep(request)));
        }
    }


    public expandAllEvent() {
        setTimeout(() => {
            this.cd.detectChanges();
        }, 1);
    }

    public searchChanged(event: string) {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.cd.detectChanges();
    }





    ////****



    public ngOnChanges(changes: SimpleChanges) {
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.data$) {
                this.zone.runOutsideAngular(() => {
                    this.toggleGroupVisibility(this.data.groupDetails, changes.expandAll.currentValue);
                    if (this.data$) {
                        // always make first level visible ....
                        each(this.data.groupDetails, (grp: ChildGroup) => {
                            if (grp.isIncludedInSearch) {
                                grp.isVisible = true;
                                grp.isCreated = true;
                                grp.isOpen = false;
                                each(grp.accounts, (acc: Account) => {
                                    if (acc.isIncludedInSearch) {
                                        acc.isVisible = false;
                                        acc.isCreated = false;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof TrialBalanceGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public markForCheck() {
        this.cd.markForCheck();
    }

    public trackByFn(index, item: ChildGroup) {
        return item?.uniqueName;
    }

    public toggleSearch() {
        this.showClearSearch = true;

        setTimeout(() => {
            if (this.searchInputEl && this.searchInputEl.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
        }, 200);
    }

    public clickedOutside(event, el) {
        if (this.accountSearchControl?.value !== null && this.accountSearchControl?.value !== '') {
            return;
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    /**
     * Toggles group visibility
     *
     * @param {Array<ChildGroup>} group Groups received
     * @param {boolean} isVisible Current visibility status
     * @memberof TrialBalanceGridComponent
     */
    public toggleGroupVisibility(group: Array<ChildGroup>, isVisible: boolean): void {
        for (let groupIndex = 0; groupIndex < group?.length; groupIndex++) {
            const currentGroup: ChildGroup = group[groupIndex];
            if (currentGroup.isIncludedInSearch) {
                currentGroup.isCreated = isVisible;
                currentGroup.isVisible = isVisible;
                currentGroup.isOpen = isVisible;
                for (let accountIndex = 0; accountIndex < currentGroup.accounts?.length; accountIndex++) {
                    const currentAccount: Account = currentGroup.accounts[accountIndex];
                    if (currentAccount.isIncludedInSearch) {
                        currentAccount.isCreated = isVisible;
                        currentAccount.isVisible = isVisible;
                    }
                }
                if (currentGroup.childGroups?.length) {
                    this.toggleGroupVisibility(currentGroup.childGroups, isVisible);
                }
            }
        }
    }

    /**
     * Shows the account update modal
     *
     * @param {*} account
     * @memberof TrialBalanceGridComponent
     */
    public openAccountModal(account: any): void {
        this.accountDetails = account;
        this.activeGroupUniqueName = account?.parentGroups[account?.parentGroups?.length - 1]?.uniqueName;
        this.toggleAccountAsidePane();
    }

    /**
     * Toggle's account update modal
     *
     * @memberof TrialBalanceGridComponent
     */
    public toggleAccountAsidePane(): void {
        this.accountAsideMenuState = this.accountAsideMenuState === "out" ? "in" : "out";
        this.toggleBodyClass();
    }

    /**
     * Toggle's fixed class in body
     *
     * @memberof TrialBalanceGridComponent
     */
    public toggleBodyClass() {
        if (this.accountAsideMenuState === "in") {
            document.querySelector("body").classList.add("fixed");
        } else {
            document.querySelector("body").classList.remove("fixed");
        }
    }

    /**
     * Callback function on account modal close
     *
     * @param {*} event
     * @memberof TrialBalanceGridComponent
     */
    public getUpdatedList(event: any): void {
        this.toggleAccountAsidePane();
    }
}
