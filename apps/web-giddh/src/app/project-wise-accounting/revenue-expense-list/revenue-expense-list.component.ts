import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, ReplaySubject, takeUntil, filter, tap, debounceTime, Observable, delay } from 'rxjs';
import { ProjectAccountingComponentStore } from '../project-wise-accounting.store';
import { defaultParamType, projectType } from '../project-wise-accounting';
import { cloneDeep } from '../../lodash-optimized';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGE_SIZE_OPTIONS } from '../../vouchers/utility/vouchers.const';
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
    selector: 'revenue-expense-list',
    styleUrls: ['./revenue-expense-list.component.scss'],
    templateUrl: './revenue-expense-list.component.html',
    providers: [ProjectAccountingComponentStore]
})
export class RevenueExpenseListComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Request parameters for fetching project entries */
    public getProjectEntryListRequest: any = { count: 50, page: 1 };
    /** Default parameters for API requests */
    public defaultParamsValue: defaultParamType = {
        companyUniqueName: '',
        projectUniqueName: '',
        branchUniqueName: '',
        to: '',
        from: '',
        category: ''
    };
    /** Active company details */
    public activeCompany: any;
    /** Reference to the modal instance */
    public modalRef: BsModalRef;
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
    public entrySearchResponse: any;
    /** Pagination options for the table */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Total number of results in the entry list */
    public totalResults: number = 0;
    /** Default result count for account searches */
    public defaultCount = ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT;
    /** Index of the currently selected tab */
    public selectedTabIndex: number = 0;
    /** Income group categories */
    public incomeGroup: string = "revenuefromoperations,otherincome";
    /** Expense group categories */
    public expenseGroup: string = "indirectexpenses,operatingcost";
    /** Getter for the entry list form array */
    public get entryList(): FormArray {
        return this.accountEntryListForm.get('entryList') as FormArray;
    }
    /** Options for selecting calculation method */
    public selectMethod = [
        { label: 'PERCENTAGE', value: 'PERCENTAGE' },
        { label: 'VALUE', value: 'VALUE' }
    ];
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
    public activeRowIndex: number = -1;

    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private componentStore: ProjectAccountingComponentStore,
        private formBuilder: FormBuilder,
        private router: Router
    ) { }

    /**
     * Initializes the component and sets up subscriptions for reactive data streams.
     *
     * @memberof RevenueExpenseListComponent
     */
    public ngOnInit(): void {
        this.initCreateAccountEntryForm();
        this.initAccountEntryListForm();
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
                debounceTime(200),
                filter(([params, activeCompany]) => !!(params.uniqueName && activeCompany)),
                tap(([params, activeCompany]) => {
                    this.defaultParamsValue.projectUniqueName = params.uniqueName;
                    this.defaultParamsValue.companyUniqueName = activeCompany.uniqueName;
                    this.defaultParamsValue.branchUniqueName = this.generalService.currentBranchUniqueName ?? activeCompany.uniqueName;
                    this.defaultParamsValue.category = params.module === 'revenue' ? "income" : params.module;
                    this.accountSearchRequest.group = this.defaultParamsValue.category === "income" ? this.incomeGroup : this.expenseGroup;
                    this.activeCompany = activeCompany;
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                this.selectedTabIndex = this.defaultParamsValue.category === "income" ? 0 : this.defaultParamsValue.category === "expenses" ? 1 : 2;
                if (this.selectedTabIndex <= 1) {
                    if (!this.totalResults) {
                        this.getEntryList();
                    }
                    if (!this.accountSearchRequest.isLoading) {
                        this.searchAccount();
                    }
                }
            });

        this.componentStore.accountSearch$.pipe(takeUntil(this.destroyed$)).subscribe(accountSearchResponse => {
            if (accountSearchResponse) {
                this.accountSearchRequest.count = accountSearchResponse.count;
                accountSearchResponse.results?.forEach(result => {
                    this.accountSearchResponse.push({
                        value: result?.uniqueName,
                        label: result.name,
                        additional: result
                    });
                });
                this.accountSearchRequest.isLoading = false;
            }
        });

        this.componentStore.entrySearch$.pipe(takeUntil(this.destroyed$)).subscribe(entrySearchResponse => {
            if (entrySearchResponse) {
                this.entrySearchRequest.nextPageAvailable = entrySearchResponse.nextPageAvailable;
                entrySearchResponse.transactions?.forEach(result => {
                    this.entrySearchResponse.push({
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
            }
        });

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
            calculationMethod: ['', Validators.required],
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
            value: [data?.value ?? '', Validators.required],
            calculationMethod: [data?.calculationMethod ?? '', Validators.required],
        });
    }

    /**
     * Fetches a list of project entries based on the provided request parameters.
     *
     * @param {*} requestObject The request parameters for fetching project entries.
     * @memberof RevenueExpenseListComponent
     */
    public getProjectEntry(requestObject: any): void {
        this.componentStore.searchEntry(requestObject);
    }

    /**
     * Fetches the list of accounts associated with a project.
     *
     * @param {*} requestObject The request parameters for fetching accounts.
     * @memberof RevenueExpenseListComponent
     */
    public getProjectAccount(requestObject: any): void {
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
     * @param {*} event The pagination event.
     * @memberof RevenueExpenseListComponent
     */
    public handlePageChange(event: any): void {
        this.getProjectEntryListRequest.count = event.pageSize;
        this.getProjectEntryListRequest.page = event.pageIndex + 1;
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
    public handleSearchEntryScrollEnd(): void {
        if (this.entrySearchRequest.isLoading) {
            return;
        }
        if (this.entrySearchRequest.nextPageAvailable) {
            this.searchEntry(this.entrySearchRequest.q, this.entrySearchRequest.page + 1);
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
        if (this.accountSearchRequest.q !== query) {
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
    public searchEntry(query: string = '', page: number = 1): void {
        if (this.entrySearchRequest.q !== query) {
            this.entrySearchResponse = [];
        }
        this.entrySearchRequest.q = query;
        this.entrySearchRequest.isLoading = true;
        this.entrySearchRequest.page = page;

        let entryRequest = { ...this.entrySearchRequest, ...this.defaultParamsValue };
        this.getProjectEntry(entryRequest);
    }

    public currentEntry(accountUniqueName: string) {
        this.entrySearchResponse = [];
        this.entrySearchRequest.accountUniqueName = accountUniqueName;
        if (accountUniqueName.trim() != '') {
            this.searchEntry(this.entrySearchRequest.q);
        }
    }

    /**
     * Selects an account from the account search results and updates the form.
     *
     * @param {*} event The selected account object.
     * @memberof RevenueExpenseListComponent
     */
    public selectAccount(event: any): void {
        if (event) {
            this.createAccountEntryForm.get('account')?.patchValue(event.label);
            // this.entrySearchRequest.accountUniqueName = this.createAccountEntryForm.get('accountUniqueName').value;
            // this.entrySearchResponse = [];
            // this.searchEntry(this.entrySearchRequest.q);
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

    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }


    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }


    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
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
     * @memberof RevenueExpenseListComponent
     */
    public createEntry(): void {
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

    /**
     * Deletes an entry at the specified index.
     *
     * @param {number} index The index of the entry to be deleted.
     * @memberof RevenueExpenseListComponent
     */
    public deleteEntry(index: number): void {
        const entryUniqueName = this.entryList.at(index).value.entryUniqueName;
        const requestObject = {
            index: index,
            request: this.defaultParamsValue,
            payload: [entryUniqueName]
        }
        this.componentStore.deleteEntry(requestObject);
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
        delete payload['account']
        delete payload['entry']
        payload['category'] = this.defaultParamsValue.category;
        const requestObject = {
            request: { ...this.defaultParamsValue, entryUniqueName: entryUniqueName },
            payload: payload,
            index: index,
        }
        this.componentStore.updateEntry(requestObject);
    }

    /**
     * Handles tab changes and navigates to the corresponding route.
     *
     * @param {any} event The tab change event.
     * @memberof RevenueExpenseListComponent
     */
    public tabChanged(event: any): void {
        this.totalResults = 0;
        const tab = event.tab.textLabel === "Revenue" ? "revenue" : event.tab.textLabel === "Expense" ? "expenses" : "profit-loss";
        this.router.navigate(['pages', 'project-wise-accounting', tab, "list", this.defaultParamsValue.projectUniqueName]);
    }
}
