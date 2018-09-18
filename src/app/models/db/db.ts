import Dexie from 'dexie';
import { IUlist } from '../interfaces/ulist.interface';

export class UlistDbModel implements IUlist {
  public id: number;
  public name: string;
  public uniqueName: string;
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
      menus: 'uniqueName,name,additional',
      groups: 'uniqueName,name,parentGroups',
      accounts: 'uniqueName,name,parentGroups'
    });
    // directly on retrieved database objects.
    this.menus.mapToClass(UlistDbModel);
    this.groups.mapToClass(UlistDbModel);
    this.accounts.mapToClass(UlistDbModel);
  }

  public getAllItems(entity: string): Promise<any[]> {
    return this[entity].toArray();
  }

  public getItemById(entity: string, key: any): Promise<any> {
    return this[entity].get(key);
  }

  public removeItemById(entity: string, key: any): Promise<any> {
    return this[entity].delete(key);
  }

  public addItem(entity: string, model: any): Promise<number> {
    return this[entity].add(model);
  }
}

export let GIDDH_DB = new AppDatabase();
