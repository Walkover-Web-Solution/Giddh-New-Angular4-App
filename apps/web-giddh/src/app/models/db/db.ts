import Dexie from 'dexie';
import { ICompAidata, Igtbl, IUlist } from '../interfaces/ulist.interface';
import { orderBy } from '../../lodash-optimized';
import { DEFAULT_MENUS } from '../defaultMenus';

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
      return res.aidata[entity];
    });
  }

  public addItem(key: any, entity: string, model: IUlist, fromInvalidState: { next: IUlist, previous: IUlist }, isSmallScreen): Promise<any> {
    return this.companies.get(key).then((res: CompAidataModel) => {
      if(!res){
        return;
      }
      let arr: IUlist[] = res.aidata[entity];
      let isFound = false;

      if (entity === 'menus') {
        // if any fromInvalidState remove it and replace it with new menu
        if (fromInvalidState) {
          let invalidEntryIndex = arr.findIndex(f => f.uniqueName === fromInvalidState.previous.uniqueName);
          arr[invalidEntryIndex] = Object.assign({}, model, {isRemoved: true, pIndex: arr[invalidEntryIndex].pIndex, isInvalidState: false});
        } else {

          let duplicateIndex: number;
          if (model.uniqueName === '/pages/invoice/preview/sales' && model.additional && model.additional.tabIndex === 0) {
            duplicateIndex = -1;
          } else {
            duplicateIndex = arr.findIndex(s => {
              if (model.additional) {
                if (s.additional) {
                  return s.uniqueName === model.uniqueName && s.additional.tabIndex === model.additional.tabIndex;
                }
              } else {
                return s.uniqueName === model.uniqueName;
              }
            });
          }

          // if duplicate item found then skip it
          if (duplicateIndex === -1) {
            let indDefaultIndex = this.clonedMenus.findIndex((item) => {
              if (model.additional) {
                if (item.additional) {
                  return item.uniqueName === model.uniqueName && item.name === model.name && item.additional.tabIndex === model.additional.tabIndex;
                }
              } else {
                return item.uniqueName === model.uniqueName && item.name === model.name;
              }
            });

            // if searched menu is in default list then add it to menu and mark that item as not removed in default menu
            if (indDefaultIndex > -1) {
              // index where menu should be added
              let index = arr.findIndex(a => this.clonedMenus[indDefaultIndex].pIndex === a.pIndex);
              if (isSmallScreen && index > 7) {
                index = this.smallScreenHandler(index);
              }
              arr[index] = Object.assign({}, model, {isRemoved: false, pIndex: this.clonedMenus[indDefaultIndex].pIndex});
              this.clonedMenus[indDefaultIndex].isRemoved = false;
            } else {
              /* if not in default menu first find where it should be added
                then add it to menu at specific position and then mark that item as removed in default menu
               */
              let sorted: IUlist[] = orderBy(this.clonedMenus.filter(f => !f.isRemoved), ['pIndex'], ['desc']);
              if(sorted.length === 0){
                sorted = DEFAULT_MENUS;
                this.clonedMenus = DEFAULT_MENUS;
              }
              // index where menu should be added
              let index = arr.findIndex(a => sorted[0].pIndex === a.pIndex);

              let originalIndex = duplicateIndex;
              if (isSmallScreen && index > 7) {
                originalIndex = index;
                index = this.smallScreenHandler(index);
              }

              if (index > -1) {
                arr[originalIndex] = arr[index];
                arr[index] = Object.assign({}, model, {isRemoved: true, pIndex: sorted[0].pIndex});
                this.clonedMenus = this.clonedMenus.map(m => {
                  if (m.pIndex === sorted[0].pIndex) {
                    m.isRemoved = true;
                  }
                  return m;
                });
              }
            }
          } else {
            let originalDuplicateIndex = duplicateIndex;
            if (isSmallScreen && duplicateIndex > 7) {
              duplicateIndex = this.smallScreenHandler(duplicateIndex);
            }
            if(this.clonedMenus.length === 0){
              this.clonedMenus = DEFAULT_MENUS;
            }
            arr[originalDuplicateIndex] = arr[duplicateIndex];
            arr[duplicateIndex] = Object.assign({}, model, {isRemoved: false, pIndex: this.clonedMenus[duplicateIndex].pIndex});
          }
        }
      } else {
        // for accounts and groups
        arr.map((item: IUlist) => {
          if (item.uniqueName === model.uniqueName) {
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
        // order by name
        arr = orderBy(arr, ['time'], ['desc']);
      }

      res.aidata[entity] = this.getSlicedResult(entity, arr);

      // do entry in db and return all data
      return this.companies.put(res).then(() => {
        return this.companies.get(key);
      }).catch((err) => (err));
    }).catch((err) => {
      console.log('error while adding item', err);
    });
  }

  private getSlicedResult(entity: string, arr: IUlist[]): any[] {
    let endCount: number = 0;
    if (entity === 'menus') {
      endCount = 15;
    } else if (entity === 'groups') {
      endCount = 40;
    } else if (entity === 'accounts') {
      endCount = 45;
    }
    return arr.slice(0, endCount);
  }

  private smallScreenHandler(index) {
    /*
    *  if we detect that it's a small screen then check if index is grater then 7 ( because we are showing 8 items in small screen )
    *  then we need to increase set index to index - 1 for displaying searched menu at last
    */
    while (index > 7) {
      index--;
    }
    return index;
  }
}

export let GIDDH_DB = new AppDatabase();
