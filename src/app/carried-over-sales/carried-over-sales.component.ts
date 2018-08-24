import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';

@Component({
  selector: 'carried-over-sales',
  templateUrl: './carried-over-sales.component.html',
  styles: []
})

export class CarriedOverSalesComponent implements OnInit, OnDestroy {
  public sundryDebtorsAccountsForAgingReport: IOption[] = [];

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }
}
