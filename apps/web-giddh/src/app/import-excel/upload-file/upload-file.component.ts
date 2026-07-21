import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { BehaviorSubject, Observable, ReplaySubject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { API_BULK_FETCH_LIMIT, ASIDE_PANE_CONFIG, BranchHierarchyType, SAMPLE_FILES_URL, IOption } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';
import { cloneDeep, find, forEach, map, some } from '../../lodash-optimized';
import { LedgerComponentStore } from '../../ledger/ledger.store';
import { VoucherType } from '../../ledger/components/import-statement/import-statement.const';
import { LedgerService } from '../../services/ledger.service';
import { ImportExcelService } from '../../services/import-excel.service';
import { CommonActions } from '../../actions/common.actions';
import { FileTypeEnum } from '../../shared/Enums/common.enum';
import { GenericAsideMenuAccountComponent } from '../../shared/generic-aside-menu-account/generic.aside.menu.account.component';
import { AccountsAction } from '../../actions/accounts.actions';

@Component({
    selector: 'upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
    providers: [LedgerComponentStore], // Commented out due to missing import
    standalone: false
})

export class UploadFileComponent implements OnInit, OnDestroy {
    @Input() public isLoading: boolean;
    @Input() public entity: string;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public onFileUpload = new EventEmitter();
    public file: File = null;
    public selectedFileName: string = '';
    public selectedType: string = '';
    public title: string;

    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = {
        name: '',
        uniqueName: ''
    };
    /** Stores the current company */
    public activeCompany: any;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;

    /** Subject to unsubscribe all the listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isHeaderProvided: boolean = true;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Default result count for account searches */
    public defaultCount: number = API_BULK_FETCH_LIMIT;
    /** Stores account unique name */
    public accountUniqueName: string;
    /** BehaviorSubject to store the search results for accounts */
    private accountSearchResponseSubject = new BehaviorSubject<IOption[]>([]);
    /** Observable for account search results used in template with async pipe */
    public accountSearchResponse$: Observable<IOption[]> = this.accountSearchResponseSubject.asObservable();
    /** Stores account name */
    public accountLabel: string = "";
    /** Request parameters for account searches */
    public accountSearchRequest: any = {
        count: this.defaultCount,
        withStocks: false
    };
    /** Stores select voucher name */
    public selectVoucher: string = "";
    /** Stores the voucher response */
    public voucherListResponse: IOption[] = [];
    /** Holds a reference to the `VoucherType` enum */
    public voucherType: typeof VoucherType = VoucherType; // Commented out due to missing import/
    /** Password for encrypted PDF bank statements */
    public bankStatementPassword: string = '';
    /** File type enum for detecting PDF */
    public fileType: typeof FileTypeEnum = FileTypeEnum;
    /** Selected file extension */
    public selectedFileExtension: string = '';
    /** Same debit credit column toggle for bank statement */
    public sameDebitCreditAmountColumn: boolean = false;
    /** Dialog reference for the account aside pane */
    private accountAsideMenuRef: MatDialogRef<any>;
    /** Template reference for account aside menu */
    @ViewChild('accountAsideMenu') public accountAsideMenu: any;
    /** Observable for account creation success */
    private createAccountIsSuccess$: Observable<boolean>;

    constructor(
        private toasterService: ToasterService,
        private activatedRoute: ActivatedRoute,
        private settingsBranchAction: SettingsBranchActions,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private router: Router,
        private ledgerComponentStore: LedgerComponentStore,
        private ledgerService: LedgerService,
        private importExcelService: ImportExcelService,
        private commonAction: CommonActions,
        private dialog: MatDialog,
        private accountsAction: AccountsAction
    ) {

    }

    public onFileChange(file: FileList) {
        let validExts = ['csv', 'xls', 'xlsx'];
        if (this.entity === this.voucherType.BankStatement) {
            validExts = ['csv', 'xls', 'xlsx', 'pdf'];
        }
        let type = (file && file.item(0)) ? this.getExt(file.item(0).name) : 'null';
        let isValidFileType = validExts.some(s => type === s);

        if (!isValidFileType) {
            this.toasterService.errorToast(this.localeData?.invalid_file_type);
            this.selectedFileName = '';
            this.file = null;
            return;
        }

        this.file = file.item(0);
        if (this.file) {
            this.selectedFileName = this.file.name;
            this.selectedFileExtension = type;
        } else {
            this.selectedFileName = '';
            this.selectedFileExtension = '';
        }
    }

    public async downloadSampleFile(entity: string, isCsv: boolean = false) {
        const sampleEntity = entity === this.voucherType.BankStatement ? 'bank-transaction' : entity;
        const fileUrl = SAMPLE_FILES_URL + `${sampleEntity}.${isCsv ? 'csv' : 'xlsx'}`;
        const fileName = `${sampleEntity}-sample.${isCsv ? 'csv' : 'xlsx'}`;
        try {
            let blob = await fetch(fileUrl).then(r => r.blob());
            saveAs(blob, fileName);
        } catch (e) {
            console.log('error while downloading sample file :', e);
        }
    }

    public getExt(path) {
        return (path.match(/(?:.+..+[^\/]+$)/ig) != null) ? path.split('.').pop(-1) : 'null';
    }

    /**
     * Initializes the component
     *
     * @memberof UploadFileComponent
     */

    public ngOnInit(): void {
        this.voucherListResponse = this.generalService.getVoucherTypeList(this.commonLocaleData, ['sales', 'purchase', 'receipt', 'payment', 'journal', 'contra', 'debit note', 'credit note', 'advance-receipt']);
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data) {
                this.entity = data.type;
                this.setTitle();
                if (this.entity === this.voucherType.AccountWise && !this.accountSearchRequest.isLoading) {
                    this.searchAccount();
                }
                if (this.entity === this.voucherType.BankStatement && !this.accountSearchRequest.isLoading) {
                    this.searchAccount();
                }
            }
        });
        this.setTitle();
        this.store.pipe(
            select(state => state.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.name,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                const hoBranch = response.find(branch => !branch.parentBranch);
                const currentBranchUniqueName = this.currentOrganizationType === OrganizationType.Branch ? this.generalService.currentBranchUniqueName : hoBranch ? hoBranch?.uniqueName : '';
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });

        this.ledgerComponentStore.accountSearch$.pipe(takeUntil(this.destroyed$)).subscribe(accountSearchResponse => {
            if (accountSearchResponse) {
                this.accountSearchRequest.count = accountSearchResponse.count;
                const currentOptions = this.accountSearchResponseSubject.value;
                const newOptions = [...currentOptions];

                accountSearchResponse.results?.forEach(result => {
                    if (result?.uniqueName) {
                        newOptions.push({
                            value: result.uniqueName,
                            label: result.name
                        });
                    }
                });

                this.accountSearchResponseSubject.next(newOptions);
                this.accountSearchRequest.isLoading = false;
            }
        });

        // Subscribe to account creation success to refresh account list
        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$.subscribe(response => {
            if (response) {
                this.searchAccount('', 1);
            }
        });
    }

    /**
     * Sets the title of the page according to type of entity
     *
     * @memberof UploadFileComponent
     */
    public setTitle(): void {
        if (this.entity === 'group') {
            this.title = this.localeData?.groups;
        } else if (this.entity === 'account') {
            this.title = this.localeData?.accounts;
        } else if (this.entity === 'stock') {
            this.title = this.localeData?.inventories;
        } else if (this.entity === 'trial-balance') {
            this.title = this.localeData?.trial_balances;
        } else {
            this.title = this.entity;
        }
    }

    /**
     * Unsubscribes from all the listeners
     *
     * @memberof UploadFileComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.accountSearchResponseSubject.complete();
    }

    /**
     * Branch change handler
     *
     * @memberof UploadFileComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
    }

    /**
     * File upload handler
     *
     * @param {File} file File uploaded
     * @memberof UploadFileComponent
     */
    public handleFileUpload(file: File): void {
        if (this.entity === this.voucherType.BankStatement) {
            this.handleBankStatementUpload(file);
            return;
        }
        this.onFileUpload.emit({
            file,
            branchUniqueName: this.entity === 'entries' && this.currentBranch ? this.currentBranch?.uniqueName : '',
            isHeaderProvided: this.isHeaderProvided,
            accountUniqueName: this.accountUniqueName,
            selectVoucher: this.selectVoucher
        });
    }

    /**
     * Handles bank statement upload (backstatement entity).
     * - PDF: direct import via ledgerService.importStatement then redirect to ledger.
     * - CSV/XLS/XLSX: upload via importExcelService for mapping, then redirect to wizard mapping page.
     *
     * @param {File} file The selected file
     * @memberof UploadFileComponent
     */
    private handleBankStatementUpload(file: File): void {
        const ext = (this.selectedFileExtension || '').toLowerCase();
        const isPdf = ext === this.fileType.PDF;
        const getRequest: any = {
            entity: ext,
            companyUniqueName: this.generalService.companyUniqueName,
            accountUniqueName: this.accountUniqueName
        };
        const postRequest: any = {
            file,
            password: this.bankStatementPassword,
            isHeaderProvided: this.isHeaderProvided,
            accountUniqueName: this.accountUniqueName,
            sameDebitCreditAmountColumn: this.sameDebitCreditAmountColumn
        };

        if (isPdf) {
            this.ledgerService.importStatement(getRequest, postRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === 'success') {
                    this.toasterService.successToast(this.localeData?.import_success || 'Import successful');
                    this.router.navigate(['/pages', 'ledger', this.accountUniqueName]);
                } else {
                    this.toasterService.errorToast(response?.message);
                }
            });
        } else {
            this.importExcelService.uploadFile('BANK_TRANSACTIONS_IMPORT', postRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === 'success' && response.body) {
                    this.store.dispatch(this.commonAction.setImportBankTransactionsResponse(response.body));
                } else {
                    this.toasterService.errorToast(response?.message);
                }
            });
        }
    }

    /**
    * Searches for accounts based on the query and updates the account search results.
    *
    * @param {string} [query=''] The search query.
    * @param {number} [page=1] The page number for paginated results.
    * @memberof UploadFileComponent
    */
    public searchAccount(query: string = '', page: number = 1): void {
        if (page === 1) {
            this.accountSearchResponseSubject.next([]);
        }
        this.accountSearchRequest.q = query;
        this.accountSearchRequest.page = page;
        this.accountSearchRequest.isLoading = true;

        let requestObject = cloneDeep(this.accountSearchRequest);
        requestObject.isLoading = undefined;
        this.getProjectAccount(requestObject);
    }

    /**
    * Fetches the list of accounts associated with a project.
    *
    * @param {*} requestObject The request parameters for fetching accounts.
    * @memberof UploadFileComponent
    */
    public getProjectAccount(requestObject: any): void {
        requestObject.count = this.defaultCount;
        if (this.entity === this.voucherType.BankStatement) {
            requestObject.group = 'bankaccounts';
        }
        this.ledgerComponentStore.getProjectAccount(requestObject); // Commented out due to missing import
    }

    /**
     * Handles infinite scroll for account search by fetching the next page of results.
     *
     * @memberof UploadFileComponent
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
     * Opens the account creation dialog for creating a new bank account.
     *
     * @memberof UploadFileComponent
     */
    public createNewAccount(): void {
        this.accountAsideMenuRef = this.dialog.open(this.accountAsideMenu, ASIDE_PANE_CONFIG);

        this.accountAsideMenuRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.accountAsideMenuRef = undefined;
        });
    }

    /**
     * Handles the add event from the account aside menu.
     *
     * @param {AddAccountRequest} event
     * @memberof UploadFileComponent
     */
    public addNewAccount(event: any): void {
        this.store.dispatch(this.accountsAction.createAccountV2(event.activeGroupUniqueName, event.accountRequest));
        this.accountAsideMenuRef.close();
    }
}
