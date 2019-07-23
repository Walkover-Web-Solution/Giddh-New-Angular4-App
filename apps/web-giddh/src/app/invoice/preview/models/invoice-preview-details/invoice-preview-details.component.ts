import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { InvoiceSetting } from '../../../../models/interfaces/invoice.setting.interface';
import { InvoicePaymentRequest, InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { ProformaService } from '../../../../services/proforma.service';
import { ProformaDownloadRequest, ProformaGetAllVersionRequest, ProformaVersionItem } from '../../../../models/api-models/proforma';
import { VoucherTypeEnum } from '../../../../models/api-models/Sales';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { base64ToBlob } from '../../../../shared/helpers/helperFunctions';
import { DownloadVoucherRequest } from '../../../../models/api-models/recipt';
import { ReceiptService } from '../../../../services/receipt.service';
import { saveAs } from 'file-saver';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { ProformaActions } from '../../../../actions/proforma/proforma.actions';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'invoice-preview-details-component',
  templateUrl: './invoice-preview-details.component.html',
  styleUrls: [`./invoice-preview-details.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicePreviewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('searchElement') public searchElement: ElementRef;
  @ViewChild(PdfJsViewerComponent) public pdfViewer: PdfJsViewerComponent;
  @ViewChild('showEmailSendModal') public showEmailSendModal: ModalDirective;

  @Input() public items: InvoicePreviewDetailsVm[];
  @Input() public selectedItem: InvoicePreviewDetailsVm;
  @Input() public appSideMenubarIsOpen: boolean;
  @Input() public invoiceSetting: InvoiceSetting;
  @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.sales;
  @Input() public voucherNoForSendMail: boolean;
  @Input() public showPrinterDialogWhenPageLoad: boolean;

  @Output() public deleteVoucher: EventEmitter<boolean> = new EventEmitter();
  @Output() public updateVoucherAction: EventEmitter<string> = new EventEmitter();
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() public sendEmail: EventEmitter<string> = new EventEmitter();
  @Output() public processPaymentEvent: EventEmitter<InvoicePaymentRequest> = new EventEmitter();
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public filteredData: InvoicePreviewDetailsVm[] = [];
  public showEditMode: boolean = false;
  public isSendSmsEnabled: boolean = false;
  public isVoucherDownloading: boolean = false;
  public isVoucherDownloadError: boolean = false;
  public only4ProformaEstimates: boolean;
  public emailList: string = '';
  public moreLogsDisplayed: boolean = true;
  public voucherVersions: ProformaVersionItem[] = [];
  public filteredVoucherVersions: ProformaVersionItem[] = [];
  public ckeditorContent;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _cdr: ChangeDetectorRef, private _toasty: ToasterService, private _proformaService: ProformaService,
              private _receiptService: ReceiptService, private store: Store<AppState>, private _proformaActions: ProformaActions) {
  }

  ngOnInit() {
    if (this.selectedItem) {
      this.downloadVoucher('base64');
      this.only4ProformaEstimates = [VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType);

      if (this.only4ProformaEstimates) {
        this.getVoucherVersions();
      }
    }

    this.store.pipe(select(s => s.proforma.activeVoucherVersions), takeUntil(this.destroyed$)).subscribe((versions => {
      if (versions && versions) {
        this.voucherVersions = versions;
        this.filterVoucherVersions(false);
        this.detectChanges();
      }
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('items' in changes && changes.items.currentValue !== changes.items.previousValue) {
      this.filteredData = changes.items.currentValue;
    }

    if ('invoiceSetting' in changes && changes.invoiceSetting.currentValue && changes.invoiceSetting.currentValue !== changes.invoiceSetting.previousValue) {
      this.isSendSmsEnabled = changes.invoiceSetting.currentValue.sendInvLinkOnSms;
    }

    // if ('voucherNoForSendMail' in changes && changes.voucherNoForSendMail.currentValue &&
    //   (changes.voucherNoForSendMail.currentValue !== changes.voucherNoForSendMail.previousValue)) {
    //   setTimeout(() => this.showEmailSendModal.toggle(), 200);
    // }
  }

  ngAfterViewInit(): void {
    this.searchElement.nativeElement.focus();
    fromEvent(this.searchElement.nativeElement, 'input')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((ev: any) => ev.target.value)
      )
      .subscribe((term => {
        this.filteredData = this.items.filter(item => {
          return item.voucherNumber.toLowerCase().includes(term) ||
            item.account.name.toLowerCase().includes(term) ||
            item.voucherDate.includes(term) ||
            item.grandTotal.toString().includes(term);
        });
        this.detectChanges();
      }))
  }

  public toggleEditMode() {
    this.showEditMode = !this.showEditMode;
    // this.toggleBodyClass();
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }

  public toggleBodyClass() {
    if (!this.showEditMode) {
      document.querySelector('body').classList.add('fixed', 'mailbox');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public selectVoucher(item: InvoicePreviewDetailsVm) {
    this.selectedItem = item;
    this.downloadVoucher('base64');

    if (this.only4ProformaEstimates) {
      this.getVoucherVersions();
    }

    this.showEditMode = false;
  }

  public getVoucherVersions() {
    let request = new ProformaGetAllVersionRequest();
    request.accountUniqueName = this.selectedItem.account.uniqueName;
    request.page = 1;
    request.count = 15;

    if (this.voucherType === VoucherTypeEnum.generateProforma) {
      request.proformaNumber = this.selectedItem.voucherNumber;
    } else {
      request.estimateNumber = this.selectedItem.voucherNumber;
    }
    this.store.dispatch(this._proformaActions.getEstimateVersion(request, this.voucherType));
  }

  public filterVoucherVersions(showMore: boolean) {
    this.filteredVoucherVersions = this.voucherVersions.slice(0, showMore ? 14 : 2);
    this.moreLogsDisplayed = showMore;
  }

  public downloadVoucher(fileType: string = '') {
    this.isVoucherDownloading = true;
    this.isVoucherDownloadError = false;

    if (this.voucherType === 'sales') {
      let model: DownloadVoucherRequest = {
        voucherType: this.selectedItem.voucherType,
        voucherNumber: [this.selectedItem.voucherNumber]
      };
      let accountUniqueName: string = this.selectedItem.account.uniqueName;
      //
      this._receiptService.DownloadVoucher(model, accountUniqueName, false).subscribe(result => {
        if (result) {
          this.selectedItem.blob = result;
          this.pdfViewer.pdfSrc = result;
          this.pdfViewer.showSpinner = true;
          this.pdfViewer.refresh();
          this.isVoucherDownloadError = false;
        } else {
          this.isVoucherDownloadError = true;
          this._toasty.errorToast('Something went wrong please try again!');
        }
        this.isVoucherDownloading = false;
        this.detectChanges();
      }, (err) => {
        this._toasty.errorToast(err.message);
        this.isVoucherDownloading = false;
        this.isVoucherDownloadError = true;
        this.detectChanges();
      });
    } else {
      let request: ProformaDownloadRequest = new ProformaDownloadRequest();
      request.fileType = fileType;
      request.accountUniqueName = this.selectedItem.account.uniqueName;

      if (this.selectedItem.voucherType === VoucherTypeEnum.generateProforma) {
        request.proformaNumber = this.selectedItem.voucherNumber;
      } else {
        request.estimateNumber = this.selectedItem.voucherNumber;
      }

      this._proformaService.download(request, this.selectedItem.voucherType).subscribe(result => {
        if (result && result.status === 'success') {
          let blob: Blob = base64ToBlob(result.body, 'application/pdf', 512);
          this.pdfViewer.pdfSrc = blob;
          this.selectedItem.blob = blob;
          this.pdfViewer.showSpinner = true;
          this.pdfViewer.refresh();
          this.isVoucherDownloadError = false;
        } else {
          this._toasty.errorToast(result.message, result.code);
          this.isVoucherDownloadError = true;
        }
        this.isVoucherDownloading = false;
        this.detectChanges();
      }, (err) => {
        this._toasty.errorToast(err.message);
        this.isVoucherDownloading = false;
        this.isVoucherDownloadError = true;
        this.detectChanges();
      });
    }
  }

  public downloadPdf() {
    if (this.isVoucherDownloading || this.isVoucherDownloadError) {
      return;
    }
    if (this.selectedItem && this.selectedItem.blob) {
      return saveAs(this.selectedItem.blob, `${this.selectedItem.account.name} - ${this.selectedItem.voucherNumber}.pdf`);
    } else {
      return;
    }
  }

  public printVoucher() {
    if (this.isVoucherDownloading || this.isVoucherDownloadError) {
      return;
    }
    if (this.pdfViewer && this.pdfViewer.pdfSrc) {
      this.pdfViewer.startPrint = true;
      this.pdfViewer.refresh();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private detectChanges() {
    if (!this._cdr['destroyed']) {
      this._cdr.detectChanges();
    }
  }
}
