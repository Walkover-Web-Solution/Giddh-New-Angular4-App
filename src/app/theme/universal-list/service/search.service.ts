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

  public filterByConditions(arr: any[], conditions: string[], term?: string): any[] {
    let priorTerm = conditions[conditions.length - 1];
    let res = arr.filter((item: any) => {
      if (!item.type || item.type === 'GROUP') {
        if (includes(item['uNameStr'].toLocaleLowerCase(), priorTerm)) {
          return item;
        }
      }
    });
    if (term) {
      return this.filterByTerm(term, res);
    }
    return res;
  }

  /**
   * this method is used for team data filteration
   * giving priority to name.
   * @param term an string for search
   * @param arr chunk of data
   * return the filtered data of starts with array and includes array.
   */
  public filterByTerm(term: string, arr: any[]): any[] {
    let array = cloneDeep(arr);
    let filtered: any[] = [];
    // get filtered result
    filtered = this.performIncludesFilter(array, term);
    // sort data and return
    let final = this.performStartsWithFilter(filtered, term);
    return final;
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

  private checkForAdditionalFilters(item, term) {
    let result = false;
    if (!item.type || item.type && item.type === 'GROUP') {
      return includes(item['nameStr'].toLocaleLowerCase(), term) ||
      includes(item['uNameStr'].toLocaleLowerCase(), term);
    }
    return result;
  }

  // filtering data for own usage
  private performIncludesFilter(arr: any, term: string) {
    return arr.filter((item: any) => {
      if (
        includes(item['uniqueName'].toLocaleLowerCase(), term) ||
        includes(item['name'].toLocaleLowerCase(), term) || this.checkForAdditionalFilters(item, term)
      ) {
        return item;
      }
    });
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
