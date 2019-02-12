import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { CustomTemplateResponse } from '../../../../models/api-models/Invoice';
import { takeUntil } from 'rxjs/operators';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';

@Component({
  selector: 'invoice-bulk-update-modal-component',
  templateUrl: './invoiceBulkUpdateModal.component.html',
  styleUrls: ['./invoiceBulkUpdateModal.component.scss']
})

export class InvoiceBulkUpdateModalComponent implements OnInit {
  @Input() public voucherType: string = '';
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public fieldOptions: IOption[] = [
    {label: 'PDF Template', value: 'pdf-template'},
    {label: 'Notes', value: 'notes'},
    {label: 'Signature', value: 'signature'},
    {label: 'Due Date', value: 'due-date'},
    {label: 'Shipping Details', value: 'shipping-details'},
    {label: 'Custom Fields', value: 'custom-fields'}
  ];
  public selectedField: string;
  public allTemplates$: Observable<CustomTemplateResponse[]>;
  public allTemplatesOptions: IOption[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions) {
    this.allTemplates$ = this.store.pipe(select(s => s.invoiceTemplate.customCreatedTemplates), takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    let templateType = this.voucherType === 'debit note' || this.voucherType === 'credit note' ? 'voucher' : 'invoice';
    this.store.dispatch(this.invoiceActions.getAllCreatedTemplates(templateType));
    this.allTemplates$.subscribe(templates => {
      if (templates && templates.length) {
        this.allTemplatesOptions = [];
        templates.forEach(tmpl => {
          this.allTemplatesOptions.push({
            label: tmpl.name, value: tmpl.uniqueName
          });
        });
      }
    });
  }

  public selectedOption(item: IOption) {
    this.selectedField = item.value;
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
