import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';
import { MANUFACTURING_API } from './apiurls/manufacturing.api';
import { IManufacturingUnqItemObj, ICommonResponseOfManufactureItem, IManufacturingItemRequest, IMfStockSearchRequest } from '../models/interfaces/manufacturing.interface';
import { StocksResponse } from '../models/api-models/Inventory';

@Injectable()
export class ManufacturingService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
  }

  /**
   * get manufacturing item details
   * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
   */
  public GetManufacturingItem(model: IManufacturingUnqItemObj): Observable<BaseResponse<ICommonResponseOfManufactureItem, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(MANUFACTURING_API.GET.replace(':companyUniqueName', this.companyUniqueName).replace(':stockUniqueName', model.stockUniqueName).replace(':manufacturingUniqueName', model.manufacturingUniqueName))
      .map((res) => {
        let data: BaseResponse<ICommonResponseOfManufactureItem, string> = res.json();
        data.queryString = model;
        return data;
      })
      .catch((e) => HandleCatch<ICommonResponseOfManufactureItem, string>(e, ''));
  }

  /**
   * create manufacturing item
   * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture
   * get resuest model and stock uniquename
   */
  public CreateManufacturingItem(model: IManufacturingItemRequest, stockUniqueName: string): Observable<BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest>> {
    this.store.take(1).subscribe(s => {
        if (s.session.user) {
            this.user = s.session.user.user;
        }
        this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(MANUFACTURING_API.CREATE.replace(':companyUniqueName', this.companyUniqueName).replace(':stockUniqueName', stockUniqueName), model).map((res) => {
        let data: BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest> = res.json();
        data.request = model;
        data.queryString = {stockUniqueName};
        return data;
    }).catch((e) => HandleCatch<ICommonResponseOfManufactureItem, IManufacturingItemRequest>(e, model));
  }

  /**
  * Update manufacturing item
  * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
  */
  public UpdateManufacturingItem(model: IManufacturingItemRequest, reqModal: IManufacturingUnqItemObj): Observable<BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest>> {
    this.store.take(1).subscribe(s => {
        if (s.session.user) {
            this.user = s.session.user.user;
        }
        this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(MANUFACTURING_API.UPDATE.replace(':companyUniqueName', this.companyUniqueName).replace(':stockUniqueName', reqModal.stockUniqueName).replace(':manufacturingUniqueName', reqModal.manufacturingUniqueName), model).map((res) => {
        let data: BaseResponse<ICommonResponseOfManufactureItem, IManufacturingItemRequest> = res.json();
        data.request = model;
        data.queryString = reqModal;
        return data;
    }).catch((e) => HandleCatch<ICommonResponseOfManufactureItem, IManufacturingItemRequest>(e, model));
  }

  /**
  * Delete manufacturing item
  * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
  */
  public DeleteManufacturingItem(model: IManufacturingUnqItemObj): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
          this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.delete(MANUFACTURING_API.DELETE.replace(':companyUniqueName', this.companyUniqueName).replace(':stockUniqueName', model.stockUniqueName).replace(':manufacturingUniqueName', model.manufacturingUniqueName)).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = '';
      data.queryString = { model };
      return data;
    }).catch((e) => HandleCatch<string, string>(e, '', { model }));
  }

  /**
   * get manufacturing report details
   * URL:: company/:companyUniqueName/stock/manufacture-report
   */
  public GetMfReport(model: IMfStockSearchRequest): Observable<BaseResponse<StocksResponse, IMfStockSearchRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(MANUFACTURING_API.MF_REPORT
      .replace(':companyUniqueName', this.companyUniqueName)
      .replace(':product', (model.product) ? model.product : '')
      .replace(':searchBy', (model.searchBy) ? model.searchBy : '')
      .replace(':searchOperation', (model.searchOperation) ? model.searchOperation : '')
      .replace(':searchValue', (model.searchValue) ? model.searchValue : '')
      .replace(':from', (model.from) ? model.from : '' )
      .replace(':to', (model.to) ? model.to : '')
      .replace(':page', (model.page) ? model.page.toString() : '1')
      .replace(':count', (model.count) ? model.count.toString() : '10')
      )
      .map((res) => {
        let data: BaseResponse<StocksResponse, IMfStockSearchRequest> = res.json();
        data.request = '';
        data.queryString = model;
        return data;
      })
      .catch((e) => HandleCatch<StocksResponse, IMfStockSearchRequest>(e, ''));
  }
}
