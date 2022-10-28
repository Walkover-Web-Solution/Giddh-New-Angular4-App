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
import { FormControl } from '@angular/forms';
import { each } from 'apps/web-giddh/src/app/lodash-optimized';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { AccountDetails } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'trial-balance-grid',
    templateUrl: './trial-balance-grid.component.html',
    styleUrls: [`./trial-balance-grid.component.scss`],
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
export class TrialBalanceGridComponent implements OnInit, OnChanges, OnDestroy {

    public noData: boolean;
    public accountSearchControl: FormControl = new FormControl();
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    public showClearSearch: boolean = false;
    @Input() public search: string = '';
    @Input() public from: string = '';
    @Input() public to: string = '';
    @Input() public searchInput: string = '';
    @Input() public padLeft: number = 30;
    @Input() public showLoader: boolean;
    @Input() public data$: AccountDetails;
    @Input() public expandAll: boolean;
    @Output() public searchChange = new EventEmitter<string>();
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

    constructor(private cd: ChangeDetectorRef, private zone: NgZone) {

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
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.data$) {
                this.zone.runOutsideAngular(() => {
                    this.toggleGroupVisibility(this.data$.groupDetails, changes.expandAll.currentValue);
                    if (this.data$) {
                        // always make first level visible ....
                        each(this.data$.groupDetails, (grp: ChildGroup) => {
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
        if (this.accountSearchControl.value !== null && this.accountSearchControl.value !== '') {
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
