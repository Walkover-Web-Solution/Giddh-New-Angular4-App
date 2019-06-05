import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-proforma-list-component',
  templateUrl: './proforma-list.component.html',
  styleUrls: [`./proforma-list.component.scss`]
})

export class ProformaListComponent implements OnInit {
  public showResetAdvanceSearchIcon: boolean = false;
  public selectedItems: string[] = [];

  public showVoucherNoSearch: boolean = false;
  public voucherNumberInput: FormControl = new FormControl();

  public showCustomerSearch: boolean = false;
  public customerNameInput: FormControl = new FormControl();

  public sortRequestForUi: { sortBy: string, sort: string } = {sortBy: '', sort: ''};

  constructor() {
  }

  ngOnInit() {
  }

  public clickedOutside(event, el, fieldName: string) {

  }

  public toggleSearch(fieldName: string, el: any) {
    if (fieldName === 'voucherNumber') {
      this.showVoucherNoSearch = true;
      this.showCustomerSearch = false;
    } else if (fieldName === 'customerName') {
      this.showVoucherNoSearch = false;
      this.showCustomerSearch = false;
    }

    setTimeout(() => {
      el.focus();
    }, 200);
  }

  public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
    this.sortRequestForUi.sort = type;
    this.sortRequestForUi.sortBy = columnName;
  }
}
