import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GIDDH_DB } from '../models/db';
import { ICompAidata, IUlist } from '../models/interfaces/ulist.interface';
import { OrganizationType } from '../models/user-login-state';
import { AppState } from '../store';
import { GeneralService } from './general.service';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * DbService service
 * Provides db related business logic and data operations
 */
export class DbService {
    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService
    ) {

    }

    /**
     * Retrieves itemdetails data
     */
    public getItemDetails(key: any): Observable<ICompAidata> {
        return from(GIDDH_DB.getItemByKey(key).catch(err => {
            return err;
        }));
    }

    /**
     * Retrieves allitems data
     */
    public getAllItems(key: string, entity: string): Observable<IUlist[]> {
        return from(GIDDH_DB.getAllItems(key, entity));
    }

    /**
     * Handles insertFreshData functionality
     */
    public insertFreshData(item: ICompAidata): Observable<number> {
        return from(GIDDH_DB.insertFreshData(item));
    }

    /**
     * Handles addItem functionality
     */
    public addItem(key: string, entity: string, model: IUlist, fromInvalidState: { next: IUlist, previous: IUlist }, isSmallScreen: boolean, isCompany: boolean): Promise<ICompAidata> {
        return GIDDH_DB.addItem(key, entity, model, fromInvalidState, isSmallScreen, isCompany);
    }

    /**
     * Deletes item
     */
    public removeItem(key: string, entity: string, uniqueName: string) {
        let branches = [];
        this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
            branches = response || [];
        });
        return GIDDH_DB.removeItem(key, entity, uniqueName, this.generalService.currentOrganizationType === OrganizationType.Company && branches?.length > 1);
    }

    /**
     * Deletes alldata
     */
    public deleteAllData(): void {
        GIDDH_DB.forceDeleteDB();
    }

    /**
     * Handles clearAllData functionality
     */
    public clearAllData(): void {
        GIDDH_DB.clearAllData();
    }
}
