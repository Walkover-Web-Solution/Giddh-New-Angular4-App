import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActionPettycashRequest, ExpenseActionRequest, ExpenseResults, PettyCashResonse } from '../../../models/api-models/Expences';
import { ToasterService } from '../../../services/toaster.service';
import { ExpenseService } from '../../../services/expences.service';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { IForceClear } from '../../../models/api-models/Sales';
import { UploaderOptions, UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';
import { Configuration } from '../../../app.constant';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { DownloadLedgerAttachmentResponse } from '../../../models/api-models/Ledger';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { TaxResponse } from '../../../models/api-models/Company';
import { UpdateLedgerEntryPanelComponent } from '../../../ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { cloneDeep } from '../../../lodash-optimized';
import { SearchService } from '../../../services/search.service';

@Component({
    selector: 'app-expense-details',
    templateUrl: './expense-details.component.html',
    styleUrls: ['./expense-details.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class ExpenseDetailsComponent implements OnInit, OnChanges, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public modalRef: BsModalRef;
    public approveEntryModalRef: BsModalRef;
    public message: string;
    public actionPettyCashRequestBody: ExpenseActionRequest;
    @Output() public toggleDetailsMode: EventEmitter<boolean> = new EventEmitter();
    @Output() public selectedDetailedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
    /** This will emit true if we need to show next record in preview */
    @Output() public previewNextItem: EventEmitter<boolean> = new EventEmitter();
    @Input() public selectedRowItem: any;
    @ViewChild(UpdateLedgerEntryPanelComponent, { static: false }) public updateLedgerComponentInstance: UpdateLedgerEntryPanelComponent;
    @ViewChild('entryAgainstAccountDropDown', { static: false }) public entryAgainstAccountDropDown: ShSelectComponent;
    public selectedItem: ExpenseResults;
    public rejectReason = new FormControl();
    public actionPettycashRequest: ActionPettycashRequest = new ActionPettycashRequest();
    public imgAttached: boolean = false;
    public imgUploadInprogress: boolean = false;
    public isImageZoomView: boolean = false;
    public fileUploadOptions: UploaderOptions;
    public uploadInput: EventEmitter<UploadInput>;
    public sessionId$: Observable<string>;
    public companyUniqueName$: Observable<string>;
    public files: UploadFile[];
    public imageURL: string[] = [];
    public companyUniqueName: string;
    public signatureSrc: string = '';
    public zoomViewImageSrc: string = '';
    public asideMenuStateForOtherTaxes: string = 'out';
    public accountType: string;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public DownloadAttachedImgResponse: DownloadLedgerAttachmentResponse[] = [];
    public comment: string = '';
    public accountEntryPettyCash: PettyCashResonse;
    public companyTaxesList: TaxResponse[] = [];
    public debtorsAccountsOptions: IOption[] = [];
    public creditorsAccountsOptions: IOption[] = [];
    public cashAndBankAccountsOptions: IOption[] = [];
    public entryAgainstObject = {
        base: '',
        against: '',
        dropDownOption: [],
        model: '',
        name: ''
    };
    public approveEntryRequestInProcess: boolean = false;
    public selectedEntryForApprove: ExpenseResults;
    /** unique name of any attached image   */
    public imgAttachedFileName = '';
    /** Stores the search results pagination details for debtor dropdown */
    public debtorAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for debtor dropdown */
    public defaultDebtorAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for debtor dropdown */
    public preventDefaultDebtorScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for debtor dropdown */
    public defaultDebtorAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the search results pagination details for creditor dropdown */
    public creditorAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for creditor dropdown */
    public defaultCreditorAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for creditor dropdown */
    public preventDefaultCreditorScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for creditor dropdown */
    public defaultCreditorAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the search results pagination details for cash/bank dropdown */
    public cashBankAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for cash/bank dropdown */
    public defaultCashBankAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for cash/bank dropdown */
    public preventDefaultCashBankScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for cash/bank dropdown */
    public defaultCashBankAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold creator name */
    public byCreator: string = '';
    /** True if account belongs to cash/bank account */
    private cashOrBankEntry: any;
    /** Stores the petty cash entry type */
    private pettyCashEntryType: string;
    /** True if api call in progress */
    public isPettyCashEntryLoading: boolean = false;

    constructor(
        private modalService: BsModalService,
        private toasty: ToasterService,
        private ledgerActions: LedgerActions,
        private store: Store<AppState>,
        private expenseService: ExpenseService,
        private searchService: SearchService
    ) {
        this.files = [];
        this.uploadInput = new EventEmitter<UploadInput>();
        this.sessionId$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
    }

    public openModal(RejectionReason: TemplateRef<any>) {
        this.modalRef = this.modalService.show(RejectionReason, { class: 'modal-md' });
    }

    public ngOnInit() {
        this.fileUploadOptions = { concurrency: 1, allowedContentTypes: ['image/png', 'image/jpeg'] };
        this.store.pipe(select(state => state.company && state.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
        });
        this.buildCreatorString();
    }

    public preFillData(res: PettyCashResonse) {
        this.prepareEntryAgainstObject(res);

        this.companyUniqueName = null;
        this.companyUniqueName$.pipe(take(1)).subscribe(a => this.companyUniqueName = a);
        this.comment = res?.description;
        let imgs = res?.attachedFileUniqueNames;
        let imgPrefix = ApiUrl + 'company/' + this.companyUniqueName + '/image/';
        this.imageURL = [];

        if (imgs) {
            imgs.forEach(imgUniqeName => {
                let imgUrls = imgPrefix + imgUniqeName;
                this.imageURL.push(imgUrls);
            });
        }
    }

    public toggleEntryAgainst() {
        switch (this.entryAgainstObject.against) {
            case 'Entry against Debtor':
                this.entryAgainstObject.base = 'Debtor Name';
                this.entryAgainstObject.against = 'Cash Sales';
                this.pettyCashEntryType = 'sales';
                this.cashOrBankEntry = false;
                this.loadDefaultDebtorAccountsSuggestions();
                break;

            case 'Entry against Creditor':
                this.entryAgainstObject.base = 'Creditor Name';
                this.entryAgainstObject.against = 'Cash Expenses';
                this.pettyCashEntryType = 'expense';
                this.cashOrBankEntry = false;
                this.loadDefaultCreditorAccountsSuggestions();
                break;

            case 'Entry against Creditors':
                this.entryAgainstObject.base = 'Creditor Name';
                this.entryAgainstObject.against = 'Cash Expenses';
                this.pettyCashEntryType = 'expense';
                this.cashOrBankEntry = false;
                this.loadDefaultCreditorAccountsSuggestions();
                break;    

            case 'Cash Sales':
                this.entryAgainstObject.base = 'Receipt Mode';
                this.entryAgainstObject.against = 'Entry against Debtor';
                this.pettyCashEntryType = 'sales';
                this.cashOrBankEntry = true;
                this.loadDefaultCashBankAccountsSuggestions();
                break;

            case 'Cash Expenses':
                this.entryAgainstObject.base = 'Payment Mode';
                this.entryAgainstObject.against = 'Entry against Creditor';
                this.pettyCashEntryType = 'expense';
                this.cashOrBankEntry = true;
                this.loadDefaultCashBankAccountsSuggestions();
                break;

        }
        if (this.entryAgainstAccountDropDown) {
            this.entryAgainstAccountDropDown.clear();
        }
        this.entryAgainstObject.model = null;
    }

    public closeDetailsMode() {
        this.toggleDetailsMode.emit(true);
    }

    public showApproveConfirmPopup(ref: TemplateRef<any>) {
        this.approveEntryModalRef = this.modalService.show(ref, { class: 'modal-md' });
        this.selectedEntryForApprove = cloneDeep(this.selectedItem);
        this.selectedEntryForApprove.amount = this.updateLedgerComponentInstance.vm.compoundTotal;
    }

    public hideApproveConfirmPopup(isApproved) {
        if (!isApproved) {
            this.approveEntryModalRef.hide();
            this.selectedEntryForApprove = null;
        } else {
            this.approveEntry();
        }
    }

    public approveEntry() {
        if (this.entryAgainstObject.base && !this.entryAgainstObject.model) {
            let errorMessage = this.localeData?.entry_against_error;
            errorMessage = errorMessage.replace("[ENTRY_AGAINST]", this.entryAgainstObject.base);
            this.toasty.errorToast(errorMessage);
            this.hideApproveConfirmPopup(false);
            return;
        }
        this.approveEntryRequestInProcess = true;
        let actionType: ActionPettycashRequest = {
            actionType: 'approve',
            uniqueName: this.accountEntryPettyCash.uniqueName,
            accountUniqueName: this.accountEntryPettyCash.particular.uniqueName
        };

        let ledgerRequest = cloneDeep(this.updateLedgerComponentInstance.saveLedgerTransaction());
        // check if there any validation error occurs from ledger component then don't do any thing just return
        if (!ledgerRequest) {
            this.approveEntryRequestInProcess = false;
            return;
        }

        // delete extra keys from request
        delete ledgerRequest['ledgerUniqueNames'];
        delete ledgerRequest['pettyCashEntryStatus'];
        delete ledgerRequest['pettyCashEntryStatus'];
        delete ledgerRequest['othersCategory'];

        if (this.accountEntryPettyCash && this.accountEntryPettyCash.attachedFileUniqueNames && this.accountEntryPettyCash.attachedFileUniqueNames.length) {
            ledgerRequest.attachedFile = this.accountEntryPettyCash.attachedFileUniqueNames[0];
        } else {
            ledgerRequest.attachedFile = (this.DownloadAttachedImgResponse && this.DownloadAttachedImgResponse.length > 0) ? this.DownloadAttachedImgResponse[0].uniqueName : '';
        }
        if (this.accountEntryPettyCash && this.accountEntryPettyCash.attachedFile) {
            ledgerRequest.attachedFileName = this.accountEntryPettyCash.attachedFile;
        } else {
            ledgerRequest.attachedFileName = this.imgAttachedFileName;
        }

        this.expenseService.actionPettycashReports(actionType, { ledgerRequest }).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.approveEntryRequestInProcess = false;
            if (res.status === 'success') {
                this.hideApproveConfirmPopup(false);
                this.processNextRecord(res);
            } else {
                this.toasty.errorToast(res.message);
                this.approveEntryRequestInProcess = false;
            }
        }, (error => {
            this.approveEntryRequestInProcess = false;
        }));
    }

    public prepareApproveRequestObject(pettyCashEntryObj: PettyCashResonse) {
        if (pettyCashEntryObj && this.actionPettyCashRequestBody) {
            this.actionPettyCashRequestBody.ledgerRequest.attachedFile = (this.DownloadAttachedImgResponse.length > 0) ? this.DownloadAttachedImgResponse[0].uniqueName : '';
            this.actionPettyCashRequestBody.ledgerRequest.attachedFileName = (this.DownloadAttachedImgResponse.length > 0) ? this.DownloadAttachedImgResponse[0].name : '';
        }
    }

    public pettyCashAction(actionType: ActionPettycashRequest) {
        this.expenseService.actionPettycashReports(actionType, this.actionPettyCashRequestBody).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res.status === 'success') {
                this.processNextRecord(res);
            } else {
                this.toasty.errorToast(res.body ?? res.message);
            }
            this.modalRef.hide();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedRowItem'] && changes['selectedRowItem'].currentValue !== changes['selectedRowItem'].previousValue) {
            this.selectedItem = changes['selectedRowItem'].currentValue;
            this.getPettyCashEntry(this.selectedItem.uniqueName);
            this.store.dispatch(this.ledgerActions.setAccountForEdit(this.selectedItem.baseAccount.uniqueName || null));
            this.buildCreatorString();
        }
    }

    public submitReject(): void {
        this.actionPettyCashRequestBody = new ExpenseActionRequest();
        this.actionPettyCashRequestBody.message = this.rejectReason.value;
        this.actionPettycashRequest.actionType = 'reject';
        this.actionPettycashRequest.uniqueName = this.selectedItem.uniqueName;
        this.pettyCashAction(this.actionPettycashRequest);
    }

    public onSelectEntryAgainstAccount(option: IOption) {
        if (option && option.value) {
            this.accountEntryPettyCash.particular.uniqueName = option.value;
            this.accountEntryPettyCash.particular.name = option.label;
        }
    }

    public cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id });
    }

    public removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id });
    }

    public removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }

    public onUploadFileOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            this.imgAttached = true;
            this.startUpload();
        } else if (output.type === 'start') {
            this.imgUploadInprogress = true;
        } else if (output.type === 'done') {
            if (output.file.response.status === 'success') {
                this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + output.file.response.body.uniqueName;
                let img = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + output.file.response.body.uniqueName;
                this.DownloadAttachedImgResponse.push(output.file.response.body);
                this.imgAttachedFileName = output.file.response.body.name;
                this.imageURL.push(img);
                this.toasty.successToast(this.localeData?.file_upload_success);
            } else {
                this.toasty.errorToast(output.file.response.message, output.file.response.code);
            }
            this.imgUploadInprogress = false;
            this.imgAttached = true;
        }
    }

    public startUpload(): void {
        let sessionId = null;
        this.companyUniqueName = null;
        this.sessionId$.pipe(take(1)).subscribe(a => sessionId = a);
        this.companyUniqueName$.pipe(take(1)).subscribe(a => this.companyUniqueName = a);
        const event: UploadInput = {
            type: 'uploadAll',
            url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', this.companyUniqueName),
            method: 'POST',
            headers: { 'Session-Id': sessionId },
        };

        this.uploadInput.emit(event);
    }

    public previewFile(files: any) {
        let preview: any = document.getElementById('signatureImage');
        let a: any = document.querySelector('input[type=file]');
        let file = a.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            preview.src = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
        }
    }

    public clickZoomImageView(i) {
        this.isImageZoomView = true;
        this.zoomViewImageSrc = this.imageURL[i];
    }

    public hideZoomImageView() {
        this.isImageZoomView = false;
        this.zoomViewImageSrc = '';
    }

    public toggleBodyClass() {
        if (this.asideMenuStateForOtherTaxes === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleOtherTaxesAsidePane(modal) {
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Prepares the entry
     *
     * @private
     * @param {PettyCashResonse} res Petty cash details
     * @memberof ExpenseDetailsComponent
     */
    private prepareEntryAgainstObject(res: PettyCashResonse): void {
        this.cashOrBankEntry = res?.particular ? this.isCashBankAccount(res.particular) : false;
        this.pettyCashEntryType = res?.pettyCashEntryStatus?.entryType;
        if (res?.pettyCashEntryStatus?.entryType === 'sales') {
            this.entryAgainstObject.base = this.cashOrBankEntry ? 'Receipt Mode' : 'Debtor Name';
            this.entryAgainstObject.against = this.cashOrBankEntry ? 'Entry against Debtor' : 'Cash Sales';
            if (this.cashOrBankEntry) {
                this.loadDefaultCashBankAccountsSuggestions();
            } else {
                this.loadDefaultDebtorAccountsSuggestions();
            }
        } else if (res?.pettyCashEntryStatus?.entryType === 'expense') {

            this.entryAgainstObject.base = this.cashOrBankEntry ? 'Payment Mode' : 'Creditor Name';
            this.entryAgainstObject.against = this.cashOrBankEntry ? 'Entry against Creditors' : 'Cash Expenses';
            if (this.cashOrBankEntry) {
                this.loadDefaultCashBankAccountsSuggestions();
            } else {
                this.loadDefaultCreditorAccountsSuggestions();
            }
        } else {
            // deposit
            this.entryAgainstObject.base = 'Deposit To';
            this.entryAgainstObject.against = null;
            this.loadDefaultCashBankAccountsSuggestions();
        }

        this.entryAgainstObject.model = res?.particular?.uniqueName;
        this.entryAgainstObject.name = res?.particular?.name;
    }

    /**
     * Returns true, if the account belongs to cash or bank account
     *
     * @private
     * @param {any} particular Account unique name
     * @returns {boolean} Promise to carry out further operations
     * @memberof ExpenseDetailsComponent
     */
    private isCashBankAccount(particular: any): boolean {
        if (particular) {
            return particular.parentGroups.some(parent => parent.uniqueName === 'bankaccounts' || parent.uniqueName === 'cash');
        }
        return false;
    }

    /**
     * Handle account scroll end
     *
     * @memberof ExpenseDetailsComponent
     */
    public handleAccountScrollEnd(): void {
        if (this.pettyCashEntryType === 'sales') {
            if (this.cashOrBankEntry) {
                this.handleCashBankScrollEnd();
            } else {
                this.handleDebtorScrollEnd();
            }
        } else if (this.pettyCashEntryType === 'expense') {
            if (this.cashOrBankEntry) {
                this.handleCashBankScrollEnd();
            } else {
                this.handleCreditorScrollEnd();
            }
        } else {
            this.handleCashBankScrollEnd();
        }
    }

    /**
     * Account search query handler
     *
     * @param {string} query Searched query
     * @memberof ExpenseDetailsComponent
     */
    public onAccountSearchQueryChanged(query: string): void {
        if (this.pettyCashEntryType === 'sales') {
            if (this.cashOrBankEntry) {
                this.onCashBankAccountSearchQueryChanged(query);
            } else {
                this.onDebtorAccountSearchQueryChanged(query);
            }
        } else if (this.pettyCashEntryType === 'expense') {
            if (this.cashOrBankEntry) {
                this.onCashBankAccountSearchQueryChanged(query);
            } else {
                this.onCreditorAccountSearchQueryChanged(query);
            }
        } else {
            this.onCashBankAccountSearchQueryChanged(query);
        }
    }

    /**
     * Search query change handler for debtor dropdown
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof ExpenseDetailsComponent
     */
    public onDebtorAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.debtorAccountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultDebtorScrollApiCall &&
            (query || (this.defaultDebtorAccountSuggestions && this.defaultDebtorAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: 'sundrydebtors'
            }
            this.searchService.searchAccountV2(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.debtorsAccountsOptions = searchResults;
                    } else {
                        this.debtorsAccountsOptions = [
                            ...this.debtorsAccountsOptions,
                            ...searchResults
                        ];
                    }
                    this.entryAgainstObject.dropDownOption = [...this.debtorsAccountsOptions];
                    this.debtorAccountsSearchResultsPaginationData.page = data.body.page;
                    this.debtorAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultDebtorAccountPaginationData.page = this.debtorAccountsSearchResultsPaginationData.page;
                        this.defaultDebtorAccountPaginationData.totalPages = this.debtorAccountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.debtorsAccountsOptions = [...this.defaultDebtorAccountSuggestions];
            this.debtorAccountsSearchResultsPaginationData.page = this.defaultDebtorAccountPaginationData.page;
            this.debtorAccountsSearchResultsPaginationData.totalPages = this.defaultDebtorAccountPaginationData.totalPages;
            this.preventDefaultDebtorScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultDebtorScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for debtor
     *
     * @returns null
     * @memberof ExpenseDetailsComponent
     */
    public handleDebtorScrollEnd(): void {
        if (this.debtorAccountsSearchResultsPaginationData.page < this.debtorAccountsSearchResultsPaginationData.totalPages) {
            this.onDebtorAccountSearchQueryChanged(
                this.debtorAccountsSearchResultsPaginationData.query,
                this.debtorAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.debtorAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultDebtorAccountSuggestions = this.defaultDebtorAccountSuggestions.concat(...results);
                        this.defaultDebtorAccountPaginationData.page = this.debtorAccountsSearchResultsPaginationData.page;
                        this.defaultDebtorAccountPaginationData.totalPages = this.debtorAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default debtor account search suggestion when module is loaded
     *
     * @private
     * @memberof ExpenseDetailsComponent
     */
    private loadDefaultDebtorAccountsSuggestions(): void {
        this.onDebtorAccountSearchQueryChanged('', 1, (response) => {
            this.defaultDebtorAccountSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultDebtorAccountPaginationData.page = this.debtorAccountsSearchResultsPaginationData.page;
            this.defaultDebtorAccountPaginationData.totalPages = this.debtorAccountsSearchResultsPaginationData.totalPages;
            this.debtorsAccountsOptions = [...this.defaultDebtorAccountSuggestions];
        });
    }

    /**
     * Search query change handler for creditor dropdown
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof ExpenseDetailsComponent
     */
    public onCreditorAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.creditorAccountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultCreditorScrollApiCall &&
            (query || (this.defaultCreditorAccountSuggestions && this.defaultCreditorAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: 'sundrycreditors'
            }
            this.searchService.searchAccountV2(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.creditorsAccountsOptions = searchResults;
                    } else {
                        this.creditorsAccountsOptions = [
                            ...this.creditorsAccountsOptions,
                            ...searchResults
                        ];
                    }
                    this.entryAgainstObject.dropDownOption = [...this.creditorsAccountsOptions];
                    this.creditorAccountsSearchResultsPaginationData.page = data.body.page;
                    this.creditorAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultCreditorAccountPaginationData.page = this.creditorAccountsSearchResultsPaginationData.page;
                        this.defaultCreditorAccountPaginationData.totalPages = this.creditorAccountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.creditorsAccountsOptions = [...this.defaultCreditorAccountSuggestions];
            this.creditorAccountsSearchResultsPaginationData.page = this.defaultCreditorAccountPaginationData.page;
            this.creditorAccountsSearchResultsPaginationData.totalPages = this.defaultCreditorAccountPaginationData.totalPages;
            this.preventDefaultCreditorScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultCreditorScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for creditor
     *
     * @returns null
     * @memberof ExpenseDetailsComponent
     */
    public handleCreditorScrollEnd(): void {
        if (this.creditorAccountsSearchResultsPaginationData.page < this.creditorAccountsSearchResultsPaginationData.totalPages) {
            this.onDebtorAccountSearchQueryChanged(
                this.creditorAccountsSearchResultsPaginationData.query,
                this.creditorAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.creditorAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultCreditorAccountSuggestions = this.defaultCreditorAccountSuggestions.concat(...results);
                        this.defaultDebtorAccountPaginationData.page = this.creditorAccountsSearchResultsPaginationData.page;
                        this.defaultDebtorAccountPaginationData.totalPages = this.creditorAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default creditor account search suggestion when module is loaded
     *
     * @private
     * @memberof ExpenseDetailsComponent
     */
    private loadDefaultCreditorAccountsSuggestions(): void {
        this.onCreditorAccountSearchQueryChanged('', 1, (response) => {
            this.defaultCreditorAccountSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultCreditorAccountPaginationData.page = this.creditorAccountsSearchResultsPaginationData.page;
            this.defaultCreditorAccountPaginationData.totalPages = this.creditorAccountsSearchResultsPaginationData.totalPages;
            this.creditorsAccountsOptions = [...this.defaultCreditorAccountSuggestions];
        });
    }

    /**
     * Search query change handler for cash/bank dropdown
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof ExpenseDetailsComponent
     */
    public onCashBankAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.cashBankAccountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultCashBankScrollApiCall &&
            (query || (this.defaultCashBankAccountSuggestions && this.defaultCashBankAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: encodeURIComponent('cash, bankaccounts')
            }
            this.searchService.searchAccountV2(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.cashAndBankAccountsOptions = searchResults;
                    } else {
                        this.cashAndBankAccountsOptions = [
                            ...this.cashAndBankAccountsOptions,
                            ...searchResults
                        ];
                    }
                    this.entryAgainstObject.dropDownOption = [...this.cashAndBankAccountsOptions];
                    this.cashBankAccountsSearchResultsPaginationData.page = data.body.page;
                    this.cashBankAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultCashBankAccountPaginationData.page = this.cashBankAccountsSearchResultsPaginationData.page;
                        this.defaultCashBankAccountPaginationData.totalPages = this.cashBankAccountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.cashAndBankAccountsOptions = [...this.defaultCashBankAccountSuggestions];
            this.cashBankAccountsSearchResultsPaginationData.page = this.defaultCashBankAccountPaginationData.page;
            this.cashBankAccountsSearchResultsPaginationData.totalPages = this.defaultCashBankAccountPaginationData.totalPages;
            this.preventDefaultCashBankScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultCashBankScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for cash/bank
     *
     * @returns null
     * @memberof ExpenseDetailsComponent
     */
    public handleCashBankScrollEnd(): void {
        if (this.cashBankAccountsSearchResultsPaginationData.page < this.cashBankAccountsSearchResultsPaginationData.totalPages) {
            this.onCashBankAccountSearchQueryChanged(
                this.cashBankAccountsSearchResultsPaginationData.query,
                this.cashBankAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.cashBankAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultCashBankAccountSuggestions = this.defaultCashBankAccountSuggestions.concat(...results);
                        this.defaultCashBankAccountPaginationData.page = this.cashBankAccountsSearchResultsPaginationData.page;
                        this.defaultCashBankAccountPaginationData.totalPages = this.cashBankAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default creditor account search suggestion when module is loaded
     *
     * @private
     * @memberof ExpenseDetailsComponent
     */
    private loadDefaultCashBankAccountsSuggestions(): void {
        this.onCashBankAccountSearchQueryChanged('', 1, (response) => {
            this.defaultCreditorAccountSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultCreditorAccountPaginationData.page = this.creditorAccountsSearchResultsPaginationData.page;
            this.defaultCreditorAccountPaginationData.totalPages = this.creditorAccountsSearchResultsPaginationData.totalPages;
            this.creditorsAccountsOptions = [...this.defaultCreditorAccountSuggestions];
        });
    }

    /**
     * Releases memory
     *
     * @memberof ExpenseDetailsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will build the creator name string
     *
     * @memberof ExpenseDetailsComponent
     */
    public buildCreatorString(): void {
        if (this.selectedItem && this.selectedItem.createdBy) {
            this.byCreator = this.localeData?.by_creator;
            this.byCreator = this.byCreator.replace("[CREATOR_NAME]", this.selectedItem.createdBy.name);
        } else {
            this.byCreator = "";
        }
    }

    /**
     * Fetching petty cash entry details
     *
     * @param {string} uniqueName
     * @memberof ExpenseDetailsComponent
     */
    private getPettyCashEntry(uniqueName: string): void {
        this.isPettyCashEntryLoading = true;
        this.expenseService.getPettycashEntry(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.uniqueName !== this.accountEntryPettyCash?.uniqueName) {
                this.actionPettyCashRequestBody = null;
                this.accountEntryPettyCash = response?.body;
                this.prepareApproveRequestObject(this.accountEntryPettyCash);
                this.preFillData(response?.body);
            }
            this.isPettyCashEntryLoading = false;
        });
    }

    /**
     * This will emit true to show next record in preview mode
     *
     * @private
     * @param {*} response
     * @memberof ExpenseDetailsComponent
     */
    private processNextRecord(response: any): void {
        this.toasty.successToast(response?.body);
        this.rejectReason.setValue("");
        this.previewNextItem.emit(true);
    }
}
