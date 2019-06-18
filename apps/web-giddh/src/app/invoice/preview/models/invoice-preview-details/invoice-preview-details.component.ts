import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { InvoiceSetting } from '../../../../models/interfaces/invoice.setting.interface';
import { InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { ProformaService } from '../../../../services/proforma.service';
import { ProformaDownloadRequest } from '../../../../models/api-models/proforma';
import { VoucherTypeEnum } from '../../../../models/api-models/Sales';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { base64ToBlob } from '../../../../shared/helpers/helperFunctions';
import { DownloadVoucherRequest } from '../../../../models/api-models/recipt';
import { ReceiptService } from '../../../../services/receipt.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'invoice-preview-details-component',
  templateUrl: './invoice-preview-details.component.html',
  styleUrls: [`./invoice-preview-details.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicePreviewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('searchElement') public searchElement: ElementRef;
  @ViewChild(PdfJsViewerComponent) public pdfViewer: PdfJsViewerComponent;

  @Input() public items: InvoicePreviewDetailsVm[];
  @Input() public selectedItem: InvoicePreviewDetailsVm;
  @Input() public appSideMenubarIsOpen: boolean;
  @Input() public invoiceSetting: InvoiceSetting;
  @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.sales;
  @Output() public deleteVoucher: EventEmitter<boolean> = new EventEmitter();
  @Output() public updateVoucherAction: EventEmitter<string> = new EventEmitter();
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();

  public filteredData: InvoicePreviewDetailsVm[] = [];
  public showMore: boolean = false;
  public showEditMode: boolean = false;
  public isSendSmsEnabled: boolean = false;
  public isVoucherDownloading: boolean;
  public only4Proforma: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _cdr: ChangeDetectorRef, private _toasty: ToasterService, private _proformaService: ProformaService,
              private _receiptService: ReceiptService) {
  }

  ngOnInit() {
    if (this.selectedItem) {
      this.downloadVoucher('base64');
      this.only4Proforma = [VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('items' in changes && changes.items.currentValue !== changes.items.previousValue) {
      this.filteredData = changes.items.currentValue;
    }

    if ('invoiceSetting' in changes && changes.invoiceSetting.currentValue && changes.invoiceSetting.currentValue !== changes.invoiceSetting.previousValue) {
      this.isSendSmsEnabled = changes.invoiceSetting.currentValue.sendInvLinkOnSms;
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchElement.nativeElement, 'input')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((ev: any) => ev.target.value)
      )
      .subscribe((term => {
        this.filteredData = this.items.filter(item => {
          return item.voucherNumber.toLowerCase().includes(term) || item.account.name.toLowerCase().includes(term);
        });
        this._cdr.markForCheck();
      }))
  }

  public toggleEditMode() {
    this.showEditMode = !this.showEditMode;
    // this.toggleBodyClass();
  }

  public toggleBodyClass() {
    if (!this.showEditMode) {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public selectVoucher(item: InvoicePreviewDetailsVm) {
    this.selectedItem = item;
    this.downloadVoucher('base64');
    this.showEditMode = false;
  }

  public downloadVoucher(fileType: string = '') {
    this.isVoucherDownloading = true;
    if (this.voucherType === 'sales') {
      let model: DownloadVoucherRequest = {
        voucherType: this.selectedItem.voucherType,
        voucherNumber: [this.selectedItem.voucherNumber]
      };
      let accountUniqueName: string = this.selectedItem.account.uniqueName;
      //
      this._receiptService.DownloadVoucher(model, accountUniqueName, false).subscribe(result => {
        if (result) {
          this.pdfViewer.pdfSrc = result;
          this.pdfViewer.showSpinner = true;
          this.pdfViewer.refresh();
        } else {
          this._toasty.errorToast('Something went wrong please try again!');
        }
        this.isVoucherDownloading = false;
        this._cdr.detectChanges();
      }, (err) => {
        this._toasty.errorToast(err.message);
        this.isVoucherDownloading = false;
        this._cdr.detectChanges();
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
        } else {
          this._toasty.errorToast(result.message, result.code);
        }
        this.isVoucherDownloading = false;
        this._cdr.detectChanges();
      }, (err) => {
        this._toasty.errorToast(err.message);
        this.isVoucherDownloading = false;
        this._cdr.detectChanges();
      });
    }
  }

  public downloadPdf() {
    if (this.isVoucherDownloading) {
      return;
    }
    if (this.selectedItem && this.selectedItem.blob) {
      return saveAs(this.selectedItem.blob, `${this.selectedItem.account.name} - ${this.selectedItem.voucherNumber}.pdf`);
    } else {
      return;
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
