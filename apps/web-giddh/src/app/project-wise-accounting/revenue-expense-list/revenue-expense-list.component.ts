import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../../services/general.service';
import { API_BULK_FETCH_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, ReplaySubject, takeUntil, filter, tap, debounceTime, Observable, take } from 'rxjs';
import { ProjectWiseAccountingComponentStore } from '../project-wise-accounting.store';
import { DefaultParamType, ProjectWiseAccountingType } from '../project-wise-accounting';
import { cloneDeep } from '../../lodash-optimized';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGE_SIZE_OPTIONS } from '../../app.constant';
import { MatTabChangeEvent } from "@angular/material/tabs";
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { OrganizationType } from '../../models/user-login-state';
import { AccountingGroupEnum } from '../../shared/Enums/common.enum';

@Component({
    selector: 'revenue-expense-list',
    styleUrls: ['./revenue-expense-list.component.scss'],
    templateUrl: './revenue-expense-list.component.html',
    providers: [ProjectWiseAccountingComponentStore]
})
export class RevenueExpenseListComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Reference to the mat-menu trigger for the datepicker */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
/** Request parameters for fetching project entries */
    public getProjectEntryListRequest: any = { count: PAGINATION_LIMIT, page: 1 };
    /** Default parameters for API requests */
    public defaultParamsValue: DefaultParamType = {
        companyUniqueName: '',
        projectUniqueName: '',
        branchUniqueName: '',
        to: '',
        from: '',
        category: ''
    };
    /** Active company details */
    public activeCompany: any;
    /** ReplaySubject to handle component's lifecycle */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Columns to be displayed in the table */
    public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
    /** Form for creating a new account entry */
    public createAccountEntryForm: FormGroup;
    /** Form for managing the account entry list */
    public accountEntryListForm: FormGroup;
    /** Stores the search results for accounts */
    public accountSearchResponse: any[] = [];
    /** Stores the search results for entries */
    public accountAndEntryList: any = {};
    /** Pagination options for the table */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Total number of results in the entry list */
    public totalResults: number = 0;
    /** Default result count for account searches */
    public defaultCount = API_BULK_FETCH_LIMIT;
    /** Index of the currently selected tab */
    public selectedTabIndex: number = 0;
    /** Income group categories */
    public incomeGroup: string = `${AccountingGroupEnum.RevenueFromOperations},${AccountingGroupEnum.OtherIncome},${AccountingGroupEnum.FixedAssets}`;
    /** Expense group categories */
    public expenseGroup: string = `${AccountingGroupEnum.IndirectExpenses},${AccountingGroupEnum.OperatingCost},${AccountingGroupEnum.FixedAssets}`;
    /** Holds true, if form is valid */
    public isCreateAccountValidForm: boolean = true;
    /** Getter for the entry list form array */
    public get entryList(): FormArray {
        return this.accountEntryListForm.get('entryList') as FormArray;
    }
    /** Options for selecting calculation method */
    public selectMethod = [];
    /** Request parameters for account searches */
    public accountSearchRequest: any = {
        count: this.defaultCount,
        withStocks: false
    };
    /** Request parameters for entry searches */
    public entrySearchRequest: any = {
        count: this.defaultCount
    };
    /** Observable for fetching projects */
    public isFetchingProjects$: Observable<any> = this.componentStore.isFetchingProjects$;
    /** Observable for retrieve the total revenue and expense details for a project */
    public totalRevenueAndExpense$: Observable<any> = this.componentStore.totalRevenueAndExpense$;
    /** Active index for current fields */
    public activeRowIndex: number = -1;
    /** Enum representing the types of project-wise accounting */
    public projectWiseAccountingType: typeof ProjectWiseAccountingType = ProjectWiseAccountingType;
    /** True if is company */
    public isCompany: boolean = false;

    constructor(
        private generalService: GeneralService,
        private route: ActivatedRoute,
        private componentStore: ProjectWiseAccountingComponentStore,
        private formBuilder: FormBuilder,
        private router: Router,
        public dialog: MatDialog
    ) { }

    /**
     * Initializes the component and sets up subscriptions for reactive data streams.
     *
     * @memberof RevenueExpenseListComponent
     */
    public ngOnInit(): void {
        this.initCreateAccountEntryForm();
        this.initAccountEntryListForm();
        this.componentStore.patchState({ isFetchingProjects: true });
        this.componentStore.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.defaultParamsValue.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.defaultParamsValue.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
        combineLatest([
            this.route.params.pipe(takeUntil(this.destroyed$)), // Route parameters
            this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)) // Active company data
        ])
            .pipe(
                debounceTime(500),
                filter(([params, activeCompany]) => !!(params.uniqueName && activeCompany)),
                tap(([params, activeCompany]) => {
                    this.defaultParamsValue.projectUniqueName = params.uniqueName;
                    this.defaultParamsValue.companyUniqueName = activeCompany.uniqueName;
                    this.defaultParamsValue.branchUniqueName = this.generalService.currentBranchUniqueName ?? activeCompany.uniqueName;
                    this.accountSearchResponse = [];
                    this.defaultParamsValue.category = params.module;
                    this.accountSearchRequest.group = this.defaultParamsValue.category === this.projectWiseAccountingType.Income ? this.incomeGroup : this.expenseGroup;
                    this.activeCompany = activeCompany;
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                this.selectedTabIndex = this.defaultParamsValue.category === this.projectWiseAccountingType.Income ? 0 : this.defaultParamsValue.category === this.projectWiseAccountingType.Expenses ? 1 : 2;
                if (this.selectedTabIndex <= 1) {
                    if (!this.totalResults) {
                        this.getEntryList();
                    }
                    if (!this.accountSearchRequest.isLoading) {
                        this.searchAccount();
                    }
                    this.getRevenueExpense();
                }
            });

        this.componentStore.accountSearch$.pipe(debounceTime(200), takeUntil(this.destroyed$)).subscribe(accountSearchResponse => {
            if (accountSearchResponse) {
                this.accountSearchRequest.count = accountSearchResponse.count;
                accountSearchResponse.results?.forEach(result => {
                    if (result?.uniqueName) {
                        this.accountSearchResponse.push({
                            value: result.uniqueName,
                            label: result.name,
                            additional: result
                        });
                        this.accountAndEntryList[result.uniqueName] = {};
                        this.accountAndEntryList[result.uniqueName]['data'] = [];
                        this.accountAndEntryList[result.uniqueName]['nextPageAvailable'] = true;
                        this.accountAndEntryList[result.uniqueName]['page'] = 1;
                    }
                });
                this.accountSearchRequest.isLoading = false;
            }
        });

        this.componentStore.entrySearch$.pipe(debounceTime(200), takeUntil(this.destroyed$)).subscribe(entrySearchResponse => {
            if (entrySearchResponse) {
                const accountUniqueName = entrySearchResponse.accountUniqueName;
                this.accountAndEntryList[accountUniqueName].nextPageAvailable = entrySearchResponse.body.nextPageAvailable;
                entrySearchResponse.body.transactions?.forEach(result => {
                    this.accountAndEntryList[accountUniqueName].data.push({
                        value: result.entryUniqueName,
                        label: result.particular?.name,
                        additional: result
                    });
                });
                this.entrySearchRequest.isLoading = false;
            }
        });

        this.componentStore.entryCreateSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(entryCreateSuccess => {
            if (entryCreateSuccess) {
                this.accountEntryListForm.get('entryList')['controls'].push(this.initEntryListForm(this.createAccountEntryForm.value));
                this.totalResults += 1;
                this.createAccountEntryForm.reset();
                this.getRevenueExpense();
            }
        });

        this.componentStore.entryList$.pipe(takeUntil(this.destroyed$)).subscribe(entryList => {
            if (entryList) {
                this.entryList.clear();
                this.totalResults = entryList.totalItems;
                entryList.results?.forEach(result => {
                    const requestObject = {
                        account: result.account.name,
                        accountUniqueName: result.account.uniqueName,
                        entry: result.particular.name,
                        entryUniqueName: result.entryUniqueName,
                        value: result.value,
                        calculationMethod: result.calculationMethod,
                    }
                    this.accountEntryListForm.get('entryList')['controls'].push(this.initEntryListForm(requestObject));
                });
            }
        });

        this.componentStore.entryDeleteSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(entryDeleteSuccess => {
            if (entryDeleteSuccess) {
                this.totalResults -= 1;
                this.entryList.removeAt(entryDeleteSuccess.index);
                this.getProjectEntryListRequest.page = this.generalService.adjustPageIndex(this.totalResults, this.getProjectEntryListRequest.page, this.getProjectEntryListRequest.count);
                if (this.entryList.length === 0) {
                    this.getEntryList();
                }
                this.getRevenueExpense();
            }
        });

        this.componentStore.entryUpdateSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(entryUpdateSuccess => {
            if (entryUpdateSuccess) {
                this.entryList.at(entryUpdateSuccess.index).get('defaultEntryUniqueName').patchValue(entryUpdateSuccess.entryUniqueName);
                this.getRevenueExpense();
            }
        });

        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response.length > 1;
            }
        });
    }

    /**
     * Get total revenue and expense 
     *
     * @memberof ActivityLogsComponent
     */
    public getRevenueExpense(): void {
        this.componentStore.getTotalRevenueAndExpense(this.defaultParamsValue);
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof ActivityLogsComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.selectMethod = [
                { label: this.localeData?.percentage, value: 'PERCENTAGE' },
                { label: this.localeData?.value, value: 'VALUE' }
            ]
        }
    }
    /**
     * Initializes the form group for creating account entries with required fields.
     *
     * @private
     * @memberof RevenueExpenseListComponent
     */
    private initCreateAccountEntryForm(): void {
        this.createAccountEntryForm = this.formBuilder.group({
            account: ['', Validators.required],
            accountUniqueName: ['', Validators.required],
            entry: ['', Validators.required],
            entryUniqueName: ['', Validators.required],
            value: ['', Validators.required],
            calculationMethod: ['', Validators.required]
        })
    }

    /**
     * Initializes the form group for managing the list of account entries.
     *
     * @param {any} [data] Optional data to pre-fill the form.
     * @memberof RevenueExpenseListComponent
     */
    public initAccountEntryListForm(): void {
        this.accountEntryListForm = this.formBuilder.group({
            entryList: this.formBuilder.array([])
        })
    }

    /**
     * Initializes a form group for an individual account entry.
     *
     * @param {any} [data] Optional data to pre-fill the form.
     * @returns {FormGroup} The initialized form group.
     * @memberof RevenueExpenseListComponent
     */
    public initEntryListForm(data?: any): FormGroup {
        return this.formBuilder.group({
            account: [data?.account ?? '', Validators.required],
            accountUniqueName: [data?.accountUniqueName ?? '', Validators.required],
            entry: [data?.entry ?? '', Validators.required],
            entryUniqueName: [data?.entryUniqueName ?? '', Validators.required],
            defaultEntryUniqueName: [data?.entryUniqueName ?? '', Validators.required],
            value: [data?.value ?? '', Validators.required],
            calculationMethod: [data?.calculationMethod ?? '', Validators.required]
        });
    }

    /**
     * Fetches a list of project entries based on the provided request parameters.
     *
     * @param {*} requestObject The request parameters for fetching project entries.
     * @memberof RevenueExpenseListComponent
     */
    public getProjectEntry(requestObject: any): void {
        requestObject.category = this.defaultParamsValue.category === this.projectWiseAccountingType.Expenses ? 'expense' : this.defaultParamsValue.category;
        this.componentStore.searchEntry(requestObject);
    }

    /**
     * Fetches the list of accounts associated with a project.
     *
     * @param {*} requestObject The request parameters for fetching accounts.
     * @memberof RevenueExpenseListComponent
     */
    public getProjectAccount(requestObject: any): void {
        requestObject.count = this.defaultCount;
        this.componentStore.getProjectAccount(requestObject);
    }

    /**
     * Fetches the list of all entries for the current project and updates the UI.
     *
     * @memberof RevenueExpenseListComponent
     */
    public getEntryList(): void {
        const requestObject = { ...this.defaultParamsValue, ...this.getProjectEntryListRequest };
        this.componentStore.getAllEnteryList(requestObject);
    }

    /**
     * Handles pagination for the entry list and fetches new data for the selected page.
     *
     * @param {PageEvent} event The pagination event.
     * @memberof RevenueExpenseListComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.getProjectEntryListRequest.page = this.getProjectEntryListRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.getProjectEntryListRequest.count = event.pageSize;
        this.getEntryList();
    }

    /**
     * Handles infinite scroll for account search by fetching the next page of results.
     *
     * @memberof RevenueExpenseListComponent
     */
    public handleSearchAccountScrollEnd(): void {
        if (this.accountSearchRequest.isLoading) {
            return;
        }
        if (this.defaultCount === this.accountSearchRequest.count) {
            this.searchAccount(this.accountSearchRequest.q, this.accountSearchRequest.page + 1);
        }
    }

    /**
     * Handles infinite scroll for entry search by fetching the next page of results.
     *
     * @memberof RevenueExpenseListComponent
     */
    public handleSearchEntryScrollEnd(accountUniqueName: string): void {
        if (this.entrySearchRequest.isLoading) {
            return;
        }
        if (this.accountAndEntryList[accountUniqueName]?.nextPageAvailable) {
            this.searchEntry(this.entrySearchRequest.q, this.accountAndEntryList[accountUniqueName].page + 1, accountUniqueName);
        }
    }

    /**
     * Searches for accounts based on the query and updates the account search results.
     *
     * @param {string} [query=''] The search query.
     * @param {number} [page=1] The page number for paginated results.
     * @memberof RevenueExpenseListComponent
     */
    public searchAccount(query: string = '', page: number = 1): void {
        if (page === 1) {
            this.accountSearchResponse = [];
        }
        this.accountSearchRequest.q = query;
        this.accountSearchRequest.page = page;
        this.accountSearchRequest.isLoading = true;

        let requestObject = cloneDeep(this.accountSearchRequest);
        delete requestObject.isLoading;
        this.getProjectAccount(requestObject);
    }

    /**
     * Searches for entries based on the query and updates the entry search results.
     *
     * @param {string} [query=''] The search query.
     * @param {number} [page=1] The page number for paginated results.
     * @memberof RevenueExpenseListComponent
     */
    public searchEntry(query: string = '', page: number = 1, accountUniqueName: string): void {
        if (page === 1 && this.accountAndEntryList[accountUniqueName]) {
            this.accountAndEntryList[accountUniqueName].data = [];
        }
        this.entrySearchRequest.q = query;
        this.entrySearchRequest.isLoading = true;
        if (this.accountAndEntryList[accountUniqueName]) {
            this.accountAndEntryList[accountUniqueName].page = page;
        }
        let entryRequest = { ...this.entrySearchRequest, ...this.defaultParamsValue };
        entryRequest['accountUniqueName'] = accountUniqueName;
        entryRequest['page'] = page;
        this.getProjectEntry(entryRequest);
    }

    /**
     * This method retrieves the entry list for a given account unique name if it does not already exist. 
     *
     * @param {string} accountUniqueName 
     * @memberof RevenueExpenseListComponent
     */
    public currentEntry(accountUniqueName: string): void {
        if (accountUniqueName && !this.accountAndEntryList[accountUniqueName]?.data?.length && this.accountAndEntryList[accountUniqueName].nextPageAvailable) {
            this.searchEntry('', 1, accountUniqueName);
        }
    }

    /**
     * Selects an account from the account search results and updates the form.
     *
     * @param {*} event The selected account object.
     * @memberof RevenueExpenseListComponent
     */
    public selectAccount(accountUniqueName: string): void {
        if (accountUniqueName && this.accountAndEntryList[accountUniqueName] && !this.accountAndEntryList[accountUniqueName].data.length && this.accountAndEntryList[accountUniqueName].nextPageAvailable) {
            this.searchEntry(this.accountAndEntryList[accountUniqueName].query, 1, accountUniqueName);
        }
    }

    /**
     * Cleans up subscriptions and resources when the component is destroyed.
     *
     * @memberof RevenueExpenseListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Toggles the datepicker menu open/close state
     *
     * @param {boolean} isOpen - Whether to open or close the menu
     * @memberof RevenueExpenseListComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (this.universalDatepickerTrigger) {
            if (isOpen) {
                this.universalDatepickerTrigger.openMenu();
            } else {
                this.universalDatepickerTrigger.closeMenu();
            }
        }
    }

    /**
     * Callback function for date/range selection in datepicker
     *
     * @param {*} value - Selected date range value
     * @memberof RevenueExpenseListComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.defaultParamsValue.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.defaultParamsValue.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * Creates a new entry based on the form data and sends the payload to the service.
     *
     * @param {*} value
     * @memberof RevenueExpenseListComponent
     */
    public createEntry(value: number): void {
        this.isCreateAccountValidForm = this.createAccountEntryForm.valid;
        if (this.isCreateAccountValidForm && value > 0) {
            let payload = cloneDeep(this.createAccountEntryForm.value);
            delete payload['account'];
            delete payload['entry'];
            payload['category'] = this.defaultParamsValue.category;
            const requestObject = {
                request: this.defaultParamsValue,
                payload: [payload]
            }
            this.componentStore.createNewEntry(requestObject);
        }
    }

    /**
     * Opens a confirmation dialog for deleting a entry.
     *
     * @param {number} index - entry index.
     * @memberof RevenueExpenseListComponent
     */
    public openDeleteEntryDialog(index: number): void {
        const entryName = this.entryList.at(index).value.entry;
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: '630px',
            data: {
                configuration: this.generalService.deleteConfiguration(this.localeData?.entry_delete_confirmation_message?.replace('[ENTRY_NAME]', entryName), this.commonLocaleData)
            }
        });

        dialogRef.afterClosed().subscribe((response) => {
            if (response === this.commonLocaleData?.app_yes) {
                this.deleteEntry(index);
            }
        });
    }

    /**
     * Deletes an entry at the specified index.
     *
     * @param {number} index The index of the entry to be deleted.
     * @memberof RevenueExpenseListComponent
     */
    public deleteEntry(index: number): void {
        const entryUniqueName = this.entryList.at(index).value.defaultEntryUniqueName;
        if (entryUniqueName) {
            const requestObject = {
                index: index,
                request: this.defaultParamsValue,
                payload: [entryUniqueName]
            }
            this.componentStore.deleteEntry(requestObject);
        }
    }

    /**
     * Updates an entry at the specified index with new form data.
     *
     * @param {number} index The index of the entry to be updated.
     * @memberof RevenueExpenseListComponent
     */
    public updateSingleEntry(index: number): void {
        const payload = cloneDeep(this.entryList.at(index).value);
        const entryUniqueName = payload.entryUniqueName;
        delete payload['account'];
        delete payload['entry'];
        delete payload['defaultEntryUniqueName'];
        payload['category'] = this.defaultParamsValue.category;
        const requestObject = {
            request: { ...this.defaultParamsValue, entryUniqueName: entryUniqueName },
            payload: payload,
            index: index
        }
        this.componentStore.updateEntry(requestObject);
    }

    /**
     * Handles tab changes and navigates to the corresponding route.
     *
     * @param {MatTabChangeEvent} event The tab change event.
     * @memberof RevenueExpenseListComponent
     */
    public tabChanged(event: MatTabChangeEvent): void {
        this.totalResults = 0;
        this.createAccountEntryForm.reset();
        this.accountSearchResponse = [];
        const tab = event.tab.textLabel === this.localeData?.revenue ? this.projectWiseAccountingType.Income : event.tab.textLabel === this.localeData?.expense ? this.projectWiseAccountingType.Expenses : this.projectWiseAccountingType.ProfitLoss;
        this.router.navigate(['pages', 'project-wise-accounting', tab, "list", this.defaultParamsValue.projectUniqueName]);
    }
}
