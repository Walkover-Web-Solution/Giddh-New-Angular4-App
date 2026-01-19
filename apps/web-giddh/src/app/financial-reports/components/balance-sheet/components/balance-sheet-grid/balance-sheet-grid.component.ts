import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
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
import { DomUtilsHelper } from 'apps/web-giddh/src/app/shared/helpers/dom-utils.helper';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { BalanceSheetData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { FinancialReportsComponentStore } from '../../../../financial-reports.store';
import { ReportType } from 'apps/web-giddh/src/app/multi-currency-reports/multi-currency.const';
import { NewConfirmationModalComponent } from 'apps/web-giddh/src/app/theme/new-confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Configuration } from '../../../../../app.constant';
import { environment } from '../../../../../../environments/environment.generated';
import { each, forEach } from '../../../../../lodash-optimized';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

/**
 * Handles Component functionality
 */
@Component({
selector: 'balance-sheet-grid',
    templateUrl: './balance-sheet-grid.component.html',
    styleUrls: [`./balance-sheet-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone: false
})
/**
 * BalanceSheetGridComponent component
 * Handles balancesheetgrid functionality and user interactions
 */
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
    /** Refresh event emitter */
    @Output() public refresh = new EventEmitter<string>();
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
    /** List of check groups accounts */
    private listOfCheckGroupsAccounts: any[] = [];
    /** Holds images folder path */
    public imgPath: string = "";

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private cd: ChangeDetectorRef,
        private zone: NgZone,
        private financialReportsComponentStore: FinancialReportsComponentStore,
        private dialog: MatDialog,
        private generalService: GeneralService,
        @Inject(ServiceConfig) private serviceConfig
    ) {

    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges) {
        /**
         * Handles if functionality
         */
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            /**
             * Handles if functionality
             */
            if (this.bsData) {
                this.zone.run(() => {
                    /**
                     * Handles if functionality
                     */
                    if (this.bsData) {
                        this.toggleVisibility(this.bsData.assets, changes.expandAll.currentValue);
                        this.toggleVisibility(this.bsData.liabilities, changes.expandAll.currentValue);
                        // always make first level visible ....
                        /**
                         * Handles if functionality
                         */
                        if (this.bsData.liabilities) {
                            /**
                             * Handles each functionality
                             */
                            each(this.bsData.liabilities, (grp: any) => {
                                /**
                                 * Handles if functionality
                                 */
                                if (grp.isIncludedInSearch) {
                                    grp.isVisible = true;
                                    /**
                                     * Handles each functionality
                                     */
                                    each(grp.accounts, (acc: any) => {
                                        /**
                                         * Handles if functionality
                                         */
                                        if (acc.isIncludedInSearch) {
                                            acc.isVisible = true;
                                        }
                                    });
                                }
                            });
                        }
                        /**
                         * Handles if functionality
                         */
                        if (this.bsData.assets) {
                            /**
                             * Handles each functionality
                             */
                            each(this.bsData.assets, (grp: any) => {
                                /**
                                 * Handles if functionality
                                 */
                                if (grp.isIncludedInSearch) {
                                    grp.isVisible = true;
                                    /**
                                     * Handles each functionality
                                     */
                                    each(grp.accounts, (acc: any) => {
                                        /**
                                         * Handles if functionality
                                         */
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

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.bsSearchControl.valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                this.searchInput = newValue;
                this.hideData = true;
                this.searchChange.emit(this.searchInput);
                this.isExpandToggledDuringSearch = false;
                /**
                 * Handles if functionality
                 */
                if (newValue === '') {
                    this.showClearSearch = false;
                }
                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    this.hideData = false;
                    this.cd.detectChanges();
                }, 10);
            });

        this.financialReportsComponentStore.tailedReportIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            /**
             * Handles if functionality
             */
            if (res) {
                this.listOfCheckGroupsAccounts = [];
                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    this.refresh.emit();
                }, 600);
            }
        });
    }

    /**
     * Toggles search state
     */
    public toggleSearch() {
        this.showClearSearch = true;

        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.searchInputEl && this.searchInputEl.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
        }, 200);
    }

    /**
     * Handles clickedOutside functionality
     */
    public clickedOutside(event, el) {
        /**
         * Handles if functionality
         */
        if (this.bsSearchControl?.value !== null && this.bsSearchControl?.value !== '') {
            return;
        }

        /**
         * Handles if functionality
         */
        if (this.childOf(event.target, el)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /* tslint:disable */
    /**
     * Handles childOf functionality
     */
    public childOf(c, p) {
        return DomUtilsHelper.childOf(c, p);
    }

    /**
     * Toggles visibility state
     */
    private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
        /**
         * Handles each functionality
         */
        each(data, (grp: ChildGroup) => {
            /**
             * Handles if functionality
             */
            if (grp.isIncludedInSearch) {
                grp.isCreated = true;
                grp.isVisible = isVisible;
                grp.isOpen = isVisible;
                /**
                 * Handles each functionality
                 */
                each(grp.accounts, (acc: Account) => {
                    /**
                     * Handles if functionality
                     */
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
     * Unchecks all the accounts/groups in the balance sheet grid.
     *
     * @param {'group' | 'account'} [entityType='group'] - Type of entity to uncheck.
     * @private
     * @memberof BalanceSheetGridComponent
     */
    private uncheckAll(entityType: 'group' | 'account' = 'group'): void {
        this.extractCheckedAccountsGroups([...this.bsData.liabilities, ...this.bsData.assets], entityType);
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.listOfCheckGroupsAccounts?.length) {
                const model = {
                    request: {
                        reportType: ReportType.BALANCE_SHEET,
                        from: this.from,
                        to: this.to,
                        branchUniqueName: this.generalService.currentBranchUniqueName
                    },
                    payload: this.listOfCheckGroupsAccounts
                };
                this.financialReportsComponentStore.tailedReportAccountGroup(model);
            }
        }, 400);
    }

    /**
     * Recursive function to extract checked accounts/groups and store it in listOfCheckGroupsAccounts.
     * It loops through the groupAccountDetails array and checks if the account/group is checked.
     * If checked, it adds the account/group to listOfCheckGroupsAccounts with checked set to false.
     * Then it recursively calls itself on the childGroups and accounts of the group.
     * @param groupAccountDetails array of account/group objects
     * @param entityType type of entity, either 'group' or 'account'
     * @memberof BalanceSheetGridComponent
     */
    private extractCheckedAccountsGroups(groupAccountDetails: any, entityType: 'group' | 'account'): void {
        (Array.isArray(groupAccountDetails) ? groupAccountDetails : []).forEach(groupAccount => {
            /**
             * Handles if functionality
             */
            if (groupAccount.checked) {
                this.listOfCheckGroupsAccounts.push({
                    uniqueName: groupAccount.uniqueName,
                    entityType,
                    checked: false
                });
            }
            /**
             * Handles if functionality
             */
            if (groupAccount.childGroups?.length) {
                this.extractCheckedAccountsGroups(groupAccount.childGroups, 'group');
            }
            /**
             * Handles if functionality
             */
            if (groupAccount.accounts?.length) {
                this.extractCheckedAccountsGroups(groupAccount.accounts, 'account');
            }
        });
    }

    /**
     * Opens a confirmation dialog to confirm the uncheck all action.
     *
     * @memberof BalanceSheetGridComponent
     */
    public openConfirmDialog(): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            data: {
                configuration: this.generalService.deleteConfiguration(this.commonLocaleData?.app_uncheck_all_item_message, this.commonLocaleData)
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response === this.commonLocaleData?.app_yes) {
                this.uncheckAll();
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
