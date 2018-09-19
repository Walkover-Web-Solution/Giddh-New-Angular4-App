import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { GIDDH_DB } from '../models/db';
import { IUlist } from '../models/interfaces/ulist.interface';

@Injectable()
export class DbService {
  constructor(
  ) {
    //
  }

  public getItemDetails(entity: string, key: any): Observable<IUlist[]> {
    return from(GIDDH_DB.getItemById(entity, key));
  }

  public getAllItems(entity: string): Observable<IUlist[]> {
    return from(GIDDH_DB.getAllItems(entity));
  }

  public addItem(entity: string, model: IUlist): Observable<number> {
    return from(GIDDH_DB.addItem(entity, model));
  }

  public removeItem(entity: string, id: number): Observable<number> {
    return from(GIDDH_DB.removeItemById(entity, id));
  }

  /* public orderByIndex(entity: string, index: string): Observable<number> {
    return from(GIDDH_DB.orderByIndex(entity, index));
  } */
}
