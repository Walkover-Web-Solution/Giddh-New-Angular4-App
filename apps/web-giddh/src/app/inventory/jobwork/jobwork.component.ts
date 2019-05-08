import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  public senderUniqueNameInput: FormControl = new FormControl();
  public receiverUniqueNameInput: FormControl = new FormControl();
  public showWelcomePage: boolean = true;
  public showSenderSearch: boolean = false;
  public showReceiverSearch: boolean = false;
  public updateDescriptionIdx: number = null;
  // modal advance search
  public isFilterCorrect: boolean = false;
  public advanceSearchForm: FormGroup;

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
  public startDate: string = moment().subtract(30, 'days').format('DD-MM-YYYY');
  public endDate: string = moment().format('DD-MM-YYYY');
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
      this.showWelcomePage = true;
      this.applyFilters(1, true);
    } else {
      this.showWelcomePage = true;
    }
    // get view from sidebar while clicking on person/stock
    this.invViewService.getJobworkActiveView().subscribe(v => {
      this.showWelcomePage = false;
      this.type = v.view;
      if (!v.uniqueName) {
        let len = document.location.pathname.split('/').length;
        this.uniqueName = document.location.pathname.split('/')[len - 1];
      }
      this.uniqueName = v.uniqueName;
      this.nameStockOrPerson = v.name;
      if (this.uniqueName) {
        this.filter = {};
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
    // Advance search modal
    this.advanceSearchForm = this.fb.group({
      filterAmount: ['', [Validators.pattern('[0-9]+([,.][0-9]+)?$')]],
      filterCategory: [''],
    });
    this.filter.advanceFilterOptions = new AdvanceFilterOptions();
    this.filter.advanceFilterOptions.filterValueCondition = null;
    this.filter.voucherType = [];

    this.senderUniqueNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      this.filter.senders = s;
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
      this.filter.receivers = s;
      this.applyFilters(1, true);
      if (s === '') {
        this.showReceiverSearch = false;
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public dateSelected(val) {
    const { startDate, endDate } = val.picker;
    this.startDate = startDate.format('DD-MM-YYYY');
    this.endDate = endDate.format('DD-MM-YYYY');
  }

  /**
   * updateDescription
   */
  public updateDescription(txn) {
    console.log('txn', txn);
    this.updateDescriptionIdx = null;
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

  public searchChanged(val: IOption) {
    this.filter.senders =
      this.filter.receivers = [];
    this.uniqueName = val.value;
    this.type = val.additional;
  }

  // focus on click search box
  public showSearchBox(type: string) {
    if (type === 'sender') {
      this.showSenderSearch = !this.showSenderSearch;
      setTimeout(() => {
        this.senderName.nativeElement.focus();
      }, 200);
    } else if (type === 'receiver') {
      this.showReceiverSearch = !this.showReceiverSearch;
      setTimeout(() => {
        this.receiverName.nativeElement.focus();
      }, 200);
    }
  }


  public compareChanged(option: IOption) {
    this.filter = {};
    switch (option.value) {
      case '>':
        this.filter.quantityGreaterThan = true;
        this.filter.quantityEqualTo = false;
        this.filter.quantityLessThan = false;
        break;
      case '<':
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = false;
        this.filter.quantityLessThan = true;
        break;
      case '<=':
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = true;
        this.filter.quantityLessThan = true;
        break;
      case '>=':
        this.filter.quantityGreaterThan = true;
        this.filter.quantityEqualTo = true;
        this.filter.quantityLessThan = false;
        break;
      case '=':
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = true;
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
    this.filter.advanceFilterOptions = new AdvanceFilterOptions();
    this.isFilterCorrect = false;
  }

  public onOpenAdvanceSearch() {
    this.advanceSearchModel.show();
    this.filter.advanceFilterOptions = new AdvanceFilterOptions();
  }

  public advanceSearchAction(type: string) {
    if (type === 'cancel') {
      this.advanceSearchModel.hide();
      return;
    }
    debugger;
    if (this.advanceSearchForm.controls['filterAmount'].value) {
      this.filter.filterAmount = this.advanceSearchForm.controls['filterAmount'].value;
    }
    this.advanceSearchModel.hide();
    this.applyFilters(1, true);
  }

  /**
   * onDDElementSelect
   */
  public onDDElementSelect(type: string, data: IOption) {
    switch (type) {
      case 'filterValueCondition':        
        this.compareChanged(data);
        break;
    }
  }

  // ************************************//

  // Sort filter code here
  public sortButtonClicked(type: 'asc' | 'desc', columnName: string, parentColumn: string) {
    if (this.filter.sort !== type || this.filter.sortBy !== columnName) {
      this.filter.sort = type;
      this.filter.sortBy = columnName;
      this.applyFilters(1, true);
    }
  }

  public filterByCheck(type: string, event: boolean) {
    if (event && type) {
      this.filter.voucherType.push(type);
    } else {
      let index = this.filter.voucherType.indexOf(type);
      if (index !== -1) {
        this.filter.voucherType.splice(index, 1);
      }
    }
    this.applyFilters(1, true);
  }

  // ************************************//

  public clickedOutside(event, el, fieldName: string) {
    if (fieldName === 'sender') {
      if (this.senderUniqueNameInput.value !== null && this.senderUniqueNameInput.value !== '' && !this.showSenderSearch) {
        return;
      }
    }
    if (fieldName === 'receiver') {
      if (this.receiverUniqueNameInput.value !== null && this.receiverUniqueNameInput.value !== '' && !this.showReceiverSearch) {
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
