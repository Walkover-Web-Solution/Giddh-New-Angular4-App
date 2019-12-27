import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { GIDDH_DB } from '../models/db';
import { ICompAidata, Igtbl, IUlist } from '../models/interfaces/ulist.interface';

@Injectable()
export class DbService {
    constructor() {
        //
    }

    public extractDataForUI(data: Igtbl): IUlist[] {
        return [...data['menus'].slice(0, 3), ...data['groups'].slice(0, 3), ...data['accounts'].slice(0, 3)];
    }

    public getItemDetails(key: any): Observable<ICompAidata> {
        return from(GIDDH_DB.getItemByKey(key).catch(err => {
            return err;
        }));
    }

    public getAllItems(key: string, entity: string): Observable<IUlist[]> {
        return from(GIDDH_DB.getAllItems(key, entity));
    }

    public insertFreshData(item: ICompAidata): Observable<number> {
        return from(GIDDH_DB.insertFreshData(item));
    }

    public addItem(key: string, entity: string, model: IUlist, fromInvalidState: { next: IUlist, previous: IUlist }, isSmallScreen: boolean): Promise<ICompAidata> {
        return GIDDH_DB.addItem(key, entity, model, fromInvalidState, isSmallScreen);
    }
    public removeItem(key: string, entity: string, uniqueName: string) {
        return GIDDH_DB.removeItem(key, entity, uniqueName);
    }
    public deleteAllData(): void {
        GIDDH_DB.forceDeleteDB();
    }

    public clearAllData(): void {
        GIDDH_DB.clearAllData();
    }

}
