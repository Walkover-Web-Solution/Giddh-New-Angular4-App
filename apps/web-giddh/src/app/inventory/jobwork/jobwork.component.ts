import { Component, HostListener, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/store';
import { InventoryReportActions } from '../../../app/actions/inventory/inventory.report.actions';
import { AdvanceFilterOptions, InventoryFilter, InventoryReport } from '../../../app/models/api-models/Inventory-in-out';
import { IOption } from '../../../app/theme/ng-virtual-select/sh-options.interface';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { InvViewService } from '../inv.view.service';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';

@Component({
  selector: 'jobwork',
  templateUrl: './jobwork.component.html',
  styleUrls: ['./jobwork.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0);'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0);'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class JobworkComponent implements OnInit, OnDestroy {
  public asideTransferPaneState: string = 'out';
  @ViewChild('advanceSearchModel') public advanceSearchModel: ModalDirective;
  @ViewChild('senderName') public senderName: ElementRef;
  @ViewChild('receiverName') public receiverName: ElementRef;
  @ViewChild('productName') public productName: ElementRef;
  @ViewChild('comparisionFilter') public comparisionFilter: ShSelectComponent;

  public senderUniqueNameInput: FormControl = new FormControl();
  public receiverUniqueNameInput: FormControl = new FormControl();
  public productUniqueNameInput: FormControl = new FormControl();
  public showWelcomePage: boolean = true;
  public showSenderSearch: boolean = false;
  public showReceiverSearch: boolean = false;
  public showProductSearch: boolean = false;
  public updateDescriptionIdx: number = null;
  public _DDMMYYYY: string = 'DD-MM-YYYY';
  // modal advance search
  public isFilterCorrect: boolean = false;
  public advanceSearchForm: FormGroup;
  public COMPARISON_FILTER = [
    { label: 'Equals', value: '=' },
    { label: 'Greater Than', value: '>' },
    { label: 'Less Than', value: '<' },
    { label: 'Exclude', value: '!' }
  ];
  public VOUCHER_TYPES: any[] = [

    {
      "value": "inward",
      "label": "Inward note",
      "checked": true
    },
    {
      "value": "outward",
      "label": "Outward Note",
      "checked": true
    },
    {
      "value": "transfer",
      "label": "Transfer Note",
      "checked": true
    }
  ];
  public datePickerOptions: any = {
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'Last 1 Day': [
        moment().subtract(1, 'days'),
        moment()
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days'),
        moment()
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days'),
        moment()
      ],
      'Last 6 Months': [
        moment().subtract(6, 'months'),
        moment()
      ],
      'Last 1 Year': [
        moment().subtract(12, 'months'),
        moment()
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };
  public inventoryReport: InventoryReport;
  public filter: InventoryFilter = {};
  public stockOptions: IOption[] = [];
  public startDate: string = moment().subtract(30, 'days').format(this._DDMMYYYY);
  public endDate: string = moment().format(this._DDMMYYYY);
  public uniqueName: string;
  public type: string;
  public reportType: string;
  public nameStockOrPerson: string;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _router: ActivatedRoute, private router: Router,
    private inventoryReportActions: InventoryReportActions,
    private inventoryService: InventoryService,
    private _toasty: ToasterService,
    private fb: FormBuilder,
    private invViewService: InvViewService,
    private _store: Store<AppState>) {

    // on reload page
    let len = document.location.pathname.split('/').length;
    this.uniqueName = document.location.pathname.split('/')[len - 1];
    this.type = document.location.pathname.split('/')[len - 2];
    if (this.uniqueName && this.type === 'stock' || this.type === 'person') {
      this.showWelcomePage = false;
      this.applyFilters(1, true);
    } else {
      this.showWelcomePage = true;
    }
    // get view from sidebar while clicking on person/stock
    this.invViewService.getJobworkActiveView().subscribe(v => {
      this.initVoucherType();
      this.showWelcomePage = false;
      this.type = v.view;
      if (!v.uniqueName) {
        let len = document.location.pathname.split('/').length;
        this.uniqueName = document.location.pathname.split('/')[len - 1];
      }
      this.uniqueName = v.uniqueName;
      this.nameStockOrPerson = v.name;
      if (this.uniqueName) {
        if (this.type === 'person') {
          this.filter.includeSenders = true;
          this.filter.includeReceivers = true;
          this.filter.receivers = [this.uniqueName];
          this.filter.senders = [this.uniqueName];
          this.applyFilters(1, true);
        } else {
          this.applyFilters(1, false);
        }
      }
    });

    this._store.select(p => p.inventoryInOutState.inventoryReport)
      .subscribe(p => this.inventoryReport = p);
    this._store.select(p => ({ stocksList: p.inventory.stocksList, inventoryUsers: p.inventoryInOutState.inventoryUsers }))
      .subscribe(p => p.inventoryUsers && p.stocksList &&
        (this.stockOptions = p.stocksList.results.map(r => ({ label: r.name, value: r.uniqueName, additional: 'stock' }))
          .concat(p.inventoryUsers.map(r => ({ label: r.name, value: r.uniqueName, additional: 'person' })))));
  }

  public ngOnInit() {
    // initialization for voucher type array initially all selected
    this.initVoucherType();
    // Advance search modal
    this.advanceSearchForm = this.fb.group({
      filterAmount: ['', [Validators.pattern('[0-9]+([,.][0-9]+)?$')]],
      filterCategory: [''],
    });

    this.senderUniqueNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      this.filter.senderName = s;
      this.isFilterCorrect = true;
      this.applyFilters(1, true);
      if (s === '') {
        this.showSenderSearch = false;
      }
    });
    this.receiverUniqueNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      this.filter.receiverName = s;
      this.isFilterCorrect = true;
      this.applyFilters(1, true);
      if (s === '') {
        this.showReceiverSearch = false;
      }
    });
    // this.productUniqueNameInput.valueChanges.pipe(  // enable after api change for product search
    //   debounceTime(700),
    //   distinctUntilChanged(),
    //   takeUntil(this.destroyed$)
    // ).subscribe(s => {
    //   this.filter.productName = s;
    //   this.applyFilters(1, true);
    //   if (s === '') {
    //     this.showReceiverSearch = false;
    //   }
    // });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public initVoucherType() {
    // initialization for voucher type array inially all selected
    this.filter.voucherType = [];
    this.VOUCHER_TYPES.forEach(element => {
      element.checked = true;
      this.filter.voucherType.push(element.value);
    });
  }
  public dateSelected(val) {
    const { startDate, endDate } = val.picker;
    this.startDate = startDate.format(this._DDMMYYYY);
    this.endDate = endDate.format(this._DDMMYYYY);
    this.applyFilters(1, true);
  }

  /**
   * updateDescription
   */
  public updateDescription(txn) {
    console.log('txn', txn);
    this.updateDescriptionIdx = null;
    this._toasty.infoToast('Upcoming feature');
    return;
    // if (txn.description) {
    //   this.inventoryService.updateDescription(txn.description, txn.uniqueName).subscribe(res => {
    //     if (res.status === 'success') {
    //       this.updateDescriptionIdx = null;
    //       txn.description = _.cloneDeep(res.body.description);
    //     }
    //   });
    // }
  }

  // focus on click search box
  public showSearchBox(type: string) {
    if (type === 'sender') {
      this.showSenderSearch = !this.showSenderSearch;
      setTimeout(() => {
        this.senderName.nativeElement.focus();
        this.senderName.nativeElement.value = null;
      }, 100);
    } else if (type === 'receiver') {
      this.showReceiverSearch = !this.showReceiverSearch;
      setTimeout(() => {
        this.receiverName.nativeElement.focus();
        this.receiverName.nativeElement.value = null;
      }, 100);
    }
    else if (type === 'product') {
      this.showProductSearch = !this.showProductSearch;
      setTimeout(() => {
        this.receiverName.nativeElement.focus();
        this.receiverName.nativeElement.value = null;
      }, 100);
    }
  }


  public compareChanged(option: IOption) {
    switch (option.value) {
      case '>':
        this.filter.quantityNotEquals = false;
        this.filter.quantityGreaterThan = true;
        this.filter.quantityEqualTo = false;
        this.filter.quantityLessThan = false;
        break;
      case '<':
        this.filter.quantityNotEquals = false;
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = false;
        this.filter.quantityLessThan = true;
        break;
      case '<=':
        this.filter.quantityNotEquals = false;
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = true;
        this.filter.quantityLessThan = true;
        break;
      case '>=':
        this.filter.quantityNotEquals = false;
        this.filter.quantityGreaterThan = true;
        this.filter.quantityEqualTo = true;
        this.filter.quantityLessThan = false;
        break;
      case '=':
        this.filter.quantityNotEquals = false;
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = true;
        this.filter.quantityLessThan = false;
        break;
      case '!':
        this.filter.quantityNotEquals = true;
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = false;
        this.filter.quantityLessThan = false;
        break;
      case 'Sender':
        this.filter.senders = [this.uniqueName];
        this.filter.includeReceivers = false;
        this.filter.includeSenders = true;
        this.filter.receivers = [];
        break;
      case 'Receiver':
        this.filter.senders = [];
        this.filter.includeSenders = false;
        this.filter.includeReceivers = true;
        this.filter.receivers = [this.uniqueName];
        break;
    }
    this.checkFilters();
  }

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey && event.which === 73) { // Alt + i
      event.preventDefault();
      event.stopPropagation();
      this.toggleTransferAsidePane();
    }
  }

  // new transfer aside pane
  public toggleTransferAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public toggleBodyClass() {
    if (this.asideTransferPaneState === 'in') {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public applyFilters(page: number, applyFilter: boolean = true) {
    if (!this.uniqueName) {
      return;
    }
    this._store.dispatch(this.inventoryReportActions
      .genReport(this.uniqueName, this.startDate, this.endDate, page, 6, applyFilter ? this.filter : null));
  }

  // ******* Advance search modal *******//
  public resetFilter() {
    this.filter.senderName = null;
    this.filter.receiverName = null;
    this.showSenderSearch = false;
    this.showReceiverSearch = false;
    this.showProductSearch = false;
    this.senderName.nativeElement.value = null;
    this.receiverName.nativeElement.value = null;
    if (this.productName) {
      this.productName.nativeElement.value = null;
    }
    this.filter.sort = null;
    this.filter.sortBy = null;
    this.filter.quantityGreaterThan = false;
    this.filter.quantityEqualTo = false;
    this.filter.quantityLessThan = false;
    //Reset Date
    this.startDate = moment().add(-1, 'month').format(this._DDMMYYYY);
    this.endDate = moment().format(this._DDMMYYYY);
    this.datePickerOptions.startDate = moment().add(-1, 'month').toDate();
    this.datePickerOptions.endDate = moment().toDate();
    //Reset Date
    // initialization for voucher type array inially all selected
    this.initVoucherType();
    this.isFilterCorrect = false;
    this.applyFilters(1, true);
  }

  public onOpenAdvanceSearch() {
    this.advanceSearchModel.show();
  }

  public advanceSearchAction(type: string) {
    if (type === 'cancel') {
      this.comparisionFilter.clear();
      this.advanceSearchForm.controls['filterAmount'].setValue(null);
      this.advanceSearchModel.hide();
      if (this.filter.senderName || this.filter.receiverName || this.senderName.nativeElement.value || this.receiverName.nativeElement.value
        || this.filter.sortBy || this.filter.sort || this.filter.quantityGreaterThan || this.filter.quantityEqualTo || this.filter.quantityLessThan) {
        // do something...
      } else {
        this.isFilterCorrect = false;
      }
      return;
    }
    if (this.advanceSearchForm.controls['filterAmount'].value) {
      this.filter.quantity = this.advanceSearchForm.controls['filterAmount'].value;
    }
    this.advanceSearchModel.hide();
    this.applyFilters(1, true);
  }

  public checkFilters() {
    if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) {
      this.filter.quantity = this.advanceSearchForm.controls['filterAmount'].value;
    } else {
      this.filter.quantity = null;
    }
    if ((this.filter.quantityGreaterThan || this.filter.quantityEqualTo || this.filter.quantityLessThan) && this.filter.quantity) {
      this.isFilterCorrect = true;
    }
  }
  // ************************************//

  // Sort filter code here
  public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
    if (this.filter.sort !== type || this.filter.sortBy !== columnName) {
      this.filter.sort = type;
      this.filter.sortBy = columnName;
      this.isFilterCorrect = true;
      this.applyFilters(1, true);
    }
  }

  public clearShSelect(type: string) {
    this.filter.quantityGreaterThan = null;
    this.filter.quantityEqualTo = null;
    this.filter.quantityLessThan = null;
  }

  public filterByCheck(type: string, event: boolean) {
    let idx = this.filter.voucherType.indexOf('ALL');
    if (idx !== -1) { this.initVoucherType(); }
    if (event && type) {
      this.filter.voucherType.push(type);
    } else {
      let index = this.filter.voucherType.indexOf(type);
      if (index !== -1) { this.filter.voucherType.splice(index, 1); }
    }
    if (this.filter.voucherType.length > 0 && this.filter.voucherType.length < this.VOUCHER_TYPES.length) {
      idx = this.filter.voucherType.indexOf('ALL');
      if (idx !== -1) {
        this.filter.voucherType.splice(idx, 1);
      }
      idx = this.filter.voucherType.indexOf('NONE');
      if (idx !== -1) {
        this.filter.voucherType.splice(idx, 1);
      }
    }
    if (this.filter.voucherType.length === this.VOUCHER_TYPES.length) {
      this.filter.voucherType = ['ALL'];
    }
    if (this.filter.voucherType.length === 0) {
      this.filter.voucherType = ['NONE'];
    }
    this.isFilterCorrect = true;
    this.applyFilters(1, true);
  }

  // ************************************//

  public clickedOutside(event, el, fieldName: string) {
    if (fieldName === 'product') {
      if (this.productUniqueNameInput.value !== null && this.productUniqueNameInput.value !== '') {
        return;
      }
    }
    if (fieldName === 'sender') {
      if (this.senderUniqueNameInput.value !== null && this.senderUniqueNameInput.value !== '') {
        return;
      }
    }
    if (fieldName === 'receiver') {
      if (this.receiverUniqueNameInput.value !== null && this.receiverUniqueNameInput.value !== '') {
        return;
      }
    }
    if (this.childOf(event.target, el)) {
      return;
    } else {
      if (fieldName === 'sender') {
        this.showSenderSearch = false;
      } else if (fieldName === 'receiver') {
        this.showReceiverSearch = false;
      } else if (fieldName === 'product') {
        this.showProductSearch = false;
      }
    }
  }

  /* tslint:disable */
  public childOf(c, p) {
    while ((c = c.parentNode) && c !== p) {
    }
    return !!c;
  }

  public downloadReports(type: string) {
    this._toasty.infoToast('Upcoming feature');
    console.log('downloadReports called', type);
    // Service and param name should be change if need
    // this.inventoryService.DownloadStockReport(param1, param2)
    //   .subscribe(d => {
    //     if (d.status === 'success') {
    //       let blob = base64ToBlob(d.body, 'application/xls', 512);
    //       return saveAs(blob, `${this.stockUniqueName}.xlsx`);
    //     } else {
    //       this._toasty.errorToast(d.message);
    //     }
    //   });
  }

}
