import { IOption } from './../../theme/ng-select/option.interface';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { Select2OptionData } from '../../theme/select2';

const filter1 = [
  { label: 'Greater', value: 'greaterThan' },
  { label: 'Less Than', value: 'lessThan' },
  { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
  { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
  { label: 'Equals', value: 'equals' }
];

const filter2 = [
  { label: 'Quantity Inward', value: 'quantityInward' },
  // { name: 'Quantity Outward', uniqueName: 'quantityOutward' },
  { label: 'Voucher Number', value: 'voucherNumber' }
];

import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { Component, OnInit } from '@angular/core';
import { ManufacturingActions } from '../../actions/manufacturing/manufacturing.actions';
import { MfStockSearchRequestClass } from '../manufacturing.utility';
import { IMfStockSearchRequest } from '../../models/interfaces/manufacturing.interface';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InventoryAction } from '../../actions/inventory/inventory.actions';
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
  public filtersForSearchBy: IOption[] = filter2;
  public filtersForSearchOperation: IOption[] = filter1;
  public stockListDropDown: IOption[] = [];
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
    this.store.dispatch(this.inventoryAction.GetManufacturingStock());

    this.store.select(p => p.inventory).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o.manufacturingStockList) {
        if (o.manufacturingStockList.results) {
          this.stockListDropDown = [];
          _.forEach(o.manufacturingStockList.results, (unit: any) => {
            this.stockListDropDown.push({ label: ` ${unit.name} (${unit.uniqueName})`, value: unit.uniqueName });
          });
        }
      } else {
        this.store.dispatch(this.inventoryAction.GetManufacturingStock());
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
      this.store.dispatch(this.inventoryAction.GetManufacturingStock());
    });
  }

  public initializeSearchReqObj() {
    this.mfStockSearchRequest.product = '';
    this.mfStockSearchRequest.searchBy = '';
    this.mfStockSearchRequest.searchOperation = '';

    let f = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
    let t = moment().format(GIDDH_DATE_FORMAT);

    this.mfStockSearchRequest.from = f;
    this.mfStockSearchRequest.to = t;
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
    data.from = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
    data.to =  moment().format(GIDDH_DATE_FORMAT);
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
