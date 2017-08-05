import { INVOICE } from './invoice.const';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()

export class InvoiceAction {

  public setTemplateId(id: string): Action {
    return {
      type: INVOICE.TEMPLATE.SELECT_TEMPLATE,
      payload: {id}
    };
  }

  public setHeading(data: string): Action {
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
