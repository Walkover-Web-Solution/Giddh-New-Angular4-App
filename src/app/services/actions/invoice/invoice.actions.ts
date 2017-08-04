import { INVOICE } from './invoice.const';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()

export class InvoiceAction {

  public setTemplateId(id: string): Action {
    console.log('action method called')
    return {
      type: INVOICE.TEMPLATE.SELECT_TEMPLATE,
      payload: {id}
    };
  }

  public setHeading(data: string): Action {
    console.log('action method called')
    return {
      type: INVOICE.CONTENT.SET_HEADING,
      payload: {data}
    };
  }
}
