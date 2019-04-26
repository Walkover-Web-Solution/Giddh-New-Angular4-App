import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';
import { InvoiceService } from 'app/services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEwayBillAllList, Result, IEwayBillCancel } from 'app/models/api-models/Invoice';
import { base64ToBlob } from 'app/shared/helpers/helperFunctions';
import { ToasterService } from 'app/services/toaster.service';
import { saveAs } from 'file-saver';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT } from 'app/shared/helpers/defaultDateFormat';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { NgForm } from '@angular/forms';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';

@Component({
  selector: 'app-ewaybill-component',
  templateUrl: './eWayBill.component.html',
  styleUrls: [`./eWayBill.component.scss`]
})

export class EWayBillComponent implements OnInit {
public isGetAllEwaybillRequestInProcess$: Observable<boolean>;
public isGetAllEwaybillRequestSuccess$: Observable<boolean>;
public EwaybillLists: IEwayBillAllList;
public modalRef: BsModalRef;
public giddhDateFormat: string = GIDDH_DATE_FORMAT;
public needToShowLoader: boolean = true;
public selectedEwayItem: any;
public cancelEwayRequest: IEwayBillCancel = {
  ewbNo: null,
  cancelRsnCode: null,
  cancelRmrk: null,
};
  @ViewChild('cancelEwayForm') public cancelEwayForm: NgForm;

public datePickerOptions: any = {
  hideOnEsc: true,
  locale: {
    applyClass: 'btn-green',
    applyLabel: 'Go',
    fromLabel: 'From',
    format: 'D-MMM-YY',
    toLabel: 'To',
    cancelLabel: 'Cancel',
    customRangeLabel: 'Custom range'
  },
  ranges: {
    'Last 1 Day': [
      moment().subtract(1, 'days'),
      moment()
    ],
    'Last 7 Days': [
      moment().subtract(6, 'days'),
      moment()
    ],
    'Last 30 Days': [
      moment().subtract(29, 'days'),
      moment()
    ],
    'Last 6 Months': [
      moment().subtract(6, 'months'),
      moment()
    ],
    'Last 1 Year': [
      moment().subtract(12, 'months'),
      moment()
    ]
  },
  startDate: moment().subtract(30, 'days'),
  endDate: moment()
};

 public ewayCancelReason: IOption[] = [
    { value: '1', label: 'Duplicate' },
    { value: '2', label: 'Order cancelled' },
    { value: '3', label: 'Data Entry Mistake' },
    { value: '4', label: 'Others' },
  ];
@ViewChild(BsDatepickerDirective) public datepickers: BsDatepickerDirective;
  public selectedEway: Result;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private _invoiceService: InvoiceService,
    private _activatedRoute: ActivatedRoute,
    private _toaster: ToasterService,
    private modalService: BsModalService
  ) {

    this.isGetAllEwaybillRequestInProcess$ = this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestInProcess).pipe(takeUntil(this.destroyed$));
    this.isGetAllEwaybillRequestSuccess$ = this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestSuccess).pipe(takeUntil(this.destroyed$));
    this.store.dispatch(this.invoiceActions.getALLEwaybillList());
  }

public selectedDate(value: any) {
  this.needToShowLoader = false;
  let from = moment(value.picker.startDate, 'DD-MM-YYYY').toDate();
  let to = moment(value.picker.endDate, 'DD-MM-YYYY').toDate();
}

  public ngOnInit(): void {
    // getALLEwaybillList();
    this.store.select(p => p.ewaybillstate.EwayBillList).pipe(takeUntil(this.destroyed$)).subscribe((o: IEwayBillAllList) => {
      if (o) {
        this.EwaybillLists = _.cloneDeep(o);
        //    console.log('EwaybillLists', this.EwaybillLists); // totalItems
      }
    });
  }
  public onSelectEwayDownload(eway: Result) {
    this.selectedEway = _.cloneDeep(eway);
    this._invoiceService.DownloadEwayBills(this.selectedEway.ewbNo).subscribe(d => {
      console.log('d...', d);
      if (d.status === 'success') {
        let blob = base64ToBlob(d.body, 'application/pdf', 512);
        return saveAs(blob, `${this.selectedEway.ewbNo} - ${this.selectedEway.customerName}.pdf`);
      } else {
        this._toaster.errorToast(d.message);
      }
    });
  }
  public onSelectEwayDetailedDownload(ewayItem: Result) {
    this.selectedEway = _.cloneDeep(ewayItem);
    this._invoiceService.DownloadDetailedEwayBills(this.selectedEway.ewbNo).subscribe(d => {
      if (d.status === 'success') {
        let blob = base64ToBlob(d.body, 'application/pdf', 512);
        return saveAs(blob, `${this.selectedEway.ewbNo} - ${this.selectedEway.customerName}.pdf`);
      } else {
        this._toaster.errorToast(d.message);
      }
    });
  }

  public openModal(ewayItem: any, template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.selectedEwayItem = ewayItem;
  }

public openModalWithClass(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(
    template,
    Object.assign({}, { class: 'modal-lg modal-consolidated-details' })
  );
}
 public cancelEwayBill(cancelEway: NgForm) {
   debugger;
    this.cancelEwayRequest = _.cloneDeep(cancelEway.value);
    this.cancelEwayRequest.ewbNo = this.selectedEwayItem.ewbNo ;
    this._invoiceService.cancelEwayBill(this.cancelEwayRequest).subscribe(d => {
      console.log('cancelEwayBill', d);
      if (d.status === 'success') {
    //
      } else {
        this._toaster.errorToast(d.message);
      }
    });
  }
}
