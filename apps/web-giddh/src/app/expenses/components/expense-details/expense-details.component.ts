import { Component, OnInit, TemplateRef, EventEmitter, Output, ChangeDetectorRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

export class ExpenseDetailsComponent implements OnInit, OnChanges {

  public modalRef: BsModalRef;
  public message: string;
  public actionPettyCashRequestBody: ExpenseActionRequest = new ExpenseActionRequest();
  @Output() public toggleDetailsMode: EventEmitter<boolean> = new EventEmitter();
  @Output() public selectedDetailedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
  @Input() public selectedRowItem: string;
  @Output() public refreshPendingItem: EventEmitter<boolean> = new EventEmitter();
  public selectedItem: ExpenseResults;
  public rejectReason = new FormControl();
  public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
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


  public depositAccountUniqueName: string;
  public selectedAccountUniqueName: string;
  public accountType: string;
  public forceClear$: Observable<IForceClear> = observableOf({ status: false });

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private sundryDebtorsAcList: IOption[] = [];
  private sundryCreditorsAcList: IOption[] = [];

  constructor(private modalService: BsModalService,
    private _toasty: ToasterService,
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
    // this.expenseService.actionPettycashReports(actionType, this.actionPettyCashRequestBody).subscribe(res => {
    //   if (res.status === 'success') {
    //     this.modalService.hide(0);
    //     this._toasty.successToast('reverted successfully');
    //   } else {
    //     this._toasty.successToast(res.message);
    //   }
    // });
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
    }
    if (this.selectedItem) {
      this.selectedAccountUniqueName = this.selectedItem.uniqueName;
      this.getPettyCashEntry(this.selectedAccountUniqueName);
    }
  }


  public submitReject(): void {
    this.actionPettyCashRequestBody.message = this.rejectReason.value;
    this.actionPettycashRequest.actionType = 'reject';
    this.actionPettycashRequest.uniqueName = this.selectedItem.uniqueName;
    this.pettyCashAction(this.actionPettycashRequest);
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
  public getPettyCashEntry(accountuniqueName: string) {
    this.store.dispatch(this._expenceActions.getPettycashEntryRequest(accountuniqueName));
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
}
