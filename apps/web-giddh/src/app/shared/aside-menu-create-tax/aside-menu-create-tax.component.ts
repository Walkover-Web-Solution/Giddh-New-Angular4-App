import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';
import { TaxResponse } from '../../models/api-models/Company';
import { ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'aside-menu-create-tax-component',
  templateUrl: './aside-menu-create-tax.component.html',
  styleUrls: [`./aside-menu-create-tax.component.scss`]
})

export class AsideMenuCreateTaxComponent implements OnInit {
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();

  public taxList: IOption[] = [
    {label: 'GST', value: 'GST'},
    {label: 'InputGST', value: 'InputGST'},
    {label: 'VAT', value: 'vat'},
    {label: 'TDS', value: 'tds'},
    {label: 'TCS', value: 'tcs'},
    {label: 'CESS', value: 'cess'},
    {label: 'Others', value: 'others'},

  ];
  public duration: IOption[] = [
    {label: 'Monthly', value: 'MONTHLY'},
    {label: 'Quarterly', value: 'QUARTERLY'},
    {label: 'Half-Yearly', value: 'HALFYEARLY'},
    {label: 'Yearly', value: 'YEARLY'}
  ];
  public days: IOption[] = [];
  public newTaxObj: TaxResponse = new TaxResponse();
  public flattenAccountsOptions: IOption[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    for (let i = 1; i <= 31; i++) {
      this.days.push({label: i.toString(), value: i.toString()});
    }
  }

  ngOnInit() {
    this.store
      .pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$))
      .subscribe(data => {
        if (data && data.length) {
          let arr: IOption[] = [];
          data.forEach(f => {
            arr.push({label: `${f.name} - (${f.uniqueName})`, value: f.uniqueName});
          });
          this.flattenAccountsOptions = arr;
        }
      });
  }

  public customAccountFilter(term: string, item: IOption) {
    return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
  }

  public customDateSorting(a: IOption, b: IOption) {
    return (parseInt(a.label) - parseInt(b.label));
  }
}
