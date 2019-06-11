import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { InvoiceSetting } from '../../../../models/interfaces/invoice.setting.interface';
import { InvoicePreviewDetailsVm } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { ProformaService } from '../../../../services/proforma.service';
import { ProformaDownloadRequest } from '../../../../models/api-models/proforma';
import { VoucherTypeEnum } from '../../../../models/api-models/Sales';

@Component({
  selector: 'invoice-preview-details-component',
  templateUrl: './invoice-preview-details.component.html',
  styleUrls: [`./invoice-preview-details.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicePreviewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() public items: InvoicePreviewDetailsVm[];
  @Input() public selectedItem: InvoicePreviewDetailsVm;
  @Input() public appSideMenubarIsOpen: boolean;
  @Input() public invoiceSetting: InvoiceSetting;
  @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.sales;
  @ViewChild('searchElement') public searchElement: ElementRef;
  @Output() public deleteVoucher: EventEmitter<boolean> = new EventEmitter();
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();

  public filteredData: InvoicePreviewDetailsVm[] = [];
  public showMore: boolean = false;
  public showEditMode: boolean = false;
  public isSendSmsEnabled: boolean = false;
  public isVoucherDownloading: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _cdr: ChangeDetectorRef, private _toasty: ToasterService, private _proformaService: ProformaService) {
  }

  ngOnInit() {
    if (this.selectedItem) {
      this.downloadVoucher();
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
    this.downloadVoucher();
    this.showEditMode = false;
  }

  public downloadVoucher(fileType: string = '') {
    if (this.voucherType === 'sales') {

    } else {
      this.isVoucherDownloading = true;
      let request: ProformaDownloadRequest = new ProformaDownloadRequest();
      request.fileType = fileType;
      request.accountUniqueName = this.selectedItem.account.uniqueName;
      request.proformaNumber = this.selectedItem.voucherNumber;
      this._proformaService.download(request, 'proformas').subscribe(result => {
        if (result && result.status === 'success') {
          this.selectedItem.base64 = result.body;
        } else {
          this._toasty.errorToast(result.message, result.code);
        }
        this.isVoucherDownloading = false;
      }, (err) => {
        this._toasty.errorToast(err.message);
        this.isVoucherDownloading = false;
      });
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
