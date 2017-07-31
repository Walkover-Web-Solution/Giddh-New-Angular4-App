import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';
import { MANUFACTURING_API } from './apiurls/manufacturing.api';
import { IGetManufacturingItemDetailsObj, ICommonResponseOfManufactureItem } from '../models/interfaces/manufacturing.interface';

@Injectable()
export class CompanyService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
  }

  /**
   * get manufacturing item details
   * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
   */
  public GetManufacturingItemDetails(obj: IGetManufacturingItemDetailsObj): Observable<BaseResponse<ICommonResponseOfManufactureItem, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(MANUFACTURING_API.GET.replace(':companyUniqueName', this.companyUniqueName).replace(':stockUniqueName', obj.stockUniqueName).replace(':manufacturingUniqueName', obj.manufacturingUniqueName))
      .map((res) => {
        let data: BaseResponse<ICommonResponseOfManufactureItem, string> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<ICommonResponseOfManufactureItem, string>(e, ''));
  }

  /**
   * create manufacturing item
   * URL:: company/:companyUniqueName/stock/:stockUniqueName/manufacture
   */
}
