import { Observable, of, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { AccountFlat, BulkEmailRequest, SearchDataSet, SearchRequest } from '../../../models/api-models/Search';
import { AppState } from '../../../store';
import { saveAs } from 'file-saver';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CompanyService } from '../../../services/companyService.service';
import { ToasterService } from '../../../services/toaster.service';
import { map, take, takeUntil } from 'rxjs/operators';
import { GeneralService } from '../../../services/general.service';
import { cloneDeep } from '../../../lodash-optimized';

@Component({
    selector: 'search-grid',
    templateUrl: './search-grid.component.html'
})
export class SearchGridComponent implements OnInit, OnDestroy {
    @Output() public pageChangeEvent: EventEmitter<any> = new EventEmitter(null);
    @Output() public FilterByAPIEvent: EventEmitter<any> = new EventEmitter(null);
    /** Stores the current branch unique name */
    @Input() public currentBranchUniqueName: string;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public dayjs = dayjs;
    public companyUniqueName: string;
    public searchResponse$: Observable<AccountFlat[]>;
    public searchResponseFiltered$: Observable<AccountFlat[]>;
    public searchLoader$: Observable<boolean>;
    public search$: Observable<boolean>;
    public messageBody = {
        header: {
            email: 'Send Email',
            sms: 'Send Sms',
            set: ''
        },
        btn: {
            email: 'Send Email',
            sms: 'Send Sms',
            set: '',
        },
        type: '',
        msg: '',
        subject: ''
    };
    public dataVariables = [
        {
            name: 'Opening Balance',
            value: '%s_OB',
        },
        {
            name: 'Closing Balance',
            value: '%s_CB',
        },
        {
            name: 'Credit Total',
            value: '%s_CT',
        },
        {
            name: 'Debit Total',
            value: '%s_DT',
        },
        {
            name: 'From Date',
            value: '%s_FD',
        },
        {
            name: 'To Date',
            value: '%s_TD',
        },
        {
            name: 'Magic Link',
            value: '%s_ML',
        },
        {
            name: 'Account Name',
            value: '%s_AN',
        },
    ];
    @ViewChild('mailModal', { static: true }) public mailModal: ModalDirective;
    @ViewChild('messageBox', { static: true }) public messageBox: ElementRef;
    public searchRequest$: Observable<SearchRequest>;
    public isAllChecked: boolean = false;
    public get sortReverse(): boolean {
        return this._sortReverse;
    }

    /**
     * reversing sort
     *
     * @memberof SearchGridComponent
     */
    public set sortReverse(value: boolean) {
        this._sortReverse = value;
        this.searchResponseFiltered$ = this.searchResponseFiltered$.pipe(map(p => cloneDeep(p).sort((a, b) => (value ? -1 : 1) * a[this._sortType]?.toString().localeCompare(b[this._sortType]))));
    }

    /** pagination related  */
    public page: number;
    public totalPages: number;
    public selectedItems: string[] = [];
    private _sortReverse: boolean;
    private _sortType: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private checkboxInfo: any = {
        selectedPage: 1
    };
    private formattedQuery: any;

    constructor(private store: Store<AppState>, private companyServices: CompanyService, private toaster: ToasterService, private generalService: GeneralService) {
        this.searchResponse$ = this.store.pipe(select(p => p.search?.value), takeUntil(this.destroyed$));
        this.searchResponse$.subscribe(p => this.searchResponseFiltered$ = this.searchResponse$);
        this.searchLoader$ = this.store.pipe(select(p => p.search.searchLoader), takeUntil(this.destroyed$));
        this.search$ = this.store.pipe(select(p => p.search.search), takeUntil(this.destroyed$));
        this.searchRequest$ = this.store.pipe(select(p => p.search.searchRequest), takeUntil(this.destroyed$));
        this.store.pipe(select(p => p.session.companyUniqueName), take(1)).subscribe(p => this.companyUniqueName = p);
        this.store.pipe(select(p => p.search.searchPaginationInfo), takeUntil(this.destroyed$)).subscribe((info) => {
            this.page = info.page;
            this.totalPages = info.totalPages;
        });
    }

    public set sortType(value: string) {
        this._sortType = value;
        this.sortReverse = this._sortReverse;
    }

    public ngOnInit() {
        this.sortType = 'name';
        this.searchRequest$.subscribe((req) => {
            if (req && req.groupName) {
                if (!this.checkboxInfo.selectedGroup) {
                    this.checkboxInfo.selectedGroup = req.groupName;
                } else if (this.checkboxInfo.selectedGroup !== req.groupName) {
                    this.checkboxInfo = {
                        selectedPage: 1
                    };
                    this.selectedItems = [];
                    this.isAllChecked = false;
                }
            }
        });

        this.messageBody = {
            header: {
                email: this.commonLocaleData?.app_send_email,
                sms: this.commonLocaleData?.app_send_sms,
                set: ''
            },
            btn: {
                email: this.commonLocaleData?.app_send_email,
                sms: this.commonLocaleData?.app_send_sms,
                set: '',
            },
            type: '',
            msg: '',
            subject: ''
        }

        this.dataVariables = [
            {
                name: this.localeData?.email_variables.opening_balance,
                value: '%s_OB',
            },
            {
                name: this.localeData?.email_variables.closing_balance,
                value: '%s_CB',
            },
            {
                name: this.localeData?.email_variables.credit_total,
                value: '%s_CT',
            },
            {
                name: this.localeData?.email_variables.debit_total,
                value: '%s_DT',
            },
            {
                name: this.localeData?.email_variables.from_date,
                value: '%s_FD',
            },
            {
                name: this.localeData?.email_variables.to_date,
                value: '%s_TD',
            },
            {
                name: this.localeData?.email_variables.magic_link,
                value: '%s_ML',
            },
            {
                name: this.localeData?.email_variables.account_name,
                value: '%s_AN',
            },
        ];
    }

    public toggleSelectAll(ev) {
        let isAllChecked = ev.target.checked;
        this.checkboxInfo[this.checkboxInfo.selectedPage] = isAllChecked;

        this.searchResponseFiltered$.pipe(take(1)).subscribe(p => {
            let entries = cloneDeep(p);
            this.isAllChecked = isAllChecked;

            entries.forEach((entry) => {
                let indexOfEntry = this.selectedItems?.indexOf(entry?.uniqueName);
                if (isAllChecked) {
                    if (indexOfEntry === -1) {
                        this.selectedItems.push(entry?.uniqueName);
                    }
                } else if (indexOfEntry > -1) {
                    this.selectedItems.splice(indexOfEntry, 1);
                }
            });
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Filter data of table By Filters
     *
     * @param {SearchDataSet[]} searchQuery
     * @memberof SearchGridComponent
     */
    public filterData(searchQuery: SearchDataSet[]) {
        let queryForApi = this.createSearchQueryReqObj();
        let formattedQuery = this.formatQuery(queryForApi, searchQuery);
        this.formattedQuery = formattedQuery;
        this.FilterByAPIEvent.emit(formattedQuery);
    }

    /**
     * Reset Filters and show all
     *
     * @param {*} isFiltered
     * @memberof SearchGridComponent
     */
    public resetFilters(isFiltered) {
        if (!isFiltered) {
            this.searchResponseFiltered$ = this.searchResponse$;
            this.FilterByAPIEvent.emit(null);
            this.pageChangeEvent.emit(1);
        }
    }

    /**
     * CSV Headers
     *
     * @memberof SearchGridComponent
     */
    public getCSVHeader = () => [
        'Name',
        'UniqueName',
        'Opening Bal.',
        'O/B Type',
        'DR Total',
        'CR Total',
        'Closing Bal.',
        'C/B Type',
        'Parent'
    ];

    /**
     * Rounding numbers
     *
     * @memberof SearchGridComponent
     */
    public roundNum = (data, places) => {
        data = Number(data);
        data = data.toFixed(places);
        return data;
    }

    /**
     * Save CSV File with data from Table...
     *
     * @param {SearchDataSet[]} searchQuery
     * @memberof SearchGridComponent
     */
    public createCSV(searchQuery: SearchDataSet[]) {
        let queryForApi = this.createSearchQueryReqObj();
        let formattedQuery = this.formatQuery(queryForApi, searchQuery);

        // New logic (download CSV from API)
        this.searchLoader$ = of(true);
        this.searchRequest$.pipe(take(1)).subscribe(p => {
            if (!p) {
                return;
            }
            let request: BulkEmailRequest = {
                data: {
                    subject: this.messageBody.subject,
                    message: this.messageBody.msg,
                    accounts: [],
                },
                params: {
                    from: p.fromDate,
                    to: p.toDate,
                    groupUniqueName: p.groupName
                },
                branchUniqueName: this.currentBranchUniqueName
            };

            request.data = Object.assign({}, request.data, formattedQuery);

            this.companyServices.downloadCSV(request).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.searchLoader$ = of(false);
                if (res?.status === 'success') {
                    let blobData = this.generalService.base64ToBlob(res?.body, 'text/csv', 512);
                    return saveAs(blobData, `${p.groupName}.csv`);
                }
            });

        });
    }

    /**
     * Add Selected Value to Message Body
     *
     * @param {*} val
     * @memberof SearchGridComponent
     */
    public addValueToMsg(val: any): void {
        this.typeInTextarea(val?.value);
    }

    public typeInTextarea(newText) {
        let el: HTMLInputElement = this.messageBox?.nativeElement;
        let start = el.selectionStart;
        let end = el.selectionEnd;
        let text = el?.value;
        let before = text.substring(0, start);
        let after = text.substring(end, (text ? text.length : 0));
        el.value = (before + newText + after);
        el.selectionStart = el.selectionEnd = start + (newText ? newText.length : 0);
        el.focus();
        this.messageBody.msg = el?.value;
    }

    /**
     * Open Modal for Email
     *
     * @memberof SearchGridComponent
     */
    public openEmailDialog() {
        this.messageBody.msg = '';
        this.messageBody.subject = '';
        this.messageBody.type = 'Email';
        this.messageBody.btn.set = this.messageBody.btn.email;
        this.messageBody.header.set = this.messageBody.header.email;
        this.mailModal.show();
    }

    /**
     * Open Modal for SMS
     *
     * @memberof SearchGridComponent
     */
    public openSmsDialog() {
        this.messageBody.msg = '';
        this.messageBody.type = 'sms';
        this.messageBody.btn.set = this.messageBody.btn.sms;
        this.messageBody.header.set = this.messageBody.header.sms;
        this.mailModal.show();
    }

    public toggleSelection(ev, item: AccountFlat) {
        let isChecked = ev.target.checked;
        let indexOfEntry = this.selectedItems?.indexOf(item?.uniqueName);
        if (isChecked && indexOfEntry === -1) {
            this.selectedItems.push(item?.uniqueName);
        } else {
            this.selectedItems.splice(indexOfEntry, 1);
            this.checkboxInfo[this.checkboxInfo.selectedPage] = false;
            this.isAllChecked = false;
        }
    }

    /**
     * Send Email/Sms for Accounts
     *
     * @memberof SearchGridComponent
     */
    public async send() {
        let accountsUnqList = [];

        await this.searchResponseFiltered$.pipe(take(1)).subscribe(p => {
            accountsUnqList = [];
            p.forEach((item: AccountFlat) => {
                if (item.isSelected) {
                    accountsUnqList.push(item?.uniqueName);
                }
            });
        });

        this.searchRequest$.pipe(take(1)).subscribe(p => {
            if (!p) {
                return;
            }
            let request: BulkEmailRequest = {
                data: {
                    subject: this.messageBody.subject,
                    message: this.messageBody.msg,
                    accounts: this.selectedItems,
                },
                params: {
                    from: p.fromDate,
                    to: p.toDate,
                    groupUniqueName: p.groupName
                }
            };

            request.data = Object.assign({}, request.data, this.formattedQuery);

            if (this.messageBody.btn.set === this.commonLocaleData?.app_send_email) {
                return this.companyServices.sendEmail(request).pipe(takeUntil(this.destroyed$))
                    .subscribe((r) => {
                        r?.status === 'success' ? this.toaster.successToast(r?.body) : this.toaster.errorToast(r?.message);
                        this.checkboxInfo = {
                            selectedPage: 1
                        };
                    });
            } else if (this.messageBody.btn.set === this.commonLocaleData?.app_send_sms) {
                let temp = request;
                delete temp.data['subject'];
                return this.companyServices.sendSms(temp).pipe(takeUntil(this.destroyed$))
                    .subscribe((r) => {
                        r?.status === 'success' ? this.toaster.successToast(r?.body) : this.toaster.errorToast(r?.message);
                        this.checkboxInfo = {
                            selectedPage: 1
                        };
                    });
            }
        });
        this.mailModal.hide();
    }

    public pageChanged(ev) {
        this.checkboxInfo.selectedPage = ev.page;
        this.pageChangeEvent.emit(ev);
        this.isAllChecked = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
    }

    private createSearchQueryReqObj() {
        return {
            openingBalance: null,
            openingBalanceGreaterThan: false,
            openingBalanceLessThan: false,
            openingBalanceEqual: false,
            openingBalanceType: 'DEBIT',
            closingBalance: null,
            closingBalanceGreaterThan: false,
            closingBalanceLessThan: false,
            closingBalanceEqual: false,
            closingBalanceType: 'DEBIT',
            creditTotal: null,
            creditTotalGreaterThan: false,
            creditTotalLessThan: false,
            creditTotalEqual: false,
            debitTotal: null,
            debitTotalGreaterThan: false,
            debitTotalLessThan: false,
            debitTotalEqual: false
        };
    }

    private formatQuery(queryForApi, searchQuery) {
        searchQuery.forEach((query: SearchDataSet) => {
            switch (query.queryType) {
                case 'openingBalance':
                    queryForApi['openingBalance'] = query.amount,
                        queryForApi['openingBalanceGreaterThan'] = query.queryDiffer === 'Greater' ? true : false,
                        queryForApi['openingBalanceLessThan'] = query.queryDiffer === 'Less' ? true : false,
                        queryForApi['openingBalanceEqual'] = query.queryDiffer === 'Equals' ? true : false;
                    queryForApi['openingBalanceType'] = query.openingBalanceType === 'DEBIT' ? 'DEBIT' : 'CREDIT';
                    break;
                case 'closingBalance':
                    queryForApi['closingBalance'] = query.amount,
                        queryForApi['closingBalanceGreaterThan'] = query.queryDiffer === 'Greater' ? true : false,
                        queryForApi['closingBalanceLessThan'] = query.queryDiffer === 'Less' ? true : false,
                        queryForApi['closingBalanceEqual'] = query.queryDiffer === 'Equals' ? true : false;
                    queryForApi['closingBalanceType'] = query.closingBalanceType === 'DEBIT' ? 'DEBIT' : 'CREDIT';
                    break;
                case 'creditTotal':
                    queryForApi['creditTotal'] = query.amount,
                        queryForApi['creditTotalGreaterThan'] = query.queryDiffer === 'Greater' ? true : false,
                        queryForApi['creditTotalLessThan'] = query.queryDiffer === 'Less' ? true : false,
                        queryForApi['creditTotalEqual'] = query.queryDiffer === 'Equals' ? true : false;
                    break;
                case 'debitTotal':
                    queryForApi['debitTotal'] = query.amount,
                        queryForApi['debitTotalGreaterThan'] = query.queryDiffer === 'Greater' ? true : false,
                        queryForApi['debitTotalLessThan'] = query.queryDiffer === 'Less' ? true : false,
                        queryForApi['debitTotalEqual'] = query.queryDiffer === 'Equals' ? true : false;
                    break;
            }
        });
        return queryForApi;
    }
}
