
import { Template } from '../models/api-models/invoice';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {INVOICE_API} from "./apiurls/invoice";
import {HttpWrapperService} from "./httpWrapper.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../store/roots";
import {map} from "rxjs/operator/map";
import {BaseResponse} from "../models/api-models/BaseResponse";
import {UserDetails} from "../models/api-models/loginModels";
import {HandleCatch} from "./catchManager/catchmanger";

@Injectable()
export class InvoiceService {
  private companyUniqueName: string;
  private user: UserDetails;
  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  public getTemplates(): Observable<Template> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    console.log('companyName', this.companyUniqueName);
    return this._http.get(INVOICE_API.GET_USER_TEMPLATES.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: Template = res.json();
      return data;
    }).catch((e) => HandleCatch<Template, string>(e));
  }
}
