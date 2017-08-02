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
  constructor(
    private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions,
    private inventoryAction: InventoryAction
  ) {}

  public ngOnInit() {
    this.mfStockSearchRequest.from = moment().subtract(30, 'days').format('DD-MM-YYYY');
    this.mfStockSearchRequest.to = moment().format('DD-MM-YYYY');
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
    console.log(this.mfStockSearchRequest);
  }

  private getReports() {
    console.log ('in getReports', this.mfStockSearchRequest);
  }

}
