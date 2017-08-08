
import { Template } from '../models/api-models/invoice';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {INVOICE_API} from "./apiurls/invoice";
import {HttpWrapperService} from "./httpWrapper.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../store/roots";

@Injectable()
export class InvoiceService {
  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  public getTemplates(): Observable<Template> {
    return this._http.post(INVOICE_API.GET_USER_TEMPLATES.replace(':companyUniqueName', 'walkovindore145024788769408y58o'),{
      headers: new Headers({
        'Auth-key': ' DBgfI349Wrgpjr_FG-TZiZuresSo8SqmknyBiyecZyAdqDkaY-63o9njChsN7qdxbdoCS8XuyGD1vJSSXCCXxw=='
      })
      }).map((response) => {
        return response.json() as Template;
    });
  }
