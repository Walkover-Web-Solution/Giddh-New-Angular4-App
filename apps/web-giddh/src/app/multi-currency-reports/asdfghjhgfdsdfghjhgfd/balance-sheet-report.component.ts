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
import { each } from 'apps/web-giddh/src/app/lodash-optimized';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { BalanceSheetData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { ReportType } from '../multi-currency.const';

@Component({
    selector: 'balance-sheet-reportsdfghfds',
    templateUrl: './balance-sheet-report.component.html',
    styleUrls: [`./balance-sheet-report.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MultiCurrencyReportsComponentStore]
})
export class BalanceSheetReportdfgfdComponent implements OnInit, OnChanges, OnDestroy {
    public noData: boolean = false;
    public showClearSearch: boolean = false;
    @Input() public search: string = '';
    public bsData: BalanceSheetData;
    public synced_date:string="";
    public initFormData:any={};
    @Input() public padding: string;
    public dayjs = dayjs;
    @Input() public expandAll: boolean;
    @Input() public searchInput: string = '';
    @Input() public from: string = '';
    @Input() public to: string = '';
    @Output() public searchChange = new EventEmitter<string>();
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    public bsSearchControl: UntypedFormControl = new UntypedFormControl();
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

    constructor(private cd: ChangeDetectorRef, private zone: NgZone, private componentStore: MultiCurrencyReportsComponentStore) {

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
            this.componentStore.reportDataList$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
                if(data){
                    this.bsData = data.response;
                    this.synced_date = data.date;
                    this.initFormData = data.request;
                    console.log("reportDataList",data);
                    
                    this.cd.detectChanges();
                }
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
        if (this.bsSearchControl?.value !== null && this.bsSearchControl?.value !== '') {
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

    public searchData(event: any){
        console.log('creatMultiCurrencyReport', event);
        this.componentStore.creatMultiCurrencyReport({reportType: ReportType.BalanceSheet,payload: event});
    }

    public getProfitLossReport(){
        console.log("getMultiCurrencyReport");
        
        this.componentStore.getMultiCurrencyReport(ReportType.BalanceSheet);
    }
}
