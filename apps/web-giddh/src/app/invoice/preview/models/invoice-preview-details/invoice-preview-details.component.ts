import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ReceiptItem, ReciptResponse } from '../../../../models/api-models/recipt';

@Component({
  selector: 'invoice-preview-details-component',
  templateUrl: './invoice-preview-details.component.html',
  styleUrls: [`./invoice-preview-details.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicePreviewDetailsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public voucherData: ReciptResponse;
  @Input() public selectedItem: ReceiptItem;
  @ViewChild('searchElement') public searchElement: ElementRef;
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();

  public filteredData: ReceiptItem[] = [];
  public showMore: boolean = false;

  constructor(private _cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('voucherData' in changes && changes.voucherData.currentValue !== changes.voucherData.previousValue) {
      this.filteredData = changes.voucherData.currentValue.items;
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
}
