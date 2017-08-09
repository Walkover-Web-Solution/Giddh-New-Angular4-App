import { INVOICE } from './invoice.const';
import {Action, Store} from '@ngrx/store';
import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {InvoiceService} from "../../invoice.services";
import {AppState} from "../../../store/roots";
import {Router} from "@angular/router";
import {ToasterService} from "../../toaster.service";
import {Template} from "../../../models/api-models/invoice";
import {map} from "rxjs/operator/map";

@Injectable()
export class InvoiceAction {
  @Effect()
  public GetUserTemplates$ = this.action$
    .ofType(INVOICE.TEMPLATE.GET_USER_TEMPLATES)
    .switchMap(action =>  this._invoiceService.getTemplates())
    .map((res) => {
    console.log(res);
    this.store.dispatch(this.setTemplateState(res));
    });
  constructor(private store: Store<AppState>, private _invoiceService: InvoiceService, private action$: Actions,
              private _toasty: ToasterService, private router: Router) {
  }
  public getTemplateState(): Action {
    return {
      type: INVOICE.TEMPLATE.GET_USER_TEMPLATES
    };
  }
  public getCurrentTemplateSate(uniqueName: string): Action{
    return{
      payload: uniqueName,
      type: INVOICE.TEMPLATE.GET_CURRENT_TEMPLATE
    };
  }

  public setTemplateState(temp: Template): Action {
    return {
      type: INVOICE.TEMPLATE.SELECT_TEMPLATE_STATE,
      payload: {temp}
    };
  }
  public setTemplateId(id: string): Action {
    return {
      type: INVOICE.TEMPLATE.SELECT_TEMPLATE,
      payload: {id}
    };
  }

  public setGSTIN(data: string): Action {
    return {
      type: INVOICE.CONTENT.SET_HEADING,
      payload: {data}
    };
  }
  public setColumnWidth(width: number, colName: string): Action {
    return {
      type: INVOICE.CONTENT.SET_COLUMN_WIDTH,
      payload: {width, colName}
    };

  }
}
