import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { AccountDetails } from '../../../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { each } from 'apps/web-giddh/src/app/lodash-optimized';
import { TRIAL_BALANCE_VIEWPORT_LIMIT } from '../../../constants/trial-balance-profit.constant';

@Component({
    selector: 'tb-grid',
    templateUrl: './tb-grid.component.html',
    styleUrls: [`./tb-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbGridComponent implements OnInit, OnChanges, OnDestroy {

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

    constructor(private cd: ChangeDetectorRef, private zone: NgZone) {

    }

    public ngOnInit() {
        this.accountSearchControl.valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                this.searchInput = newValue;
                this.searchChange.emit(this.searchInput);

                if (newValue === '') {
                    this.showClearSearch = false;
                }
                this.cd.detectChanges();
            });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
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
     * @memberof TbGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public markForCheck() {
        this.cd.markForCheck();
    }

    public trackByFn(index, item: ChildGroup) {
        return item.uniqueName;
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
     * @memberof TbGridComponent
     */
    public toggleGroupVisibility(group: Array<ChildGroup>, isVisible: boolean): void {
        for (let groupIndex = 0; groupIndex < group.length; groupIndex++) {
            const currentGroup: ChildGroup = group[groupIndex];
            if (currentGroup.isIncludedInSearch) {
                currentGroup.isCreated = isVisible;
                currentGroup.isVisible = isVisible;
                currentGroup.isOpen = isVisible;
                for (let accountIndex = 0; accountIndex < currentGroup.accounts.length; accountIndex++) {
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
}
