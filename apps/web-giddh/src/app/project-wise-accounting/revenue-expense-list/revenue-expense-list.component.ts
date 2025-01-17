import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, ReplaySubject, takeUntil, filter, tap, debounceTime, Observable, delay } from 'rxjs';
import { ProjectAccountingComponentStore } from '../project-wise-accounting.store';
import { projectType } from '../project-wise-accounting';
import { cloneDeep } from '../../lodash-optimized';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGE_SIZE_OPTIONS } from '../../vouchers/utility/vouchers.const';
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
    selector: 'revenue-expense-list.',
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
    /** Instance of bootstrap modal */
    public getProjectEntryListRequest: any = {
        count: 50,
        page: 1
    };
    public defaultParamsValue: any = {
        companyUniqueName: '',
        projectUniqueName: '',
        branchUniqueName: '',
        to: '',
        from: '',
        category: ''
    };
    public activeCompany: any;
    public modalRef: BsModalRef;
    public activeTableRowIndex: number = null;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public dataSource: any;
    private isApiCallInProgress = false; // Flag to prevent multiple API calls
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
    /** Selected from date */
    public page: number = 1;
    /** Selected to date */
    public count: number = 10;
    /** Stock Transactional Object */
    public searchRequest: any = {};
    /** Stock search request */
    public stockSearchRequest: any;
    /** Form Group for invoice form */
    public createAccountEntryForm: FormGroup;
    /** Form Group for invoice form */
    public accountEntryListForm: FormGroup;
    public accountSearchResponse: any = [];
    public entrySearchResponse: any;
    /** Holds page Size Options for pagination */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Holds Total Results Count */
    public totalResults: number = 0;
    public isFetchingProjects$: Observable<any> = this.componentStore.isFetchingProjects$;
    public incomeGroup: string = "revenuefromoperations,otherincome";
    public expenseGroup: string = "indirectexpenses,operatingcost";
    public get entryList(): FormArray {
        return this.accountEntryListForm.get('entryList') as FormArray;
    }
    public selectMethod = [
        {
            label: 'PERCENTAGE',
            value: 'PERCENTAGE'
        },
        {
            label: 'VALUE',
            value: 'VALUE'
        }
    ];
    public accountSearchRequest: any = {
        count: 200,
        withStocks: false
    };
    public entrySearchRequest: any = {
        count: 6
    };
    public defaultCount = 6;     //ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT;
    public category = "income";
    /** Index of selected tab */
    public selectedTabIndex: number = 0;


    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private componentStore: ProjectAccountingComponentStore,
        private formBuilder: FormBuilder,
        private router: Router
    ) { }

    public ngOnInit() {
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
                    this.defaultParamsValue.category = params.module === 'revenue' ? "income" : "expenses"
                    this.accountSearchRequest.group = this.defaultParamsValue.category === "income" ? this.incomeGroup : this.expenseGroup;
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                this.selectedTabIndex = this.defaultParamsValue.category === "income" ? 0 : this.defaultParamsValue.category === "expenses" ? 1 : 3;
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

        this.componentStore.entryCreateSuccess$.pipe(takeUntil(this.destroyed$))
            .subscribe(entryCreateSuccess => {
                if (entryCreateSuccess) {
                    this.accountEntryListForm.get('entryList')['controls'].push(this.initEntryListForm(this.createAccountEntryForm.value));
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
                this.isApiCallInProgress = true;
            }
        });

        this.componentStore.entryDeleteSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(entryDeleteSuccess => {
            if (entryDeleteSuccess) {
                this.totalResults -= 1;
                this.entryList.removeAt(entryDeleteSuccess.index);
            }
        });

    }


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


    public initAccountEntryListForm(data?: any): void {
        this.accountEntryListForm = this.formBuilder.group({
            entryList: this.formBuilder.array([])
        })
    }

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

    public getProjectEntry(requestObject: any): void {
        this.componentStore.searchEntry(requestObject);
    }

    public getProjectAccount(requestObject): void {
        this.componentStore.getProjectAccount(requestObject);
    }

    public getEntryList(): void {
        const requestObject = { ...this.defaultParamsValue, ...this.getProjectEntryListRequest };
        this.componentStore.getAllEnteryList(requestObject);
    }
    public handlePageChange(event: any): void {
        this.getProjectEntryListRequest.count = event.pageSize;
        this.getProjectEntryListRequest.page = event.pageIndex + 1;
        this.getEntryList();
    }

    public handleSearchAccountScrollEnd(): void {
        if (this.accountSearchRequest.isLoading) {
            return;
        }
        if (this.defaultCount === this.accountSearchRequest.count) {
            this.searchAccount(this.accountSearchRequest.q, this.accountSearchRequest.page + 1);
        }
    }

    public handleSearchEntryScrollEnd() {
        if (this.entrySearchRequest.isLoading) {
            return;
        }
        if (this.entrySearchRequest.nextPageAvailable) {
            this.searchEntry(this.entrySearchRequest.q, this.entrySearchRequest.page + 1);
        }
    }

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

    public selectAccount(event: any): void {
        if (event) {
            this.createAccountEntryForm.get('account')?.patchValue(event.label);
            this.entrySearchRequest.accountUniqueName = this.createAccountEntryForm.get('accountUniqueName').value;
            this.entrySearchResponse = [];
            this.searchEntry(this.entrySearchRequest.q);
        }
    }

    public ngOnDestroy() {
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

    public createEntry() {
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

    public deleteEntry(index: number): void {
        const entryUniqueName = this.entryList.at(index).value.entryUniqueName;
        const requestObject = {
            index: index,
            request: this.defaultParamsValue,
            payload: [entryUniqueName]
        }
        this.componentStore.deleteEntry(requestObject);
    }

    public updateSingleEntry(index: number) {
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

    public tabChanged(event: any): void {
        const tab = event.tab.textLabel === "Revenue" ? "revenue" : event.tab.textLabel === "Expense" ? "expenses" : "profit-loss";
        this.router.navigate(['pages', 'project-wise-accounting', tab, "list", this.defaultParamsValue.projectUniqueName]);
    }
}
