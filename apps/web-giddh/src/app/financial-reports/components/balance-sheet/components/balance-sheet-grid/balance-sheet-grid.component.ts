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
import { BalanceSheetData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'balance-sheet-grid',
    templateUrl: './balance-sheet-grid.component.html',
    styleUrls: [`./balance-sheet-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceSheetGridComponent implements OnInit, OnChanges, OnDestroy {
    public noData: boolean;
    public showClearSearch: boolean = false;
    @Input() public search: string = '';
    @Input() public bsData: BalanceSheetData;
    @Input() public padding: string;
    public dayjs = dayjs;
    @Input() public expandAll: boolean;
    @Input() public searchInput: string = '';
    @Input() public from: string = '';
    @Input() public to: string = '';
    @Output() public searchChange = new EventEmitter<string>();
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    public bsSearchControl: FormControl = new FormControl();
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
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

    constructor(private cd: ChangeDetectorRef, private zone: NgZone) {

    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (this.bsData) {
                this.zone.run(() => {
                    if (this.bsData) {
                        this.toggleVisibility(this.bsData.assets, changes.expandAll.currentValue);
                        this.toggleVisibility(this.bsData.liabilities, changes.expandAll.currentValue);
                        // always make first level visible ....
                        if (this.bsData.liabilities) {
                            each(this.bsData.liabilities, (grp: any) => {
                                if (grp.isIncludedInSearch) {
                                    grp.isVisible = true;
                                    each(grp.accounts, (acc: any) => {
                                        if (acc.isIncludedInSearch) {
                                            acc.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }
                        if (this.bsData.assets) {
                            each(this.bsData.assets, (grp: any) => {
                                if (grp.isIncludedInSearch) {
                                    grp.isVisible = true;
                                    each(grp.accounts, (acc: any) => {
                                        if (acc.isIncludedInSearch) {
                                            acc.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }

                    }
                    this.cd.detectChanges();
                });
            }
        }
    }

    public ngOnInit() {
        this.bsSearchControl.valueChanges.pipe(
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

    public toggleSearch() {
        this.showClearSearch = true;

        setTimeout(() => {
            if (this.searchInputEl && this.searchInputEl.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
        }, 200);
    }

    public clickedOutside(event, el) {
        if (this.bsSearchControl.value !== null && this.bsSearchControl.value !== '') {
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

    private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
        each(data, (grp: ChildGroup) => {
            if (grp.isIncludedInSearch) {
                grp.isCreated = true;
                grp.isVisible = isVisible;
                grp.isOpen = isVisible;
                each(grp.accounts, (acc: Account) => {
                    if (acc.isIncludedInSearch) {
                        acc.isCreated = true;
                        acc.isVisible = isVisible;
                    }
                });
                this.toggleVisibility(grp.childGroups, isVisible);
            }
        });
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof BalanceSheetGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
