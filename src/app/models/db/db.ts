import Dexie from 'dexie';
import { ICompAidata, Igtbl, IUlist } from '../interfaces/ulist.interface';
import { orderBy } from '../../lodash-optimized';

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

  public addItem(key: any, entity: string, model: IUlist): Promise<any> {
    return this.companies.get(key).then((res: CompAidataModel) => {
      let arr: IUlist[] = res.aidata[entity];
      let isFound = false;

      arr.map((item: IUlist) => {
        // if additional data found then check if tabindex are same or not
        if (model.additional) {
          if (item.additional) {
            if (item.uniqueName === model.uniqueName && item.additional.tabIndex === model.additional.tabIndex) {
              isFound = true;
              return item = Object.assign(item, model);
            } else {
              return item;
            }
          }
        } else {
          if (item.uniqueName === model.uniqueName) {
            isFound = true;
            return item = Object.assign(item, model);
          } else {
            return item;
          }
        }
      });

      if (!isFound) {
        arr.push(model);
      }
      // order by time and set descending order to get the last element first
      arr = orderBy(arr, ['time'], ['desc']);

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
}

export let GIDDH_DB = new AppDatabase();
