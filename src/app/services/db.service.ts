import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { GIDDH_DB } from '../models/db';
import { IUlist, ICompAidata, Igtbl } from '../models/interfaces/ulist.interface';

@Injectable()
export class DbService {
  constructor(
  ) {
    //
  }

  public extractDataForUI(data: Igtbl): IUlist[] {
    return [...data['menus'].slice(0, 3), ...data['groups'].slice(0, 3), ...data['accounts'].slice(0, 3)];
  }

  public getItemDetails(key: any): Observable<IUlist[]> {
    return from(GIDDH_DB.getItemByKey(key).catch(err => {
      GIDDH_DB.forceDeleteDB();
    }));
  }

  public getAllItems(key: string, entity: string): Observable<IUlist[]> {
    return from(GIDDH_DB.getAllItems(key, entity));
  }

  public insertFreshData(item: ICompAidata): Observable<number> {
    return from(GIDDH_DB.insertFreshData(item));
  }

  public addItem(key: string, entity: string, model: IUlist): Observable<number> {
    return from(GIDDH_DB.addItem(key, entity, model));
  }

  public deleteAllData(): void {
    GIDDH_DB.forceDeleteDB();
  }

}
