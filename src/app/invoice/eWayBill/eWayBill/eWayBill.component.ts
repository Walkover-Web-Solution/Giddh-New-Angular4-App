import { Component, OnInit } from '@angular/core';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';
import { InvoiceService } from 'app/services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEwayBillAllList, Result } from 'app/models/api-models/Invoice';
import { base64ToBlob } from 'app/shared/helpers/helperFunctions';
import { ToasterService } from 'app/services/toaster.service';
import { saveAs } from 'file-saver';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ewaybill-component',
  templateUrl: './eWayBill.component.html',
  styleUrls: [`./eWayBill.component.scss`]
})

export class EWayBillComponent implements OnInit {
  public isGetAllEwaybillRequestInProcess$: Observable<boolean>;
  public isGetAllEwaybillRequestSuccess$: Observable<boolean>;
  public EwaybillLists: IEwayBillAllList;
  public selectedEway: Result;
  public modalRef: BsModalRef;

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

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
