import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { ProfitLossData } from '../../../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import * as moment from 'moment/moment';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { ReplaySubject } from 'rxjs';
import { each } from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
    selector: 'pl-grid',
    templateUrl: './pl-grid.component.html',
    styleUrls: [`./pl-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlGridComponent implements OnInit, OnChanges, OnDestroy {
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
    public moment = moment;
    public plSearchControl: FormControl = new FormControl();
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private cd: ChangeDetectorRef, private zone: NgZone) {

    }

    public ngOnInit() {
        this.plSearchControl.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$))
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
                    if (parentGroups.indexOf(grp.uniqueName) === -1) {
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
