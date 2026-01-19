import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { BehaviorSubject, Observable, ReplaySubject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { API_BULK_FETCH_LIMIT, BranchHierarchyType, SAMPLE_FILES_URL, IOption } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';
import { cloneDeep, find, forEach, map, some } from '../../lodash-optimized';
import { LedgerComponentStore } from '../../ledger/ledger.store';
import { VoucherType } from '../../ledger/components/import-statement/import-statement.const';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
    providers: [LedgerComponentStore], // Commented out due to missing import
    standalone: false
})

/**
 * UploadFileComponent component
 * Handles uploadfile functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toasterService: ToasterService,
        private activatedRoute: ActivatedRoute,
        private settingsBranchAction: SettingsBranchActions,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private router: Router,
        private ledgerComponentStore: LedgerComponentStore // Commented out due to missing import
    ) {

    }

    /**
     * Handles filechange event
     */
    public onFileChange(file: FileList) {
        let validExts = ['csv', 'xls', 'xlsx'];
        let type = (file && file.item(0)) ? this.getExt(file.item(0).name) : 'null';
        let isValidFileType = validExts.some(s => type === s);

        /**
         * Handles if functionality
         */
        if (!isValidFileType) {
            this.toasterService.errorToast(this.localeData?.invalid_file_type);
            this.selectedFileName = '';
            this.file = null;
            return;
        }

        this.file = file.item(0);
        /**
         * Handles if functionality
         */
        if (this.file) {
            this.selectedFileName = this.file.name;
        } else {
            this.selectedFileName = '';
        }
    }

    /**
     * Handles downloadSampleFile functionality
     */
    public async downloadSampleFile(entity: string, isCsv: boolean = false) {
        const fileUrl = SAMPLE_FILES_URL + `${entity}.${isCsv ? 'csv' : 'xlsx'}`;
        const fileName = `${entity}-sample.${isCsv ? 'csv' : 'xlsx'}`;
        try {
            let blob = await fetch(fileUrl).then(r => r.blob());
            /**
             * Saves as data
             */
            saveAs(blob, fileName);
        } catch (e) {
            console.log('error while downloading sample file :', e);
        }
    }

    /**
     * Retrieves ext data
     */
    public getExt(path) {
        /**
         * Handles return functionality
         */
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
            /**
             * Handles if functionality
             */
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            /**
             * Handles if functionality
             */
            if (data) {
                this.entity = data.type;
                this.setTitle();
                /**
                 * Handles if functionality
                 */
                if (this.entity === this.voucherType.AccountWise && !this.accountSearchRequest.isLoading) {
                    this.searchAccount();
                }
                /**
                 * Handles if functionality
                 */
                if (this.entity === "banktransactions") {
                    this.router.navigate(['/pages/import/select-type']);
                }
            }
        });
        this.setTitle();
        this.store.pipe(
            /**
             * Handles select functionality
             */
            select(state => state.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            /**
             * Handles if functionality
             */
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
                /**
                 * Handles if functionality
                 */
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                }
            } else {
                /**
                 * Handles if functionality
                 */
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });

        this.ledgerComponentStore.accountSearch$.pipe(takeUntil(this.destroyed$)).subscribe(accountSearchResponse => {
            /**
             * Handles if functionality
             */
            if (accountSearchResponse) {
                this.accountSearchRequest.count = accountSearchResponse.count;
                const currentOptions = this.accountSearchResponseSubject.value;
                const newOptions = [...currentOptions];

                accountSearchResponse.results?.forEach(result => {
                    /**
                     * Handles if functionality
                     */
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
    }

    /**
     * Sets the title of the page according to type of entity
     *
     * @memberof UploadFileComponent
     */
    public setTitle(): void {
        /**
         * Handles if functionality
         */
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
        this.onFileUpload.emit({
            file,
            branchUniqueName: this.entity === 'entries' && this.currentBranch ? this.currentBranch?.uniqueName : '',
            isHeaderProvided: this.isHeaderProvided,
            accountUniqueName: this.accountUniqueName,
            selectVoucher: this.selectVoucher
        });
    }

    /**
    * Searches for accounts based on the query and updates the account search results.
    *
    * @param {string} [query=''] The search query.
    * @param {number} [page=1] The page number for paginated results.
    * @memberof UploadFileComponent
    */
    public searchAccount(query: string = '', page: number = 1): void {
        /**
         * Handles if functionality
         */
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
        this.ledgerComponentStore.getProjectAccount(requestObject); // Commented out due to missing import
    }

    /**
     * Handles infinite scroll for account search by fetching the next page of results.
     *
     * @memberof UploadFileComponent
     */
    public handleSearchAccountScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.accountSearchRequest.isLoading) {
            return;
        }
        /**
         * Handles if functionality
         */
        if (this.defaultCount === this.accountSearchRequest.count) {
            this.searchAccount(this.accountSearchRequest.q, this.accountSearchRequest.page + 1);
        }
    }
}
