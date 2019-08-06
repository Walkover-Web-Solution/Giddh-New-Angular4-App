import {ToasterService} from '../../../services/toaster.service';
import {base64ToBlob} from './../../../shared/helpers/helperFunctions';
import {InventoryService} from '../../../services/inventory.service';
import {Observable, of as observableOf, ReplaySubject, Subscription} from 'rxjs';

import {take, takeUntil, debounceTime, distinctUntilChanged, publishReplay, refCount} from 'rxjs/operators';
import {
  GroupStockReportRequest,
  GroupStockReportResponse,
  StockGroupResponse,
  AdvanceFilterOptions, InventoryDownloadRequest
} from '../../../models/api-models/Inventory';
import {StockReportActions} from '../../../actions/inventory/stocks-report.actions';
import {AppState} from '../../../store';
import {saveAs} from 'file-saver';

import {Store} from '@ngrx/store';

import {
  AfterViewInit,
  HostListener,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Pipe,
  ViewChildren,
  QueryList, ChangeDetectorRef
} from '@angular/core';
import {SidebarAction} from '../../../actions/inventory/sidebar.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import {InventoryAction} from '../../../actions/inventory/inventory.actions';
import {IOption} from '../../../theme/ng-virtual-select/sh-options.interface';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {createSelector} from 'reselect';
import {ModalDirective, PaginationComponent} from 'ngx-bootstrap';
import {SettingsBranchActions} from '../../../actions/settings/branch/settings.branch.action';
import {CompanyResponse} from '../../../models/api-models/Company';
import {InvViewService} from '../../inv.view.service';
import {ShSelectComponent} from '../../../theme/ng-virtual-select/sh-select.component';
import {isInteger} from '@ng-bootstrap/ng-bootstrap/util/util';


@Component({
  selector: 'invetory-group-stock-report',  // <home></home>
  templateUrl: './group.stockreport.component.html',
  styleUrls: ['./group.stockreport.component.scss'],
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

export class InventoryGroupStockReportComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dateRangePickerCmp') public dateRangePickerCmp: ElementRef;
  @ViewChild('advanceSearchModel') public advanceSearchModel: ModalDirective;
  @ViewChild("productName") productName: ElementRef;
  @ViewChild("sourceName") sourceName: ElementRef;
  @ViewChild('advanceSearchForm') formValues;
  @ViewChild('shCategory') public shCategory: ShSelectComponent;
  @ViewChild('shCategoryType') public shCategoryType: ShSelectComponent;
  @ViewChild('shValueCondition') public shValueCondition: ShSelectComponent;

  public today: Date = new Date();
  public activeGroup$: Observable<StockGroupResponse>;
  public groupStockReport$: Observable<GroupStockReportResponse>;
  public sub: Subscription;
  public groupUniqueName: string;
  public stockUniqueName: string;
  public GroupStockReportRequest: GroupStockReportRequest;
  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: string;
  public fromDate: string;
  public moment = moment;
  public activeGroupName: string;
  public stockList$: Observable<IOption[]>;
  public comparisonFilterDropDown$: Observable<IOption[]>;
  public entityFilterDropDown$: Observable<IOption[]>;
  public valueFilterDropDown$: Observable<IOption[]>;
  public asidePaneState: string = 'out';
  public asideTransferPaneState: string = 'out';
  public selectedCompany$: Observable<any>;
  public selectedCmp: CompanyResponse;
  public isWarehouse: boolean = false;
  public showAdvanceSearchIcon: boolean = false;
  public showProductSearch: boolean = false;
  public showSourceSearch: boolean = false;
  public productUniqueNameInput: FormControl = new FormControl();
  public sourceUniqueNameInput: FormControl = new FormControl();
  public entities$: Observable<CompanyResponse[]>;
  public selectedEntity: string = null;
  // modal advance search
  public advanceSearchForm: FormGroup;
  public filterCategory: string = null;
  public filterCategoryType: string = null;
  public filterValueCondition: string = null;
  public isFilterCorrect: boolean = false;
  public groupUniqueNameFromURL: string = null;
  public _DDMMYYYY: string = 'DD-MM-YYYY';
  public pickerSelectedFromDate: string;
  public pickerSelectedToDate: string;
  public transactionTypes: any[] = [
    {id: 1, uniqueName: 'purchase_sale', name: 'Purchase & Sales'},
    {id: 2, uniqueName: 'transfer', name: 'Transfer'},
    {id: 3, uniqueName: 'all', name: 'All Transactions'},
  ];
  public CategoryOptions: any[] = [
    {
      value: "inwards",
      label: "Inwards",
      disabled: false
    },
    {
      value: "outwards",
      label: "Outwards",
      disabled: false
    },
    {
      value: "Opening Stock",
      label: "Opening Stock",
      disabled: false
    },
    {
      value: "Closing Stock",
      label: "Closing Stock",
      disabled: false
    }
  ];

  public CategoryTypeOptions: any[] = [
    {
      value: "quantity",
      label: "Quantity",
      disabled: false
    },
    {
      value: "value",
      label: "Value",
      disabled: false
    }
  ];

  public FilterValueCondition: any[] = [
    {
      value: "EQUALS",
      label: "Equals",
      disabled: false
    },
    {
      value: "GREATER_THAN",
      label: "Greater than",
      disabled: false
    },
    {
      value: "LESS_THAN",
      label: "Less than",
      disabled: false
    },
    {
      value: "NOT_EQUALS",
      label: "Excluded",
      disabled: false
    }
  ];

  public datePickerOptions: any = {
    hideOnEsc: true,
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
    startDate: moment().subtract(1, 'month'),
    endDate: moment()
  };
  public groupStockReport: GroupStockReportResponse;
  public universalDate$: Observable<any>;
  public showAdvanceSearchModal: boolean = false;

  public branchAvailable: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private sideBarAction: SidebarAction,
    private stockReportActions: StockReportActions,
    private router: Router,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private _toasty: ToasterService,
    private inventoryAction: InventoryAction,
    private settingsBranchActions: SettingsBranchActions,
    private invViewService: InvViewService,
    private cdr: ChangeDetectorRef
  ) {

    this.groupStockReport$ = this.store.select(p => p.inventory.groupStockReport).pipe(takeUntil(this.destroyed$), publishReplay(1), refCount());

    this.GroupStockReportRequest = new GroupStockReportRequest();
    this.activeGroup$ = this.store.select(state => state.inventory.activeGroup).pipe(takeUntil(this.destroyed$));
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
      if (a) {
        const stockGroup = _.cloneDeep(a);
        const stockList = [];
        this.activeGroupName = stockGroup.name;
        stockGroup.stocks.forEach((stock) => {
          stockList.push({label: `${stock.name} (${stock.uniqueName})`, value: stock.uniqueName});
        });
        this.stockList$ = observableOf(stockList);
        if (this.GroupStockReportRequest && !this.GroupStockReportRequest.stockGroupUniqueName) {
          this.GroupStockReportRequest.stockGroupUniqueName = stockGroup.uniqueName;
        }
      }
    });


    // tslint:disable-next-line:no-shadowed-variable
    this.store.select(createSelector([(state: AppState) => state.settings.branches], (branches) => {
      if (branches && branches.results.length > 0) {
        this.branchAvailable = true;
      } else {
        this.branchAvailable = false;
      }
    })).pipe(takeUntil(this.destroyed$)).subscribe();

  }

  public ngOnInit() {
    // get view from sidebar while clicking on group/stock
    let len = document.location.pathname.split('/').length;
    this.groupUniqueNameFromURL = document.location.pathname.split('/')[len - 2]
    if (this.groupUniqueNameFromURL && len === 6) {
      this.groupUniqueName = this.groupUniqueNameFromURL;
      this.initReport();
    }

    this.invViewService.getActiveView().pipe(takeUntil(this.destroyed$)).subscribe(v => {
      if (!v.isOpen) {
        this.activeGroupName = v.name;
        this.groupUniqueName = v.groupUniqueName;
        if (this.groupUniqueName) {
          if (this.groupUniqueName) {
            this.initReport();
          }
          if (this.dateRangePickerCmp) {
            //this.dateRangePickerCmp.nativeElement.value = `${this.GroupStockReportRequest.from} - ${this.GroupStockReportRequest.to}`;
          }
        }
      }
    });


    this.groupStockReport$.subscribe(res => {
      this.groupStockReport = res;
      this.cdr.detectChanges();
    });
    this.universalDate$.subscribe(a => {
      if (a) {
        this.datePickerOptions = {...this.datePickerOptions, startDate: a[0], endDate: a[1]};
        this.fromDate = moment(a[0]).format(this._DDMMYYYY);
        this.toDate = moment(a[1]).format(this._DDMMYYYY);
        this.getGroupReport(true);
      }
    });
    this.selectedCompany$ = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
      if (!companies) {
        return;
      }
      let selectedCmp = companies.find(cmp => {
        if (cmp && cmp.uniqueName) {
          return cmp.uniqueName === uniqueName;
        } else {
          return false;
        }
      });
      if (!selectedCmp) {
        return;
      }
      if (selectedCmp) {
        //console.log(selectedCmp);
      }
      this.selectedCmp = selectedCmp;

      this.getAllBranch();

      return selectedCmp;
    })).pipe(takeUntil(this.destroyed$));
    this.selectedCompany$.subscribe();

    this.productUniqueNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      if (s) {
        this.isFilterCorrect = true;
        this.GroupStockReportRequest.stockName = s;
        this.getGroupReport(true);
        if (s === '') {
          this.showProductSearch = false;
        }
      }
    });
    this.sourceUniqueNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      if (s) {
        this.isFilterCorrect = true;
        this.GroupStockReportRequest.source = s;
        this.getGroupReport(true);
        if (s === '') {
          this.showProductSearch = false;
        }
      }
    });
    // Advance search modal
    this.advanceSearchForm = this.fb.group({
      filterAmount: ['', [Validators.pattern('[-0-9]+([,.][0-9]+)?$')]],
      filterCategory: [''],
      filterCategoryType: [''],
      filterValueCondition: ['']
    });
  }

  @HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey && event.which === 73) { // Alt + i
      event.preventDefault();
      event.stopPropagation();
      this.toggleAsidePane();
    }
    if (event.altKey && event.which === 80 && this.branchAvailable) { // Alt + P
      event.preventDefault();
      event.stopPropagation();
      this.toggleTransferAsidePane();
    }
  }

  public initReport() {
    // this.fromDate = moment().subtract(1, 'month').format(this._DDMMYYYY);
    // this.toDate = moment().format(this._DDMMYYYY);
    // this.GroupStockReportRequest.from = moment().add(-1, 'month').format(this._DDMMYYYY);
    // this.GroupStockReportRequest.to = moment().format(this._DDMMYYYY);
    // this.datePickerOptions.startDate = moment().add(-1, 'month').toDate();
    // this.datePickerOptions.endDate = moment().toDate();
    this.GroupStockReportRequest.page = 1;
    this.GroupStockReportRequest.stockGroupUniqueName = this.groupUniqueName || '';
    this.GroupStockReportRequest.stockUniqueName = '';
    this.groupUniqueNameFromURL = null;
    this.store.dispatch(this.stockReportActions.GetGroupStocksReport(_.cloneDeep(this.GroupStockReportRequest)));
  }

  public getGroupReport(resetPage: boolean) {
    this.GroupStockReportRequest.from = this.fromDate || null;
    this.GroupStockReportRequest.to = this.toDate || null;
    if (resetPage) {
      this.GroupStockReportRequest.page = 1;
    }
    if (!this.GroupStockReportRequest.stockGroupUniqueName) {
      return;
    }
    this.store.dispatch(this.stockReportActions.GetGroupStocksReport(_.cloneDeep(this.GroupStockReportRequest)));
  }

  /**
   * getAllBranch
   */
  public getAllBranch() {
    //this.store.dispatch(this.settingsBranchActions.GetALLBranches());
    this.store.select(createSelector([(state: AppState) => state.settings.branches], (entities) => {
      if (entities) {
        if (entities.results.length) {
          if (this.selectedCmp && entities.results.findIndex(p => p.uniqueName === this.selectedCmp.uniqueName) === -1) {
            this.selectedCmp['label'] = this.selectedCmp.name;
            entities.results.push(this.selectedCmp);
          }
          entities.results.forEach(element => {
            element['label'] = element.name;
          });
          this.entities$ = observableOf(_.orderBy(entities.results, 'name'));
        } else if (entities.results.length === 0) {
          this.entities$ = observableOf(null);
        }
      }
    })).pipe(takeUntil(this.destroyed$)).subscribe();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngAfterViewInit() {
    this.store.select(p => p.inventory.activeGroup).pipe(take(1)).subscribe((a) => {
      if (!a) {
        // this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
      }
    });
  }

  public goToManageGroup() {
    if (this.groupUniqueName) {
      this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
      this.setInventoryAsideState(true, true, true);
      // this.router.navigate(['/pages', 'inventory', 'add-group', this.groupUniqueName]);
    }
  }

  public nextPage() {
    this.GroupStockReportRequest.page++;
    this.getGroupReport(false);
  }

  public prevPage() {
    this.GroupStockReportRequest.page--;
    this.getGroupReport(false);
  }

  public closeFromDate(e: any) {
    if (this.showFromDatePicker) {
      this.showFromDatePicker = false;
    }
  }

  public closeToDate(e: any) {
    if (this.showToDatePicker) {
      this.showToDatePicker = false;
    }
  }

  public selectedDate(value: any, from?: string) { //from like advance search
    this.fromDate = moment(value.picker.startDate).format(this._DDMMYYYY);
    this.toDate = moment(value.picker.endDate).format(this._DDMMYYYY);
    this.pickerSelectedFromDate = value.picker.startDate;
    this.pickerSelectedToDate = value.picker.endDate;
    if (!from) {
      this.isFilterCorrect = true;
      this.getGroupReport(true);
    }
  }

  public filterFormData() {
    this.getGroupReport(true);
  }

  /**
   * setInventoryAsideState
   */
  public setInventoryAsideState(isOpen, isGroup, isUpdate) {
    this.store.dispatch(this.inventoryAction.ManageInventoryAside({isOpen, isGroup, isUpdate}));
  }

  public pageChanged(event: any): void {
    this.GroupStockReportRequest.page = event.page;
    this.getGroupReport(false);
  }

  public DownloadGroupReports(type: string) {
    this.GroupStockReportRequest.reportDownloadType = type;
    this._toasty.infoToast('Upcoming feature');
    // this.inventoryService.DownloadGroupReport(this.GroupStockReportRequest, this.groupUniqueName).subscribe(d => {
    //   if (d.status === 'success') {
    //     if (type === 'xls') {
    //       let blob = base64ToBlob(d.body, 'application/xls', 512);
    //       return saveAs(blob, `${this.groupUniqueName}.xlsx`);
    //     } else {
    //       let blob = base64ToBlob(d.body, 'application/csv', 512);
    //       return saveAs(blob, `${this.groupUniqueName}.csv`);
    //     }
    //   } else {
    //     this._toasty.errorToast(d.message);
    //   }
    // });
  }

  // region asidemenu toggle
  public toggleBodyClass() {
    if (this.asidePaneState === 'in' || this.asideTransferPaneState === 'in') {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public toggleAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.asidePaneState = this.asidePaneState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  // new transfer aside pane
  public toggleTransferAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  // From Entity Dropdown
  public selectEntity(option: IOption) {
    this._toasty.infoToast('Upcoming feature');
    this.GroupStockReportRequest.branchDetails = option.label;
    // if (option.value === 'warehouse') { // enable after new api for this 'inventoryEntity' key
    //   this.isWarehouse = true;
    // } else {
    //   this.isWarehouse = false;
    // }
    // this.getGroupReport(true);
  }

  // From inventory type Dropdown
  public selectTransactionType(inventoryType) {
    this.GroupStockReportRequest.transactionType = inventoryType;
    this.getGroupReport(true);
  }

  public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
    if (this.GroupStockReportRequest.sort !== type || this.GroupStockReportRequest.sortBy !== columnName) {
      this.GroupStockReportRequest.sort = type;
      this.GroupStockReportRequest.sortBy = columnName;
    }
    this.isFilterCorrect = true;
    this.getGroupReport(true);
  }

  public clickedOutside(event, el, fieldName: string) {
    if (fieldName === 'product') {
      if (this.productUniqueNameInput.value !== null && this.productUniqueNameInput.value !== '') {
        return;
      }
    }
    if (fieldName === 'source') {
      if (this.sourceUniqueNameInput.value !== null && this.sourceUniqueNameInput.value !== '') {
        return;
      }
    }
    if (this.childOf(event.target, el)) {
      return;
    } else {
      if (fieldName === 'product') {
        this.showProductSearch = false;
      } else if (fieldName === 'source') {
        this.showSourceSearch = false;
      }
    }
  }

  /* tslint:disable */
  public childOf(c, p) {
    while ((c = c.parentNode) && c !== p) {
    }
    return !!c;
  }

  // focus on click search box
  public showProductSearchBox() {
    this.showProductSearch = !this.showProductSearch;
    setTimeout(() => {
      this.productName.nativeElement.focus();
      this.productName.nativeElement.value = null;
    }, 200);
  }

  public showSourceSearchBox() {
    this.showSourceSearch = !this.showSourceSearch;
    setTimeout(() => {
      this.sourceName.nativeElement.focus();
      this.sourceName.nativeElement.value = null;
    }, 200);
  }

  //******* Advance search modal *******//
  public resetFilter() {
    this.isFilterCorrect = false;
    this.GroupStockReportRequest.sort = 'asc';
    this.GroupStockReportRequest.sortBy = null;
    this.GroupStockReportRequest.entity = null;
    this.GroupStockReportRequest.value = null;
    this.GroupStockReportRequest.condition = null;
    this.GroupStockReportRequest.number = null;
    this.showSourceSearch = false;
    this.showProductSearch = false;
    this.GroupStockReportRequest.stockName = null;
    this.GroupStockReportRequest.source = null;
    this.productName.nativeElement.value = null;
    if (this.sourceName) {
      this.sourceName.nativeElement.value = null;
    }
    this.advanceSearchForm.controls['filterAmount'].setValue(null);
    //Reset Date with universal date
    this.universalDate$.subscribe(a => {
      if (a) {
        this.datePickerOptions = {...this.datePickerOptions, startDate: a[0], endDate: a[1]};
        this.fromDate = moment(a[0]).format(this._DDMMYYYY);
        this.toDate = moment(a[1]).format(this._DDMMYYYY);
      }
    });
    //Reset Date

    this.getGroupReport(true);
  }

  public onOpenAdvanceSearch() {
    this.showAdvanceSearchModal = true;
    this.advanceSearchModel.show();
  }

  public advanceSearchAction(type?: string) {
    if (type === 'cancel') {
      this.showAdvanceSearchModal = false;
      this.clearModal();
      this.advanceSearchModel.hide(); // change request : to only reset fields
      return;
    } else if (type === 'clear') {
      this.clearModal();
      return;
    }

    if (this.isFilterCorrect) {
      this.datePickerOptions = {
        ...this.datePickerOptions,
        startDate: moment(this.pickerSelectedFromDate).toDate(),
        endDate: moment(this.pickerSelectedToDate).toDate()
      };
      this.showAdvanceSearchModal = false;
      this.advanceSearchModel.hide(); // change request : to only reset fields
      this.getGroupReport(true);
    }

  }

  public  clearModal(){
    if(this.GroupStockReportRequest.number || this.GroupStockReportRequest.condition || this.GroupStockReportRequest.value || this.GroupStockReportRequest.entity){
      this.shCategory.clear();
      this.shCategoryType.clear();
      this.shValueCondition.clear();
      this.advanceSearchForm.controls['filterAmount'].setValue(null);

      this.GroupStockReportRequest.number = null;
      this.getGroupReport(true);
    }
    if (this.GroupStockReportRequest.sortBy || this.GroupStockReportRequest.stockName || this.GroupStockReportRequest.source || this.productName.nativeElement.value) {
      // do something...
    } else {
      this.isFilterCorrect = false;
    }
  }

  /**
   * onDDElementSelect
   */
  public clearShSelect(type: string) {
    switch (type) {
      case 'filterCategory':  // Opening Stock, inwards, outwards, Closing Stock
        this.filterCategory = null;
        this.GroupStockReportRequest.entity = null;
        break;
      case 'filterCategoryType': // quantity/value
        this.filterCategoryType = null;
        this.GroupStockReportRequest.value = null;
        break;
      case 'filterValueCondition': // GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
        this.filterValueCondition = null;
        this.GroupStockReportRequest.condition = null;
        break;
    }
    this.mapAdvFilters();
  }

  public onDDElementSelect(event: IOption, type?: string) {
    switch (type) {
      case 'filterCategory':  // Opening Stock, inwards, outwards, Closing Stock
        this.filterCategory = event.value;
        break;
      case 'filterCategoryType': // quantity/value
        this.filterCategoryType = event.value;
        break;
      case 'filterValueCondition': // GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
        this.filterValueCondition = event.value;
        break;
    }
    this.mapAdvFilters();
  }

  public downloadAllInventoryReports(reportType:string, reportFormat:string) {
    console.log('Called : download',reportType, 'format',reportFormat);
    let obj= new InventoryDownloadRequest();
    if(this.groupUniqueName){
      obj.stockGroupUniqueName=this.groupUniqueName;
    }
    if(this.stockUniqueName){
      obj.stockUniqueName=this.stockUniqueName;
    }
    obj.format=reportFormat;
    obj.reportType=reportType;
    this.inventoryService.downloadAllInventoryReports(obj)
      .subscribe(res => {
        if (res.status === 'success') {
          this._toasty.infoToast(res.body);
        } else {
          this._toasty.errorToast(res.message);
        }
      });
  }

  public mapAdvFilters() {
    if (this.filterCategory) { // entity = Opening Stock, inwards, outwards, Closing Stock 
      this.GroupStockReportRequest.entity = this.filterCategory;
    }
    if (this.filterCategoryType) { // value = quantity/value 
      this.GroupStockReportRequest.value = this.filterCategoryType;
    }
    if (this.filterValueCondition) { // condition = GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS 
      this.GroupStockReportRequest.condition = this.filterValueCondition;
    }
    if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) { // number=1 {any number given by user}
      this.GroupStockReportRequest.number = parseFloat(this.advanceSearchForm.controls['filterAmount'].value);
    } else {
      this.GroupStockReportRequest.number = null;
    }
    if (this.GroupStockReportRequest.source || this.GroupStockReportRequest.sortBy || this.productName.nativeElement.value || this.GroupStockReportRequest.entity || this.GroupStockReportRequest.condition || this.GroupStockReportRequest.value || this.GroupStockReportRequest.number) {
      this.isFilterCorrect = true;
    } else {
      this.isFilterCorrect = false;
    }
  }

  //************************************//

}
