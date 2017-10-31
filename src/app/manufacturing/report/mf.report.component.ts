import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { Select2OptionData } from '../../theme/select2';

const filter1 = [
  { name: 'Greater', uniqueName: 'greaterThan' },
  { name: 'Less Than', uniqueName: 'lessThan' },
  { name: 'Greater Than or Equals', uniqueName: 'greaterThanOrEquals' },
  { name: 'Less Than or Equals', uniqueName: 'lessThanOrEquals' },
  { name: 'Equals', uniqueName: 'equals' }
];

const filter2 = [
  { name: 'Quantity Inward', uniqueName: 'quantityInward' },
  // { name: 'Quantity Outward', uniqueName: 'quantityOutward' },
  { name: 'Voucher Number', uniqueName: 'voucherNumber' }
];

import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { Component, OnInit } from '@angular/core';
import { ManufacturingActions } from '../../services/actions/manufacturing/manufacturing.actions';
import { MfStockSearchRequestClass } from '../manufacturing.utility';
import { IMfStockSearchRequest } from '../../models/interfaces/manufacturing.interface';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InventoryAction } from '../../services/actions/inventory/inventory.actions';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { StocksResponse } from '../../models/api-models/Inventory';
import { Router } from '@angular/router';

@Component({
  templateUrl: './mf.report.component.html',
  styleUrls: ['./mf.report.component.css']
})

export class MfReportComponent implements OnInit {

  public mfStockSearchRequest: IMfStockSearchRequest = new MfStockSearchRequestClass();
  public filtersForSearchBy: any[] = filter2;
  public filtersForSearchOperation: any[] = filter1;
  public stockListDropDown: Select2OptionData[] = [];
  public reportData: StocksResponse = null;
  public isReportLoading: boolean = true;
  public showFromDatePicker: boolean = false;
  public showToDatePicker: boolean = false;
  public moment = moment;
  public startDate: Date;
  public endDate: Date;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions,
    private inventoryAction: InventoryAction,
    private router: Router) {
    this.mfStockSearchRequest.product = '';
    this.mfStockSearchRequest.searchBy = '';
    this.mfStockSearchRequest.searchOperation = '';

    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 30);
    this.endDate.setDate(this.endDate.getDate());
    this.mfStockSearchRequest.dateRange = [this.startDate, this.endDate];
    this.mfStockSearchRequest.from = moment(this.startDate).format(GIDDH_DATE_FORMAT);
    this.mfStockSearchRequest.to = moment(this.endDate).format(GIDDH_DATE_FORMAT);
  }

  public ngOnInit() {
    this.initializeSearchReqObj();
    // Refresh the stock list
    this.store.dispatch(this.inventoryAction.GetStock());

    this.store.select(p => p.inventory).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o.stocksList) {
        if (o.stocksList.results) {
          this.stockListDropDown = [];
          _.forEach(o.stocksList.results, (unit: any) => {
            this.stockListDropDown.push({ text: ` ${unit.name} (${unit.uniqueName})`, id: unit.uniqueName });
          });
        }
      } else {
        this.store.dispatch(this.inventoryAction.GetStock());
      }
    });
    this.store.select(p => p.manufacturing).takeUntil(this.destroyed$).subscribe((o: any) => {
      this.isReportLoading = false;
      if (o.reportData) {
        this.reportData = o.reportData;
      }
    });
    this.getReportDataOnFresh();

    // Refresh stock list on company change
    this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$).distinct((val) => val === 'companyUniqueName').subscribe((value: any) => {
      this.isReportLoading = true;
      this.store.dispatch(this.inventoryAction.GetStock());
    });
  }

  public initializeSearchReqObj() {
    this.mfStockSearchRequest.product = '';
    this.mfStockSearchRequest.searchBy = '';
    this.mfStockSearchRequest.searchOperation = '';

    let f = moment().subtract(30, 'days');
    let t = moment();

    this.mfStockSearchRequest.from = String(f);
    this.mfStockSearchRequest.to = String(t);
    this.mfStockSearchRequest.page = 1;
    this.mfStockSearchRequest.count = 10;
  }
  public goToCreateNewPage() {
    this.store.dispatch(this.manufacturingActions.RemoveMFItemUniqueNameFomStore());
    this.router.navigate(['/pages/manufacturing/edit']);
  }

  public getReports() {
    this.store.dispatch(this.manufacturingActions.GetMfReport(this.mfStockSearchRequest));
    this.mfStockSearchRequest = new MfStockSearchRequestClass();
    this.initializeSearchReqObj();
  }

  public pageChanged(event: any): void {
    let data = _.cloneDeep(this.mfStockSearchRequest);
    let from = moment(data.from).format(GIDDH_DATE_FORMAT);
    let to = moment(data.to).format(GIDDH_DATE_FORMAT);
    if (from !== 'Invalid date' && to !== 'Invalid date') {
      data.from = from;
      data.to = to;
    }
    data.page = event.page;
    this.store.dispatch(this.manufacturingActions.GetMfReport(data));
  }

  public editMFItem(item) {
    if (item.uniqueName) {
      this.store.dispatch(this.manufacturingActions.SetMFItemUniqueNameInStore(item.uniqueName));
      this.router.navigate(['/pages/manufacturing/edit']);
    }
  }

  public getReportDataOnFresh() {
    let data = _.cloneDeep(this.mfStockSearchRequest);
    data.from = null;
    data.to = null;
    this.store.dispatch(this.manufacturingActions.GetMfReport(data));
  }

  public clearDate(model: string) {
    this.mfStockSearchRequest[model] = '';
  }

  public setToday(model: string) {
    this.mfStockSearchRequest[model] = moment();
  }

  public checkValueField(val: string) {
    let patt = new RegExp(/^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/);
    if (val && !patt.test(val)) {
        let char = val.charAt(val.length - 1);
        val = val.replace(new RegExp(char, 'g'), '');
        this.mfStockSearchRequest['searchValue'] = val;
    }
  }

  public bsValueChange(event: any) {
    if (event) {
      this.mfStockSearchRequest.from = moment(event[0]).format(GIDDH_DATE_FORMAT);
      this.mfStockSearchRequest.to = moment(event[1]).format(GIDDH_DATE_FORMAT);
    }
  }
}
