import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ReceiptItem, ReciptResponse } from '../../../../models/api-models/recipt';
import { InvoiceSetting } from '../../../../models/interfaces/invoice.setting.interface';

@Component({
  selector: 'invoice-preview-details-component',
  templateUrl: './invoice-preview-details.component.html',
  styleUrls: [`./invoice-preview-details.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicePreviewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() public voucherData: ReciptResponse;
  @Input() public selectedItem: ReceiptItem;
  @Input() public sideMenubarIsOpen: boolean;
  @Input() public invoiceSetting: InvoiceSetting;
  @ViewChild('searchElement') public searchElement: ElementRef;
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();

  public filteredData: ReceiptItem[] = [];
  public showMore: boolean = false;
  public showEditMode: boolean = false;
  public isSendSmsEnabled: boolean = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _cdr: ChangeDetectorRef) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('voucherData' in changes && changes.voucherData.currentValue !== changes.voucherData.previousValue) {
      this.filteredData = changes.voucherData.currentValue.items;
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
        this.filteredData = this.voucherData.items.filter(item => {
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

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
