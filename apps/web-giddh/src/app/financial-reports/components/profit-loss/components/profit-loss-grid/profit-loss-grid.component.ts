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
import { ProfitLossData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'profit-loss-grid',
    templateUrl: './profit-loss-grid.component.html',
    styleUrls: [`./profit-loss-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfitLossGridComponent implements OnInit, OnChanges, OnDestroy {
    public noData: boolean;
    public showClearSearch: boolean = false;
    @Input() public search: string = '';
    @Input() public searchInput: string = '';
    @Output() public searchChange = new EventEmitter<string>();
    @Input() public plData: ProfitLossData;
    @Input() public cogsData: ChildGroup;
    @Input() public padding: string;
    @Input() public expandAll: boolean;
    @Input() public from: string = '';
    @Input() public to: string = '';
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    public dayjs = dayjs;
    public plSearchControl: FormControl = new FormControl();
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

    public ngOnInit() {
        this.plSearchControl.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$))
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
            if (this.plData && this.cogsData) {
                this.zone.run(() => {
                    if (this.plData) {
                        this.toggleVisibility(this.plData.expArr, changes.expandAll.currentValue);
                        this.toggleVisibility(this.plData.incArr, changes.expandAll.currentValue);
                        if (this.plData.incArr) {
                            each(this.plData.incArr, (grp: any) => {
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
                        if (this.plData.expArr) {
                            each(this.plData.expArr, (grp: any) => {
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

                    if (this.cogsData) {
                        if (this.cogsData.isIncludedInSearch) {
                            if (!this.cogsData.level1) {
                                this.cogsData.isOpen = changes.expandAll.currentValue;
                            } else {
                                this.cogsData.isOpen = true;
                            }
                            this.toggleVisibility(this.cogsData.childGroups, changes.expandAll.currentValue);
                        }
                    }

                    this.cd.detectChanges();

                });
            }
        }
    }

    public toggleSearch() {
        this.showClearSearch = true;

        setTimeout(() => {
            if (this.searchInputEl && this.searchInputEl.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
        }, 200);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public clickedOutside(event, el) {
        if (this.plSearchControl.value !== null && this.plSearchControl.value !== '') {
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
        let parentGroups = ['operatingcost', 'revenuefromoperations', 'otherincome', 'indirectexpenses'];
        each(data, (grp: ChildGroup) => {
            if (grp.isIncludedInSearch) {
                if (!grp.level1) {
                    if (parentGroups?.indexOf(grp?.uniqueName) === -1) {
                        grp.isCreated = false;
                        grp.isVisible = isVisible;
                        grp.isOpen = isVisible;
                    } else {
                        grp.isOpen = isVisible;
                    }
                } else {
                    grp.isOpen = true;
                }
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
}
