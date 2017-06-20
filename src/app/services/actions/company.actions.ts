import { Observable } from 'rxjs/Observable';
import { CompanyService } from './../companyService.service';
import { Effect, Actions } from '@ngrx/effects';
import { Company } from './../../models/api-models/Company';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { ToasterService } from '../toaster.service';

@Injectable()

export class CompanyActions {
  public static CREATE_COMPANY = '[Company] Create';
  @Effect()
  public createCompany$: Observable<Action> = this.action$
    .ofType(CompanyActions.CREATE_COMPANY)
    .debug('')
    .switchMap(action => this._companyService.CreateCompany(action.payload))
    .map(response => {
      console.log('Response ' + response);
      return this.CreateCompanyResponse(response);
    });

  constructor(private action$: Actions, private _companyService: CompanyService, private _toasty: ToasterService) {

  }
  public CreateCompany(value: Company): Action {
    return {
      type: CompanyActions.CREATE_COMPANY,
      payload: value
    };
  }

  public CreateCompanyResponse(value: Response): Action {
    return {
      type: CompanyActions.CREATE_COMPANY,
      payload: value
    };
  }
}
