import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';
import { TaxResponse } from '../../models/api-models/Company';

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
  public newTaxObj: TaxResponse = new TaxResponse();

  constructor() {
  }

  ngOnInit() {
  }
}
