import Dexie from 'dexie';
import { ICompAidata, Igtbl, IUlist } from '../interfaces/ulist.interface';
import { orderBy } from '../../lodash-optimized';
import { DEFAULT_MENUS } from '../default-menus';

export class UlistDbModel implements IUlist {
    public id: number;
    public name: string;
    public uniqueName: string;
    public time?: number;
    public parentGroups?: any;

    constructor() {
        //
    }
}

export class CompAidataModel implements ICompAidata {
    public name: string;
    public uniqueName: string;
    public aidata: Igtbl;

    constructor() {
        //
    }
}

class AppDatabase extends Dexie {
    public companies: Dexie.Table<ICompAidata, number>;
    public clonedMenus: IUlist[] = [...DEFAULT_MENUS];

    constructor() {
        super('_giddh');
        this.version(1).stores({
            companies: '&uniqueName'
        });
        // directly on retrieved database objects.
        this.companies.mapToClass(CompAidataModel);
    }

    public forceDeleteDB() {
        this.delete();
    }

    public clearAllData() {
        this.companies.clear();
    }

    public getItemByKey(key: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.companies.get(key)
                .then((res) => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
        });
    }

    public insertFreshData(item: ICompAidata): Promise<any> {
        return this.companies.put(item);
    }

    public getAllItems(key: any, entity: string): Promise<any[]> {
        return this.companies.get(key).then((res: CompAidataModel) => {
            return res?.aidata[entity];
        });
    }

    /**
     * Adds the item to indexDB
     *
     * @param {*} key Unique name of indexDB
     * @param {string} entity Entity to be added
     * @param {IUlist} model Entity model data
     * @param {{ next: IUlist, previous: IUlist }} fromInvalidState Invalid state
     * @param {*} isSmallScreen True, if small screen
     * @param {boolean} isCompany True, if company mode is switched and the company has more than HO branch in it (branch count > 1)
     * @returns {Promise<any>}
     * @memberof AppDatabase
     */
    public addItem(key: any, entity: string, model: IUlist, fromInvalidState: { next: IUlist, previous: IUlist }, isSmallScreen, isCompany: boolean): Promise<any> {
        return this.companies.get(key).then((res: CompAidataModel) => {
            if (!res) {
                return Promise.reject('Company data not found in database. Please ensure company is initialized first.');
            }

            let arr: IUlist[] = res?.aidata[entity];
            const limit = 5;

            if (entity === 'menus') {
                arr = this.processMenuEntity(arr, model, fromInvalidState, isSmallScreen, isCompany, limit);
            } else {
                arr = this.processAccountsAndGroups(arr, model);
            }

            res.aidata[entity] = this.getSlicedResult(arr, limit);

            return this.companies.put(res).then(() => {
                return this.companies.get(key);
            }).catch((err) => (err));
        }).catch((err) => {
            // Handle error silently for now
        });
    }

    /**
     * Process menu entity with complex logic for menu management
     */
    private processMenuEntity(arr: IUlist[], model: IUlist, fromInvalidState: { next: IUlist, previous: IUlist }, isSmallScreen: any, isCompany: boolean, limit: number): IUlist[] {
        if (fromInvalidState) {
            return this.handleInvalidStateMenu(arr, model, fromInvalidState);
        } else {
            return this.handleRegularMenuAddition(arr, model, isSmallScreen, isCompany, limit);
        }
    }

    /**
     * Handle invalid state menu replacement
     */
    private handleInvalidStateMenu(arr: IUlist[], model: IUlist, fromInvalidState: { next: IUlist, previous: IUlist }): IUlist[] {
        let invalidEntryIndex = arr?.findIndex(f => f?.uniqueName === fromInvalidState.previous?.uniqueName);
        arr[invalidEntryIndex] = Object.assign({}, model, {
            isRemoved: true,
            pIndex: arr[invalidEntryIndex].pIndex,
            isInvalidState: false
        });
        return arr;
    }

    /**
     * Handle regular menu addition with duplicate checking
     */
    private handleRegularMenuAddition(arr: IUlist[], model: IUlist, isSmallScreen: any, isCompany: boolean, limit: number): IUlist[] {
        const duplicateIndex = this.findDuplicateMenuIndex(arr, model);

        if (duplicateIndex === -1) {
            return this.addNewMenuItem(arr, model, isSmallScreen, isCompany, limit);
        } else {
            return this.updateExistingMenuItem(arr, model, duplicateIndex, isSmallScreen, isCompany, limit);
        }
    }

    /**
     * Find duplicate menu item index
     */
    private findDuplicateMenuIndex(arr: IUlist[], model: IUlist): number {
        return arr?.findIndex(s => {
            if (model.additional) {
                if (s.additional) {
                    return s?.uniqueName === model?.uniqueName && s.additional.tabIndex === model.additional.tabIndex;
                }
            } else {
                return s?.uniqueName === model?.uniqueName;
            }
        });
    }

    /**
     * Add new menu item to array
     */
    private addNewMenuItem(arr: IUlist[], model: IUlist, isSmallScreen: any, isCompany: boolean, limit: number): IUlist[] {
        const indDefaultIndex = this.findDefaultMenuIndex(model);

        if (indDefaultIndex > -1) {
            return this.addFromDefaultMenu(arr, model, indDefaultIndex, isSmallScreen, isCompany, limit);
        } else {
            return this.addToCustomPosition(arr, model, isSmallScreen, isCompany, limit);
        }
    }

    /**
     * Find index in default menus
     */
    private findDefaultMenuIndex(model: IUlist): number {
        return this.clonedMenus?.findIndex((item) => {
            if (model.additional) {
                if (item.additional) {
                    return item?.uniqueName === model?.uniqueName && item.name === model.name && item.additional.tabIndex === model.additional.tabIndex;
                }
            } else {
                return item?.uniqueName === model?.uniqueName && item.name === model.name;
            }
        });
    }

    /**
     * Add menu item from default menu list
     */
    private addFromDefaultMenu(arr: IUlist[], model: IUlist, indDefaultIndex: number, isSmallScreen: any, isCompany: boolean, limit: number): IUlist[] {
        let index = arr?.findIndex(a => this.clonedMenus[indDefaultIndex].pIndex === a.pIndex);

        if (isSmallScreen && index > limit) {
            index = this.smallScreenHandler(index, isCompany);
        }

        if (index > -1) {
            arr[index] = Object.assign({}, model, {
                isRemoved: false,
                pIndex: this.clonedMenus[indDefaultIndex].pIndex
            });
        } else {
            arr.push(Object.assign({}, model, {
                isRemoved: false,
                pIndex: this.clonedMenus[indDefaultIndex].pIndex
            }));
        }

        this.clonedMenus[indDefaultIndex].isRemoved = false;
        return arr;
    }

    /**
     * Add menu item to custom position
     */
    private addToCustomPosition(arr: IUlist[], model: IUlist, isSmallScreen: any, isCompany: boolean, limit: number): IUlist[] {
        let sorted: IUlist[] = orderBy(this.clonedMenus.filter(f => !f.isRemoved), ['pIndex'], ['desc']);

        if (sorted?.length === 0) {
            sorted = DEFAULT_MENUS;
            this.clonedMenus = DEFAULT_MENUS;
        }

        let index = arr?.findIndex(a => sorted[0].pIndex === a.pIndex);
        let originalIndex = -1;

        if (isSmallScreen && index > limit) {
            originalIndex = index;
            index = this.smallScreenHandler(index, isCompany);
        }

        if (index > -1) {
            arr[originalIndex] = arr[index];
            arr[index] = Object.assign({}, model, {
                isRemoved: true,
                pIndex: sorted[0].pIndex
            });
        } else {
            arr.push(Object.assign({}, model, {
                isRemoved: true,
                pIndex: sorted[0].pIndex
            }));
        }

        this.clonedMenus = this.clonedMenus.map(m => {
            if (m.pIndex === sorted[0].pIndex) {
                m.isRemoved = true;
            }
            return m;
        });

        return arr;
    }

    /**
     * Update existing menu item
     */
    private updateExistingMenuItem(arr: IUlist[], model: IUlist, duplicateIndex: number, isSmallScreen: any, isCompany: boolean, limit: number): IUlist[] {
        let originalDuplicateIndex = duplicateIndex;

        if (isSmallScreen && duplicateIndex > limit) {
            duplicateIndex = this.smallScreenHandler(duplicateIndex, isCompany);
        }

        if (this.clonedMenus?.length === 0) {
            this.clonedMenus = DEFAULT_MENUS;
        }

        arr[originalDuplicateIndex] = arr[duplicateIndex];
        arr[duplicateIndex] = Object.assign({}, model, {
            isRemoved: false,
            pIndex: this.clonedMenus[duplicateIndex].pIndex
        });

        return arr;
    }

    /**
     * Process accounts and groups entities
     */
    private processAccountsAndGroups(arr: IUlist[], model: IUlist): IUlist[] {
        let isFound = false;

        arr.map((item: IUlist) => {
            if (item?.uniqueName === model?.uniqueName) {
                isFound = true;
                item = Object.assign(item, model);
                return item;
            } else {
                return item;
            }
        });

        if (!isFound) {
            arr.push(model);
        }

        return orderBy(arr, ['time'], ['desc']);
    }

    /**
     * Removes the item from indexDB
     *
     * @param {*} key Unique name of indexDB
     * @param {string} entity Entity to be deleted
     * @param {string} uniqueName Unique name of the entity
     * @param {boolean} isCompany True, if company mode is switched and the company has more than HO branch in it (branch count > 1)
     * @returns {Promise<ICompAidata>}
     * @memberof AppDatabase
     */
    public removeItem(key: any, entity: string, uniqueName: string, isCompany: boolean): Promise<ICompAidata> {
        return this.companies.get(key).then((res: CompAidataModel) => {
            if (!res) {
                return;
            }
            let arr: IUlist[] = res?.aidata[entity];
            // for accounts and groups
            arr = arr?.filter((item: IUlist) => {
                if (item?.uniqueName !== uniqueName) {
                    return item;
                }
            });
            // order by name
            arr = orderBy(arr, ['time'], ['desc']);
            res.aidata[entity] = this.getSlicedResult(arr);
            // do entry in db and return all data
            return this.companies.put(res).then(() => {
                return this.companies.get(key);
            }).catch((err) => (err));
        }).catch((err) => {

        });
    }

    private getSlicedResult(arr: IUlist[], limit: number = 5): any[] {
        return arr.slice(0, limit);
    }

    private smallScreenHandler(index, isCompany: boolean) {
        const limit = isCompany ? 17 : 7
        /*
        *  if we detect that it's a small screen then check if index is grater then 7 ( because we are showing 8 items in small screen )
        *  then we need to increase set index to index - 1 for displaying searched menu at last
        */
        while (index > limit) {
            index--;
        }
        return index;
    }
}

export let GIDDH_DB = new AppDatabase();
