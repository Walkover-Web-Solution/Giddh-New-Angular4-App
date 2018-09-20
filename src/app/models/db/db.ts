import Dexie from 'dexie';
import { IUlist } from '../interfaces/ulist.interface';

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

class AppDatabase extends Dexie {
  public menus: Dexie.Table<any, number>;
  public groups: Dexie.Table<any, number>;
  public accounts: Dexie.Table<any, number>;
  constructor() {
    super('_giddh');
    this.version(1).stores({
      menus: 'uniqueName,name,additional,type,time',
      groups: 'uniqueName,name,parentGroups,type,time',
      accounts: 'uniqueName,name,parentGroups,time'
    });
    // directly on retrieved database objects.
    this.menus.mapToClass(UlistDbModel);
    this.groups.mapToClass(UlistDbModel);
    this.accounts.mapToClass(UlistDbModel);
  }

  public getAllItems(entity: string): Promise<any[]> {
    return this[entity].orderBy('time').reverse().toArray();
  }

  public getItemById(entity: string, key: any): Promise<any> {
    return this[entity].get(key);
  }

  public removeItemById(entity: string, key: any): Promise<any> {
    return this[entity].delete(key);
  }

  public addItem(entity: string, model: any): Promise<number> {
    return this[entity].put(model).then((r) => {
      console.log('Item added or updated successfully');
    }).catch((err) => {
      console.log('%c Error: %c ' + err + '', 'background: #c00; color: #ccc', 'color: #333');
    });
  }
}

export let GIDDH_DB = new AppDatabase();
