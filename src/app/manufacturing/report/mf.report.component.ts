const filter1 = [
  {name: 'Greater', uniqueName: 'greaterThan'},
  {name: 'Less Than', uniqueName: 'lessThan'},
  {name: 'Greater Thank or Equals', uniqueName: 'greaterThanOrEquals'},
  {name: 'Less Thank or Equals', uniqueName: 'lessThanOrEquals'},
  {name: 'Equals', uniqueName: 'equals'}
];

const filter2 = [
  {name: 'Quantity Inward', uniqueName: 'quantityInward'},
  {name: 'Quantity Outward', uniqueName: 'quantityOutward'},
  {name: 'Voucher Number', uniqueName: 'voucherNumber'}
];

import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit } from '@angular/core';
import { ManufacturingActions } from '../../services/actions/manufacturing/manufacturing.actions';
import { MfStockSearchRequestClass } from '../manufacturing.utility';
import { IMfStockSearchRequest } from '../../models/interfaces/manufacturing.interface';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InventoryAction } from '../../services/actions/inventory/inventory.actions';
import * as _ from 'lodash';
import * as moment from 'moment';
import { StocksResponse } from '../../models/api-models/Inventory';
import { PaginationModule } from 'ngx-bootstrap';

@Component({
  templateUrl: './mf.report.component.html',
  styleUrls: ['./mf.report.component.css']
})

export class MfReportComponent implements OnInit {

  private mfStockSearchRequest: IMfStockSearchRequest = new MfStockSearchRequestClass();
  private filtersForSearchBy: any[] = filter2;
  private filtersForSearchOperation: any[] = filter1;
  private stockListDropDown: Select2OptionData[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private reportData: StocksResponse = null;
  constructor(
    private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions,
    private inventoryAction: InventoryAction
  ) {}

  public ngOnInit() {
    this.mfStockSearchRequest.from = moment().subtract(30, 'days').format('DD-MM-YYYY');
    this.mfStockSearchRequest.to = moment().format('DD-MM-YYYY');
    this.mfStockSearchRequest.page = 1;
    this.mfStockSearchRequest.count = 10;
    this.store.select(p => p.inventory).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o.stocksList) {
        if (o.stocksList.results) {
          _.forEach(o.stocksList.results, (unit) => {
            this.stockListDropDown.push({ text: ` ${unit.name} (${unit.uniqueName})`, id: unit.uniqueName });
          });
        }
      }else {
        this.store.dispatch(this.inventoryAction.GetStock());
      }
    });
    this.store.select(p => p.manufacturing).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o.reportData) {
        this.reportData = o.reportData;
      }
    });
  }

  private getReports() {
    this.store.dispatch(this.manufacturingActions.GetMfReport(this.mfStockSearchRequest));
  }

  private pageChanged(event: any): void {
    let data = _.cloneDeep(this.mfStockSearchRequest);
    data.page = event.page;
    this.store.dispatch(this.manufacturingActions.GetMfReport(data));
  }

}
