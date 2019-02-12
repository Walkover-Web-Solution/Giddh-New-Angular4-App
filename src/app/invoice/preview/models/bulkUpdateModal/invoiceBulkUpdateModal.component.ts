import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { CustomTemplateResponse } from '../../../../models/api-models/Invoice';
import { take, takeUntil } from 'rxjs/operators';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { Configuration } from '../../../../app.constant';
import { LEDGER_API } from '../../../../services/apiurls/ledger.api';
import { ToasterService } from '../../../../services/toaster.service';

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
  public fileUploadOptions: UploaderOptions;
  public uploadInput: EventEmitter<UploadInput>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions, private _toaster: ToasterService) {
    this.fileUploadOptions = {concurrency: 0};
    this.allTemplates$ = this.store.pipe(select(s => s.invoiceTemplate.customCreatedTemplates), takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.uploadInput = new EventEmitter<UploadInput>();
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

  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
      //   method: 'POST',
      //   fieldName: 'file',
      //   data: {entries: _.cloneDeep(this.entryUniqueNamesForBulkAction).join()},
      //   headers: {'Session-Id': sessionKey},
      // };
      // this.uploadInput.emit(event);
    } else if (output.type === 'start') {
      // this.isFileUploading = true;
      // this._loaderService.show();
    } else if (output.type === 'done') {
      // this._loaderService.hide();
      if (output.file.response.status === 'success') {
        // this.entryUniqueNamesForBulkAction = [];
        // this.getTransactionData();
        // this.isFileUploading = false;
        // this._toaster.successToast('file uploaded successfully');
      } else {
        // this.isFileUploading = false;
        // this._toaster.errorToast(output.file.response.message);
      }
    }
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
