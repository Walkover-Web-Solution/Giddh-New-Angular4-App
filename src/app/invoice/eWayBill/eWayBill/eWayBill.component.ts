import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';
import { InvoiceService } from 'app/services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEwayBillAllList } from 'app/models/api-models/Invoice';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT } from 'app/shared/helpers/defaultDateFormat';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';


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



public selectedDate(value: any) {
  this.needToShowLoader = false;
  let from = moment(value.picker.startDate, 'DD-MM-YYYY').toDate();
  let to = moment(value.picker.endDate, 'DD-MM-YYYY').toDate();
}

@ViewChild(BsDatepickerDirective) public datepickers: BsDatepickerDirective;

private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private _invoiceService: InvoiceService,
    private _activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {

    this.isGetAllEwaybillRequestInProcess$ = this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestInProcess).pipe(takeUntil(this.destroyed$));
    this.isGetAllEwaybillRequestSuccess$ = this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestSuccess).pipe(takeUntil(this.destroyed$));
    this.store.dispatch(this.invoiceActions.getALLEwaybillList());
  }

  
  public ngOnInit(): void {
    // getALLEwaybillList();
 this.store.select(p => p.ewaybillstate.EwayBillList).pipe(takeUntil(this.destroyed$)).subscribe((o: IEwayBillAllList) => {
      if (o) {
        this.EwaybillLists = _.cloneDeep(o);
        console.log('EwaybillLists', this.EwaybillLists); // totalItems
  }
});
}

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}

openModalWithClass(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(
    template,
    Object.assign({}, { class: 'modal-lg modal-consolidated-details' })
  );
}

}
