import { BsDatepickerDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { Store } from '@ngrx/store';
import { ToasterService } from '../../../services/toaster.service';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { base64ToBlob } from '../../../shared/helpers/helperFunctions';
import { NgForm } from '@angular/forms';
import { IEwayBillAllList, IEwayBillCancel, Result } from '../../../models/api-models/Invoice';
import { AppState } from '../../../store';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { IOption } from '../../../theme/ng-select/option.interface';

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
    {value: '1', label: 'Duplicate'},
    {value: '2', label: 'Order cancelled'},
    {value: '3', label: 'Data Entry Mistake'},
    {value: '4', label: 'Others'},
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
      Object.assign({}, {class: 'modal-lg modal-consolidated-details'})
    );
  }

  public cancelEwayBill(cancelEway: NgForm) {
    this.cancelEwayRequest = _.cloneDeep(cancelEway.value);
    this.cancelEwayRequest.ewbNo = this.selectedEwayItem.ewbNo;
    this._invoiceService.cancelEwayBill(this.cancelEwayRequest).subscribe(d => {
      console.log('cancelEwayBill', d);
      if (d.status === 'success') {
        this._toaster.successToast(d.body);
      } else {
        this._toaster.errorToast(d.body);
      }
    });
  }
}
