import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';
import { DaybookQueryRequest } from '../models/api-models/DaybookRequest';
import { CarriedOverSalesRequest, CarriedOverSalesResponse } from '../models/api-models/carried-over-sales';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { CarriedOverSalesActions } from '../actions/carried-over-sales.actions';
import { PaginationComponent } from 'ngx-bootstrap/pagination/pagination.component';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'carried-over-sales',
  templateUrl: './carried-over-sales.component.html',
  styles: []
})

export class CarriedOverSalesComponent implements OnInit, OnDestroy {
  public GetTypeOptions: IOption[] = [{label: 'Month', value: 'month'}, {label: 'Quater', value: 'quater'}];
  public selectedType: string;
  public monthOptions: IOption[] = [{label: 'January', value: '01'}, {label: 'February', value: '02'}, {label: 'March', value: '03'}, {label: 'April', value: '04'}, {label: 'May', value: '05'}, {label: 'June', value: '06'}, {label: 'July', value: '07'}, {label: 'August', value: '08'}, {label: 'September', value: '09'}, {label: 'October', value: '10'}, {label: 'November', value: '11'}, {label: 'December', value: '12'}];
  public selectedmonth: string;

  public quaterOptions: IOption[] = [{label: 'Q1', value: 'q1'}, {label: 'Q2', value: 'q2'}, {label: 'Q3', value: 'q3'}, {label: 'Q4', value: 'q4'}];
  public selectedQuater: string = '';

  public yearOptions: IOption[] = [{label: '2014', value: '2014'}, {label: '2015', value: '2015'}, {label: '2016', value: '2016'}, {label: '2017', value: '2017'}, {label: '2018', value: '2018'}, {label: '2019', value: '2019'}, {label: '2020', value: '2020'}];
  public selectedYear: string;
  public CarriedQueryRequest: CarriedOverSalesRequest;
  @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
  private searchFilterData: any = null;

  // public carriedData$: Observable<CarriedOverSalesResponse>;

  constructor(private store: Store<AppState>, private _CarriedOverSalesActions: CarriedOverSalesActions,
              private componentFactoryResolver: ComponentFactoryResolver, private _companyActions: CompanyActions,
              private _toasty: ToasterService) {
    this.CarriedQueryRequest = new CarriedOverSalesRequest();
  }

  public ngOnInit() {
    // let companyUniqueName = null;
    // this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    // let stateDetailsRequest = new StateDetailsRequest();
    // stateDetailsRequest.companyUniqueName = companyUniqueName;
    // stateDetailsRequest.lastState = 'carriedoversales/';
    // this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
  }

  // public selectedMonth(value: string) {
  //   this.carriedOverSalesRequests.type = this.selectedType;
  //   this.carriedOverSalesRequests.value = this.selectedmonth;
  //   this.go();
  // }

  public go() {

    if (!this.selectedYear) {
      this.showErrorToast('please select year');
      return;
    }

    if (!this.selectedType) {
      this.showErrorToast('please select type');
      return;
    }

    if (this.selectedType && this.selectedType === 'month' && !(this.selectedmonth)) {
      this.showErrorToast('please select month');
      return;
    }

    if (this.selectedType && this.selectedType === 'quater' && !(this.selectedQuater)) {
      this.showErrorToast('please select quater');
      return;
    }

    this.CarriedQueryRequest.type = this.selectedType;
    if (this.CarriedQueryRequest.type === 'month') {
      this.CarriedQueryRequest.value = this.selectedmonth + '-' + this.selectedYear;
    } else {
      this.CarriedQueryRequest.value = this.selectedQuater + '-' + this.selectedYear;
    }

    this.store.dispatch(this._CarriedOverSalesActions.GetCarriedOverSalesRequest(this.CarriedQueryRequest));
  }

  public pageChanged(event: any): void {
    //  this.CarriedQueryRequest.page = event.page;
    // this.go(this.searchFilterData);
  }

  public loadPaginationComponent(s) {
    let transactionData = null;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
    if (this.paginationChild && this.paginationChild.viewContainerRef) {
      let viewContainerRef = this.paginationChild.viewContainerRef;
      viewContainerRef.remove();

      let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
      viewContainerRef.insert(componentInstanceView.hostView);

      let componentInstance = componentInstanceView.instance as PaginationComponent;
      componentInstance.totalItems = s.count * s.totalPages;
      componentInstance.itemsPerPage = s.count;
      componentInstance.maxSize = 5;
      componentInstance.writeValue(s.page);
      componentInstance.boundaryLinks = true;
      componentInstance.pageChanged.subscribe(e => {
        this.pageChanged(e);
      });
    }
  }

  public showErrorToast(msg) {
    this._toasty.errorToast(msg);
  }

  public ngOnDestroy() {
    //
  }
}
