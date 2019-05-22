import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'proforma-add-bulk-items-component',
  templateUrl: './proforma-add-bulk-items.component.html',
  styleUrls: [`./proforma-add-bulk-items.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProformaAddBulkItemsComponent implements OnInit, OnChanges, OnDestroy {
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
  @Input() public data: IOption[] = [];
  @ViewChild('searchElement') public searchElement: ElementRef;

  public filteredData: IOption[] = [];

  constructor() {
  }

  ngOnInit() {
    fromEvent(this.searchElement.nativeElement, 'input').pipe(
      distinctUntilChanged(),
      debounceTime(700),
      map((e: any) => e.target.value)
    ).subscribe(res => {
      // search begins here..
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  ngOnDestroy(): void {
    //
  }
}
