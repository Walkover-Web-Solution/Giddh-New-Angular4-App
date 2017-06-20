import { CompanyServiceService } from './../companyService.service';
import { Effect, Actions } from '@ngrx/effects';
import { Company } from './../../models/api-models/Company';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable()

export class CompanyActions {
  public static CREATE_COMPANY = '[Company] Create';
  @Effect()
  public createCompany$: Observable<Action> = this.action$
    .ofType(CompanyActions.CREATE_COMPANY)
    // tslint:disable-next-line:quotemark
    .debug("Create Company Effect")
    .switchMap(action => this._companyService.CreateCompany(action.payload))
    .debug('HTTP CALL Succedded')
    .map(response => this.CreateCompanyResponse(response));
  constructor(private action$: Actions, private _companyService: CompanyServiceService) {

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
