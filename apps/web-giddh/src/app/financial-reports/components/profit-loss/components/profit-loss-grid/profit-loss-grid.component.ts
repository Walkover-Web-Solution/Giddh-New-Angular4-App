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
import { ProfitLossData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { ReportType } from 'apps/web-giddh/src/app/multi-currency-reports/multi-currency.const';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { FinancialReportsComponentStore } from '../../../../financial-reports.store';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { NewConfirmationModalComponent } from 'apps/web-giddh/src/app/theme/new-confirmation-modal/confirmation-modal.component';
import { Configuration } from '../../../../../app.constant';
import { environment } from '../../../../../../environments/environment.generated';
import { each, forEach, indexOf, keys } from '../../../../../lodash-optimized';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

/**
 * Handles Component functionality
 */
@Component({
selector: 'profit-loss-grid',
    templateUrl: './profit-loss-grid.component.html',
    styleUrls: [`./profit-loss-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone: false
})
/**
 * ProfitLossGridComponent component
 * Handles profitlossgrid functionality and user interactions
 */
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
    /** Refresh event emitter */
    @Output() public refresh = new EventEmitter<string>();
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    public dayjs = dayjs;
    public plSearchControl: UntypedFormControl = new UntypedFormControl();
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
        @Inject(ServiceConfig) private serviceConfig,
    ) {

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.plSearchControl.valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$))
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
            if (this.plData && this.cogsData) {
                this.zone.run(() => {
                    /**
                     * Handles if functionality
                     */
                    if (this.plData) {
                        this.toggleVisibility(this.plData.expArr, changes.expandAll.currentValue);
                        this.toggleVisibility(this.plData.incArr, changes.expandAll.currentValue);
                        /**
                         * Handles if functionality
                         */
                        if (this.plData.incArr) {
                            /**
                             * Handles each functionality
                             */
                            each(this.plData.incArr, (grp: any) => {
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
                        if (this.plData.expArr) {
                            /**
                             * Handles each functionality
                             */
                            each(this.plData.expArr, (grp: any) => {
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

                    /**
                     * Handles if functionality
                     */
                    if (this.cogsData) {
                        /**
                         * Handles if functionality
                         */
                        if (this.cogsData.isIncludedInSearch) {
                            /**
                             * Handles if functionality
                             */
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
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles clickedOutside functionality
     */
    public clickedOutside(event, el) {
        /**
         * Handles if functionality
         */
        if (this.plSearchControl?.value !== null && this.plSearchControl?.value !== '') {
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
        let parentGroups = ['operatingcost', 'revenuefromoperations', 'otherincome', 'indirectexpenses'];
        /**
         * Handles each functionality
         */
        each(data, (grp: ChildGroup) => {
            /**
             * Handles if functionality
             */
            if (grp.isIncludedInSearch) {
                /**
                 * Handles if functionality
                 */
                if (!grp.level1) {
                    /**
                     * Handles if functionality
                     */
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
     * Retrieves the keys of an object.
     *
     * @param obj The object whose keys are to be retrieved.
     * @returns An array of strings representing the keys of the object, or an empty array if the input is null or undefined.
     * @memberof ProfitLossGridComponent
     */
    public getKeys(obj: Record<string, any> | null | undefined): string[] | [] {
        /**
         * Handles if functionality
         */
        if (obj) {
            return Object.keys(obj);
        } else {
            return [];
        }
    }

    /**
     * Unchecks all the accounts/groups in the profit loss grid.
     *
     * @param {'group' | 'account'} [entityType='group'] - Type of entity to uncheck.
     * @private
     * @memberof ProfitLossGridComponent
     */
    private uncheckAll(entityType: 'group' | 'account' = 'group'): void {
        this.extractCheckedAccountsGroups([...this.plData.incArr, ...this.plData.expArr], entityType);
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
                        reportType: ReportType.PROFIT_LOSS,
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
     * @memberof ProfitLossGridComponent
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
     * @memberof ProfitLossGridComponent
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
}
