import { Component, OnInit, TemplateRef, EventEmitter, Output, ChangeDetectorRef, OnChanges, SimpleChanges, Input, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ExpenseResults, ActionPettycashRequest, ExpenseActionRequest } from '../../../models/api-models/Expences';
import { ToasterService } from '../../../services/toaster.service';
import { ExpenseService } from '../../../services/expences.service';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { FormControl } from '@angular/forms';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { takeUntil, take } from 'rxjs/operators';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { IForceClear } from '../../../models/api-models/Sales';
import { UploadOutput, UploaderOptions, UploadInput, UploadFile } from 'ngx-uploader';
import { Configuration } from '../../../app.constant';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { UpdateLedgerEntryPanelComponent } from '../../../ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { DownloadLedgerAttachmentResponse } from '../../../models/api-models/Ledger';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
;
@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

export class ExpenseDetailsComponent implements OnInit, OnChanges {

  public modalRef: BsModalRef;
  public message: string;
  public actionPettyCashRequestBody: ExpenseActionRequest;
  @Output() public toggleDetailsMode: EventEmitter<boolean> = new EventEmitter();
  @Output() public selectedDetailedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
  @Input() public selectedRowItem: string;
  @Output() public refreshPendingItem: EventEmitter<boolean> = new EventEmitter()

  public selectedItem: ExpenseResults;
  public rejectReason = new FormControl();
  public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
  public selectedPettycashEntry$: Observable<any>;
  public ispPettycashEntrySuccess$: Observable<boolean>;
  public actionPettycashRequest: ActionPettycashRequest = new ActionPettycashRequest();
  public bankAccounts$: Observable<IOption[]>;
  public imgAttached: boolean = false;
  public imgUploadInprogress: boolean = false;
  public isFileUploaded: boolean = false;
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
  public tcsOrTds: 'tcs' | 'tds' = 'tcs';

  public depositAccountUniqueName: string;
  public accountType: string;
  public forceClear$: Observable<IForceClear> = observableOf({ status: false });
  public DownloadAttachedImgResponse: DownloadLedgerAttachmentResponse[] = [];
  public comment: string = '';

  @ViewChild('updateledgercomponent') public updateledgercomponent: ElementViewContainerRef;
  @ViewChild('updateLedgerModal') public updateLedgerModal: ModalDirective;
  public updateLedgerComponentInstance: UpdateLedgerEntryPanelComponent;
  public showUpdateLedgerForm: boolean = false;
  public accountEntryPettyCash: any;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private sundryDebtorsAcList: IOption[] = [];
  private sundryCreditorsAcList: IOption[] = [];

  constructor(private modalService: BsModalService,
    private _toasty: ToasterService,
    private _expenseService: ExpenseService,
    private _ledgerActions: LedgerActions,
    private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private expenseService: ExpenseService,
    private _cdRf: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.flattenAccountListStream$ = this.store.pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$));
    this.sessionId$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
    this.companyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
    this.selectedPettycashEntry$ = this.store.pipe(select(p => p.expense.pettycashEntry), takeUntil(this.destroyed$));
    this.ispPettycashEntrySuccess$ = this.store.pipe(select(p => p.expense.ispPettycashEntrySuccess), takeUntil(this.destroyed$));
  }

  openModal(RejectionReason: TemplateRef<any>) {
    this.modalRef = this.modalService.show(RejectionReason, { class: 'modal-md' });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  public ngOnInit() {
    this.flattenAccountListStream$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      let flattenAccounts: IFlattenAccountsResultItem[] = res;
      let bankaccounts: IOption[] = [];
      this.sundryDebtorsAcList = [];
      this.sundryCreditorsAcList = [];
      flattenAccounts.forEach(item => {
        if (item.parentGroups.some(p => p.uniqueName === 'sundrydebtors')) {
          this.sundryDebtorsAcList.push({ label: item.name, value: item.uniqueName, additional: item });
        }

        if (item.parentGroups.some(p => p.uniqueName === 'sundrycreditors')) {
          this.sundryCreditorsAcList.push({ label: item.name, value: item.uniqueName, additional: item });
        }
        if (item.parentGroups.some(p => p.uniqueName === 'bankaccounts' || p.uniqueName === 'cash')) {
          bankaccounts.push({ label: item.name, value: item.uniqueName, additional: item });
        }
      });
      bankaccounts = _.orderBy(bankaccounts, 'label');
      this.bankAccounts$ = observableOf(bankaccounts);
    });
    this.fileUploadOptions = { concurrency: 1, allowedContentTypes: ['image/png', 'image/jpeg'] };
    this.selectedPettycashEntry$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        this.actionPettyCashRequestBody = null;
        this.accountEntryPettyCash = res;
        this.prepareApproveRequestObject(this.accountEntryPettyCash);
        this.preFillData(res);
      }
    });;
  }
  public preFillData(res: any) {
    this.companyUniqueName = null;
    this.companyUniqueName$.pipe(take(1)).subscribe(a => this.companyUniqueName = a);
    this.comment = res.description;
    let imgs = res.attachedFiles;
    let imgPrefix = ApiUrl + 'company/' + this.companyUniqueName + '/image/';
    this.imageURL = [];
    if (imgs.length) {
      imgs.forEach(imgUniqeName => {
        let imgUrls = imgPrefix + imgUniqeName;
        this.imageURL.push(imgUrls);
      })
    }
  }
  public closeDetailsMode() {
    this.toggleDetailsMode.emit(true);
  }
  public approvedActionClicked(item: ExpenseResults) {
    let actionType: ActionPettycashRequest = {
      actionType: 'approve',
      uniqueName: item.uniqueName
    };
    this.pettyCashAction(actionType);
    this.expenseService.actionPettycashReports(actionType, this.actionPettyCashRequestBody).subscribe(res => {
      if (res.status === 'success') {
        this.modalService.hide(0);
        this._toasty.successToast('reverted successfully');
      } else {
        this._toasty.successToast(res.message);
      }
    });
  }
  public prepareApproveRequestObject(pettyCashEntryObj: any) {
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
    if (changes['selectedRowItem']) {
      this.selectedItem = changes['selectedRowItem'].currentValue;
      this.store.dispatch(this._expenceActions.getPettycashEntryRequest(this.selectedItem.uniqueName));
      this.store.dispatch(this._ledgerActions.setAccountForEdit(this.selectedItem.baseAccount.uniqueName));

      this._expenseService.getPettycashEntry(this.selectedItem.uniqueName).subscribe(res => {
        if (res.status === 'success') {
          this.accountEntryPettyCash = res;
          this.prepareApproveRequestObject(this.accountEntryPettyCash);
          this.comment = this.accountEntryPettyCash.body.description;
        }
      });
    }
  }


  public submitReject(): void {
    this.actionPettyCashRequestBody.message = this.rejectReason.value;
    this.actionPettycashRequest.actionType = 'reject';
    this.actionPettycashRequest.uniqueName = this.selectedItem.uniqueName;
    this.pettyCashAction(this.actionPettycashRequest);
  }
  public openUpdateLedger() {
    this.showUpdateLedgerForm = true;
    //  this.lc.selectedTxnUniqueName = txn.entryUniqueName;
    this.loadUpdateLedgerComponent();
    this.updateLedgerModal.show();
  }

  public onSelectPaymentMode(event) {
    if (event && event.value) {
      // if (this.isCashInvoice) {
      //   this.invFormData.accountDetails.name = event.label;
      //   this.invFormData.accountDetails.uniqueName = event.value;
      // }
      this.depositAccountUniqueName = event.value;
    } else {
      this.depositAccountUniqueName = '';
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
  public loadUpdateLedgerComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(UpdateLedgerEntryPanelComponent);
    let viewContainerRef = this.updateledgercomponent.viewContainerRef;
    viewContainerRef.remove();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    let componentInstance = componentRef.instance as UpdateLedgerEntryPanelComponent;
    componentInstance.tcsOrTds = this.tcsOrTds;
    this.updateLedgerComponentInstance = componentInstance;

    componentInstance.toggleOtherTaxesAsideMenu.subscribe(res => {
      // this.toggleOtherTaxesAsidePane(res);
    });

    componentInstance.closeUpdateLedgerModal.subscribe(() => {
      // this.hideUpdateLedgerModal();
    });

    this.updateLedgerModal.onHidden.pipe(take(1)).subscribe(() => {
      if (this.showUpdateLedgerForm) {
        // this.hideUpdateLedgerModal();
      }
      // this.entryManipulated();
      this.updateLedgerComponentInstance = null;
      componentRef.destroy();
    });

    componentInstance.showQuickAccountModalFromUpdateLedger.subscribe(() => {
      // this.showQuickAccountModal();
    });
  }
}
