import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActionPettycashRequest, ExpenseActionRequest, ExpenseResults, PettyCashResonse } from '../../../models/api-models/Expences';
import { ToasterService } from '../../../services/toaster.service';
import { ExpenseService } from '../../../services/expences.service';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { IForceClear } from '../../../models/api-models/Sales';
import { UploaderOptions, UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';
import { Configuration } from '../../../app.constant';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { DownloadLedgerAttachmentResponse } from '../../../models/api-models/Ledger';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { TaxResponse } from '../../../models/api-models/Company';
import { UpdateLedgerEntryPanelComponent } from '../../../ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { cloneDeep } from '../../../lodash-optimized';

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

export class ExpenseDetailsComponent implements OnInit, OnChanges {

    public modalRef: BsModalRef;
    public approveEntryModalRef: BsModalRef;
    public message: string;
    public actionPettyCashRequestBody: ExpenseActionRequest;

    @Output() public toggleDetailsMode: EventEmitter<boolean> = new EventEmitter();
    @Output() public selectedDetailedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
    @Input() public selectedRowItem: any;
    @Output() public refreshPendingItem: EventEmitter<boolean> = new EventEmitter();
    @ViewChild(UpdateLedgerEntryPanelComponent) public updateLedgerComponentInstance: UpdateLedgerEntryPanelComponent;
    @ViewChild('entryAgainstAccountDropDown') public entryAgainstAccountDropDown: ShSelectComponent;

    public selectedItem: ExpenseResults;
    public rejectReason = new FormControl();
    public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public selectedPettycashEntry$: Observable<PettyCashResonse>;
    public ispPettycashEntrySuccess$: Observable<boolean>;
    public ispPettycashEntryInprocess$: Observable<boolean>;

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
        model: ''
    };
    public approveEntryRequestInProcess: boolean = false;
    public selectedEntryForApprove: ExpenseResults;
    /** unique name of any attached image   */
    public imgAttachedFileName: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private modalService: BsModalService,
        private _toasty: ToasterService,
        private _expenseService: ExpenseService,
        private _ledgerActions: LedgerActions,
        private store: Store<AppState>,
        private _expenceActions: ExpencesAction,
        private expenseService: ExpenseService,
        private _cdRf: ChangeDetectorRef
    ) {
        this.files = [];
        this.uploadInput = new EventEmitter<UploadInput>();
        this.flattenAccountListStream$ = this.store.pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$));
        this.sessionId$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
        this.companyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.selectedPettycashEntry$ = this.store.pipe(select(p => p.expense.pettycashEntry), takeUntil(this.destroyed$));
        this.ispPettycashEntrySuccess$ = this.store.pipe(select(p => p.expense.ispPettycashEntrySuccess), takeUntil(this.destroyed$));
        this.ispPettycashEntryInprocess$ = this.store.pipe(select(p => p.expense.ispPettycashEntryInprocess), takeUntil(this.destroyed$));

    }

    openModal(RejectionReason: TemplateRef<any>) {
        this.modalRef = this.modalService.show(RejectionReason, { class: 'modal-md' });
    }

    public ngOnInit() {
        this.flattenAccountListStream$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            let debtorsAccountsOptions = [];
            let creditorsAccountsOptions = [];
            let cashAndBankAccountsOptions = [];
            if (res) {
                res.forEach(acc => {
                    if (acc.parentGroups.some(p => p.uniqueName === 'sundrydebtors')) {
                        debtorsAccountsOptions.push({ label: acc.name, value: acc.uniqueName, additional: acc });
                    }

                    if (acc.parentGroups.some(p => p.uniqueName === 'sundrycreditors')) {
                        creditorsAccountsOptions.push({ label: acc.name, value: acc.uniqueName, additional: acc });
                    }
                    if (acc.parentGroups.some(p => p.uniqueName === 'bankaccounts' || p.uniqueName === 'cash')) {
                        cashAndBankAccountsOptions.push({ label: acc.name, value: acc.uniqueName, additional: acc });
                    }
                });
            }

            this.debtorsAccountsOptions = debtorsAccountsOptions;
            this.creditorsAccountsOptions = creditorsAccountsOptions;
            this.cashAndBankAccountsOptions = cashAndBankAccountsOptions;
        });

        this.fileUploadOptions = { concurrency: 1, allowedContentTypes: ['image/png', 'image/jpeg'] };

        this.selectedPettycashEntry$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.actionPettyCashRequestBody = null;
                this.accountEntryPettyCash = res;
                this.prepareApproveRequestObject(this.accountEntryPettyCash);
                this.preFillData(res);
            }
        });

        this.store.pipe(select(s => s.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
        });
    }

    public preFillData(res: PettyCashResonse) {
        this.prepareEntryAgainstObject(res);

        this.companyUniqueName = null;
        this.companyUniqueName$.pipe(take(1)).subscribe(a => this.companyUniqueName = a);
        this.comment = res.description;
        let imgs = res.attachedFileUniqueNames;
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
                this.entryAgainstObject.dropDownOption = this.debtorsAccountsOptions;
                break;

            case 'Entry against Creditor':
                this.entryAgainstObject.base = 'Creditor Name';
                this.entryAgainstObject.against = 'Cash Expenses';
                this.entryAgainstObject.dropDownOption = this.creditorsAccountsOptions;
                break;

            case 'Cash Sales':
                this.entryAgainstObject.base = 'Receipt Mode';
                this.entryAgainstObject.against = 'Entry against Debtor';
                this.entryAgainstObject.dropDownOption = this.cashAndBankAccountsOptions;
                break;

            case 'Cash Expenses':
                this.entryAgainstObject.base = 'Payment Mode';
                this.entryAgainstObject.against = 'Entry against Creditor';
                this.entryAgainstObject.dropDownOption = this.cashAndBankAccountsOptions;
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
            this._toasty.errorToast('Please Select ' + this.entryAgainstObject.base + '  for entry..');
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

        this.expenseService.actionPettycashReports(actionType, { ledgerRequest }).subscribe(res => {
            this.approveEntryRequestInProcess = false;
            if (res.status === 'success') {
                this.hideApproveConfirmPopup(false);
                this._toasty.successToast(res.body);
                this.refreshPendingItem.emit(true);
                this.toggleDetailsMode.emit(true);
            } else {
                this._toasty.errorToast(res.message);
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

    public getPettyCashPendingReports(SalesDetailedfilter: CommonPaginatedRequest) {
        SalesDetailedfilter.status = 'pending';
        this.store.dispatch(this._expenceActions.GetPettycashReportRequest(SalesDetailedfilter));
    }

    public getPettyCashRejectedReports(SalesDetailedfilter: CommonPaginatedRequest) {
        SalesDetailedfilter.status = 'rejected';
        this.store.dispatch(this._expenceActions.GetPettycashRejectedReportRequest(SalesDetailedfilter));
    }

    public pettyCashAction(actionType: ActionPettycashRequest) {
        this.expenseService.actionPettycashReports(actionType, this.actionPettyCashRequestBody).subscribe(res => {
            if (res.status === 'success') {
                this._toasty.successToast(res.body);
                this.closeDetailsMode();
                this.refreshPendingItem.emit(true);
            } else {
                this._toasty.errorToast(res.body);
            }
            this.modalRef.hide();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedRowItem'] && changes['selectedRowItem'].currentValue !== changes['selectedRowItem'].previousValue) {
            this.selectedItem = changes['selectedRowItem'].currentValue;
            this.store.dispatch(this._expenceActions.getPettycashEntryRequest(this.selectedItem.uniqueName));
            this.store.dispatch(this._ledgerActions.setAccountForEdit(this.selectedItem.baseAccount.uniqueName || null));
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
            // this.logoAttached = true;
            this.imgAttached = true;
            // this.previewFile(output.file);
            this.startUpload();
        } else if (output.type === 'start') {
            this.imgUploadInprogress = true;
        } else if (output.type === 'done') {
            if (output.file.response.status === 'success') {
                // let imageData = `data: image/${output.file.response.body.fileType};base64,${output.file.response.body.uploadedFile}`;
                this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + output.file.response.body.uniqueName;
                let img = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + output.file.response.body.uniqueName;
                this.DownloadAttachedImgResponse.push(output.file.response.body);
                this.imageURL.push(img);
                this.imgAttachedFileName = output.file.response.body.name;
                // this.customTemplate.sections.footer.data.imageSignature.label = output.file.response.body.uniqueName;
                this._toasty.successToast('file uploaded successfully.');
                // this.startUpload();
            } else {
                this._toasty.errorToast(output.file.response.message, output.file.response.code);
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
            // this._invoiceUiDataService.setLogoPath(preview.src);
        };
        if (file) {
            reader.readAsDataURL(file);
            // this.logoAttached = true;
        } else {
            preview.src = '';
            // this.logoAttached = false;
            // this._invoiceUiDataService.setLogoPath('');
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

    private prepareEntryAgainstObject(res: PettyCashResonse) {
        let cashOrBankEntry = this.isCashBankAccount(res.particular.uniqueName);

        if (res.pettyCashEntryStatus.entryType === 'sales') {
            this.entryAgainstObject.base = cashOrBankEntry ? 'Receipt Mode' : 'Debtor Name';
            this.entryAgainstObject.against = cashOrBankEntry ? 'Entry against Debtor' : 'Cash Sales';
            this.entryAgainstObject.dropDownOption = this.isCashBankAccount(res.particular.uniqueName) ? this.cashAndBankAccountsOptions : this.debtorsAccountsOptions;
        } else if (res.pettyCashEntryStatus.entryType === 'expense') {

            this.entryAgainstObject.base = cashOrBankEntry ? 'Payment Mode' : 'Creditor Name';
            this.entryAgainstObject.against = cashOrBankEntry ? 'Entry against Creditors' : 'Cash Expenses';
            this.entryAgainstObject.dropDownOption = this.isCashBankAccount(res.particular.uniqueName) ? this.cashAndBankAccountsOptions : this.creditorsAccountsOptions;
        } else {
            // deposit
            this.entryAgainstObject.base = 'Deposit To';
            this.entryAgainstObject.against = null;
            this.entryAgainstObject.dropDownOption = this.cashAndBankAccountsOptions;
        }

        this.entryAgainstObject.model = res.particular.uniqueName;
    }

    private isCashBankAccount(uniqueName) {
        return this.cashAndBankAccountsOptions.some(s => s.value === uniqueName);
    }
}
