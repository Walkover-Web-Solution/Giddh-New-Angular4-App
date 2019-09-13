import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { InvoiceReceiptActions } from '../../../actions/invoice/receipt/receipt.actions';
import { ReportsDetailedRequestFilter, SalesRegisteDetailedResponse } from '../../../models/api-models/Reports';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs';
import { BsDropdownDirective } from 'ngx-bootstrap';


@Component({
  selector: 'sales-register-expand',
  templateUrl: './sales.register.expand.component.html',
  styleUrls: ['./sales.register.expand.component.scss']
})
export class SalesRegisterExpandComponent implements OnInit {

  public SalesRegisteDetailedItems: SalesRegisteDetailedResponse;
  public from: string;
  public to: string;
  public SalesRegisteDetailedResponse$: Observable<SalesRegisteDetailedResponse>;
  public isGetSalesDetailsInProcess$: Observable<boolean>;
  public isGetSalesDetailsSuccess$: Observable<boolean>;
  public getDetailedsalesRequestFilter: ReportsDetailedRequestFilter = new ReportsDetailedRequestFilter();
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
  public monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  public modalUniqueName: string;
  public imgPath: string;
  public expand: boolean = false;
  public showFieldFilter = {
    voucherType: true,
    voucherNo: true,
    productService: false,
    qtyRate: false,
    value: false,
    discount: false,
    tax: false
  };


  bsValue = new Date();
  items = [
    {
      "account": {
        "name": "aa",
        "uniqueName": "aa"
      },
      "voucherType": "sales",
      "voucherNumber": "20190401-1",
      "creditTotal": 111,
      "debitTotal": 0,
      "type": "INVOICE",
      "uniqueName": "ylre4lecx6zwv2kt4zrwxu7ykfccs0",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": 0,
      "netTotal": 111,
      "date": "01-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "104",
      "creditTotal": 1000,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "0lf1554112537814",
      "discountTotal": 0,
      "taxTotal": 180,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 1000,
      "date": "01-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "105",
      "creditTotal": 400,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "1241554117954223",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [
        {
          "stock": {
            "name": "Fridge",
            "uniqueName": "fridge"
          },
          "quantity": 1,
          "amount": 22500,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "Fridge",
            "uniqueName": "fridge"
          },
          "quantity": 1,
          "amount": 22500,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "cooler",
            "uniqueName": "cooler"
          },
          "quantity": 1,
          "amount": 22500,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "fan",
            "uniqueName": "fan"
          },
          "quantity": 1,
          "amount": 22500,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        }
      ],
      "roundOff": null,
      "netTotal": 400,
      "date": "01-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "106",
      "creditTotal": 2000,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "xc31554117976723",
      "discountTotal": 0,
      "taxTotal": 360,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 2000,
      "date": "01-04-2019"
    },
    {
      "account": {
        "name": "Customer 2",
        "uniqueName": "customer1"
      },
      "voucherType": "sales",
      "voucherNumber": "SO513",
      "creditTotal": 22500,
      "debitTotal": 0,
      "type": "INVOICE",
      "uniqueName": "ytq3x0fwj87bbv63xa5573j8whqz0r",
      "discountTotal": 0,
      "taxTotal": 4050,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [
        {
          "stock": {
            "name": "Fridge",
            "uniqueName": "fridge"
          },
          "quantity": 1,
          "amount": 22500,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "Fridge",
            "uniqueName": "fridge"
          },
          "quantity": 1,
          "amount": 22500,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "cooler",
            "uniqueName": "cooler"
          },
          "quantity": 1,
          "amount": 22500,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "fan",
            "uniqueName": "fan"
          },
          "quantity": 1,
          "amount": 22500,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        }
      ],
      "roundOff": 0,
      "netTotal": 22500,
      "date": "02-04-2019"
    },
    {
      "account": {
        "name": "Customer 123",
        "uniqueName": "customer"
      },
      "voucherType": "credit note",
      "voucherNumber": "CR-20190402-1",
      "creditTotal": 0,
      "debitTotal": 45000,
      "type": "VOUCHER",
      "uniqueName": "ettf7jei836o3bd6585kj2s7zqo3ry",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [
        {
          "stock": {
            "name": "AC",
            "uniqueName": "ac"
          },
          "quantity": 1,
          "amount": 45000,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        }
      ],
      "roundOff": 0,
      "netTotal": 45000,
      "date": "02-04-2019"
    },
    {
      "account": {
        "name": "Customer 123",
        "uniqueName": "customer"
      },
      "voucherType": "credit note",
      "voucherNumber": "CR-20190402-2",
      "creditTotal": 0,
      "debitTotal": 25000,
      "type": "VOUCHER",
      "uniqueName": "fnmna1e6wqgildqnekpqinbr8fm4ig",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [
        {
          "stock": {
            "name": "TV",
            "uniqueName": "tv"
          },
          "quantity": 1,
          "amount": 25000,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "TV",
            "uniqueName": "tv"
          },
          "quantity": 1,
          "amount": 25000,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "TV",
            "uniqueName": "tv"
          },
          "quantity": 1,
          "amount": 25000,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "TV",
            "uniqueName": "tv"
          },
          "quantity": 1,
          "amount": 25000,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        }
      ],
      "roundOff": 0,
      "netTotal": 25000,
      "date": "02-04-2019"
    },
    {
      "account": {
        "name": "Customer 123",
        "uniqueName": "customer"
      },
      "voucherType": "credit note",
      "voucherNumber": "CR-20190402-3",
      "creditTotal": 0,
      "debitTotal": 120,
      "type": "VOUCHER",
      "uniqueName": "00t21neawozkl1431jiuaby2mi8dda",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [
        {
          "stock": {
            "name": "UNO",
            "uniqueName": "uno1"
          },
          "quantity": 1,
          "amount": 120,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        }
      ],
      "roundOff": 0,
      "netTotal": 120,
      "date": "02-04-2019"
    },
    {
      "account": {
        "name": "Customer 123",
        "uniqueName": "customer"
      },
      "voucherType": "credit note",
      "voucherNumber": "CR-20190402-4",
      "creditTotal": 0,
      "debitTotal": 45000,
      "type": "VOUCHER",
      "uniqueName": "xi13pyc05bat4825hwhrw2gs60kbw3",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [
        {
          "stock": {
            "name": "AC",
            "uniqueName": "ac"
          },
          "quantity": 1,
          "amount": 45000,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "AC",
            "uniqueName": "ac"
          },
          "quantity": 1,
          "amount": 45000,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        },
        {
          "stock": {
            "name": "AC",
            "uniqueName": "ac"
          },
          "quantity": 1,
          "amount": 45000,
          "rate": null,
          "unit": {
            "code": "nos",
            "hierarchicalQuantity": 1,
            "parentStockUnit": null,
            "quantityPerUnit": 1,
            "displayQuantityPerUnit": 1,
            "name": "Number"
          },
          "warehouse": null,
          "stockLocation": null,
          "hsnNumber": null,
          "sacNumber": null,
          "skuCode": null
        }
      ],
      "roundOff": 0,
      "netTotal": 45000,
      "date": "02-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "108",
      "creditTotal": 2000,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "0ql1554288457408",
      "discountTotal": 0,
      "taxTotal": 180,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 2000,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "109",
      "creditTotal": 2000,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "5111554289252058",
      "discountTotal": 0,
      "taxTotal": 180,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 2000,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "115",
      "creditTotal": 600,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "rk81554291383789",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 600,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "116",
      "creditTotal": 600,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "qtj1554291383905",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 600,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "113",
      "creditTotal": 600,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "kmw1554291368418",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 600,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "114",
      "creditTotal": 600,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "12x1554291368525",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 600,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "111",
      "creditTotal": 600,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "xr71554291368167",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 600,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "112",
      "creditTotal": 600,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "u6j1554291368298",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 600,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "110",
      "creditTotal": 600,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "6hv1554291367987",
      "discountTotal": 0,
      "taxTotal": 0,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 600,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Customer 123",
        "uniqueName": "customer"
      },
      "voucherType": "sales",
      "voucherNumber": "120",
      "creditTotal": 110,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "lcm1554295068351",
      "discountTotal": 0,
      "taxTotal": 19.8,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 110,
      "date": "03-04-2019"
    },
    {
      "account": {
        "name": "Cash",
        "uniqueName": "cash"
      },
      "voucherType": "sales",
      "voucherNumber": "121",
      "creditTotal": 2000,
      "debitTotal": 0,
      "type": "ENTRY",
      "uniqueName": "dl01554296568787",
      "discountTotal": 0,
      "taxTotal": 360,
      "tdsTotal": 0,
      "tcsTotal": 0,
      "stocks": [],
      "roundOff": null,
      "netTotal": 2000,
      "date": "03-04-2019"
    }
  ];

  constructor(private store: Store<AppState>, private invoiceReceiptActions: InvoiceReceiptActions, private activeRoute: ActivatedRoute, private router: Router) {

    this.SalesRegisteDetailedResponse$ = this.store.pipe(select(p => p.receipt.SalesRegisteDetailedResponse), takeUntil(this.destroyed$));
    this.isGetSalesDetailsInProcess$ = this.store.pipe(select(p => p.receipt.isGetSalesDetailsInProcess), takeUntil(this.destroyed$));
    this.isGetSalesDetailsSuccess$ = this.store.pipe(select(p => p.receipt.isGetSalesDetailsSuccess), takeUntil(this.destroyed$));

  }

  ngOnInit() {

    this.imgPath = isElectron ? 'assets/icon/' : AppUrl + APP_FOLDER + 'assets/icon/';
    this.getDetailedsalesRequestFilter.page = 1;
    this.getDetailedsalesRequestFilter.count = 20;


    this.activeRoute.queryParams.pipe(take(1)).subscribe(params => {
      if (params.from && params.to) {
        this.from = params.from;
        this.to = params.to;
        this.getDetailedsalesRequestFilter.from = this.from;
        this.getDetailedsalesRequestFilter.to = this.to;

      }
    });
    this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
    this.SalesRegisteDetailedResponse$.pipe(takeUntil(this.destroyed$)).subscribe((res: SalesRegisteDetailedResponse) => {
      console.log('this.SalesRegisteDetailedResponse', res);
      if (res) {
        this.SalesRegisteDetailedItems = res;
        // this.SalesRegisteDetailedItems.items = this.items;
        _.map(this.SalesRegisteDetailedItems.items, (obj: any) => {
          obj.date = this.getDateToDMY(obj.date);
        });
      }
    });
  }

  public getDetailedSalesReport(SalesDetailedfilter) {
    this.store.dispatch(this.invoiceReceiptActions.GetSalesRegistedDetails(SalesDetailedfilter));
  }
  public pageChanged(ev: any): void {
    if (ev.page === this.getDetailedsalesRequestFilter.page) {
      return;
    }
    this.getDetailedsalesRequestFilter.page = ev.page;
    this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
  }
  public sortbyApi(key, ord) {

    this.getDetailedsalesRequestFilter.sortBy = key;
    this.getDetailedsalesRequestFilter.sort = ord;
    this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
  }
  /**
  * emitExpand
  */
  public emitExpand() {
    this.expand = !this.expand;
  }
  public columnFilter(event, column) {
    if (event && column) {
      this.showFieldFilter[column] = event;
    }
  }
  public hideListItems() {
    this.filterDropDownList.hide();
  }
  public goToDashboard() {
    this.router.navigate(['/pages/reports']);
  }

  public getDateToDMY(selecteddate) {
    let date = selecteddate.split('-');
    if (date.length === 3) {
      let month = this.monthNames[parseInt(date[1]) - 1];
      let year = date[2].substr(2, 4);
      return date[0] + ' ' + month + ' ' + year;
    } else {
      return selecteddate;
    }

  }
}
