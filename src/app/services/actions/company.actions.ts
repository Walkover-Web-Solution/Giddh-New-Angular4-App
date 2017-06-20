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
    .switchMap(action => this._companyService.CreateCompany(action.payload))
    .map(response => {
      console.log('Response ' + response);
      return this.CreateCompanyResponse(response);
    }).catch((error) => of(this.CatchErrors(error)));

  public errorEffect$: Observable<Action> = this.action$
    .map((x: Response) => x.json())
    .filter(payload => payload && payload.errorStatus !== 200)
    .switchMap(payload => {
      this._toasty.errorToast(payload, '');
      console.log('Toast');
      return Observable.empty();
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

  public CatchErrors(value: Response) {
   // this.store.dispatch({ type: 'API_ERROR', value });
  }
}
