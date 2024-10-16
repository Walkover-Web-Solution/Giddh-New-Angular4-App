import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GIDDH_DB } from '../models/db';
import { ICompAidata, IUlist } from '../models/interfaces/ulist.interface';
import { OrganizationType } from '../models/user-login-state';
import { AppState } from '../store';
import { GeneralService } from './general.service';

@Injectable()
export class DbService {
    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService
    ) {

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

    public addItem(key: string, entity: string, model: IUlist, fromInvalidState: { next: IUlist, previous: IUlist }, isSmallScreen: boolean, isCompany: boolean): Promise<ICompAidata> {
        return GIDDH_DB.addItem(key, entity, model, fromInvalidState, isSmallScreen, isCompany);
    }

    public removeItem(key: string, entity: string, uniqueName: string) {
        let branches = [];
        this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
            branches = response || [];
        });
        return GIDDH_DB.removeItem(key, entity, uniqueName, this.generalService.currentOrganizationType === OrganizationType.Company && branches?.length > 1);
    }

    public deleteAllData(): void {
        GIDDH_DB.forceDeleteDB();
    }

    public clearAllData(): void {
        GIDDH_DB.clearAllData();
    }
}
