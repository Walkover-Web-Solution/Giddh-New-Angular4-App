import { Injectable } from '@angular/core';
import { cloneDeep, startsWith, concat, includes } from '../../../lodash-optimized';

export const CustomSorting = {
  /**
   * able to sort data by any key
   */
  getSortedUsers : (data: any[], key: string) => {
    try {
      return data.sort((a, b) => a[key].localeCompare(b[key]));
    } catch (error) {
      return data;
    }
  }
};

@Injectable()
export class UniversalSearchService {

  /**
   * this method is used for team data filteration
   * giving priority to name.
   * @param term an string for search
   * @param arr chunk of data
   * return the filtered data of starts with array and includes array.
   */
  public filterBy(term: string, arr: any[], conditions?: any): any[] {
    let array = cloneDeep(arr);

    if (conditions) {
      //
    } else {
      let filtered: any[] = [];
      let sorted: any[] = [];
      // get filtered result
      filtered = this.performIncludesFilter(array, term);
      // sort data now
      sorted = this.performStartsWithFilter(filtered, term);
      // return this.sortFinalResultByType(concat(u, n));
      return sorted;
    }
  }

  // sort by category
  private sortFinalResultByType(arr: any[]) {
    let menus: any[] = [];
    let groups: any[] = [];
    console.log(arr);
    let acArr: any[] = arr.filter(item => {
      if (item.type) {
        if (item.type === 'MENU') {
          menus.push(item);
        } else if (item.type === 'GROUP') {
          groups.push(item);
        }
      } else {
        return item;
      }
    });
    console.log (menus, groups);
    return concat([], acArr);
  }

  // filtering data for own usage
  private performIncludesFilter(arr: any, term: string) {
    return arr.filter((item: any) => includes(item['uniqueName'].toLocaleLowerCase(), term) || includes(item['name'].toLocaleLowerCase(), term));
  }

  //
  private performStartsWithFilter(arr, term) {
    let startsWithArr: any[];
    let includesArr: any[] = [];
    startsWithArr  = arr.filter((item: any) => {
      if (
        startsWith(item['uniqueName'].toLocaleLowerCase(), term) || startsWith(item['name'].toLocaleLowerCase(), term)
      ) {
        return item;
      } else {
        includesArr.push(item);
      }
    });
    // startsWithArr = CustomSorting.getSortedUsers(startsWithArr, key);
    // includesArr = CustomSorting.getSortedUsers(includesArr, key);
    return concat(startsWithArr, includesArr);
  }
}
