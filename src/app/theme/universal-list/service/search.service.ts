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
  public filterBy(term: string, arr: any[]): any[] {
    let array = cloneDeep(arr);
    let filteredArr: any[] = [];
    let startsWithArr: any[];
    let includesArr: any[] = [];
    // get filtered result
    filteredArr = this.doFilter(array, 'name', term);
    // sort data now
    startsWithArr  = filteredArr.filter((item: any) => {
      if (startsWith(item.name.toLocaleLowerCase(), term)) {
        return item;
      } else {
        includesArr.push(item);
      }
    });
    startsWithArr = CustomSorting.getSortedUsers(startsWithArr, 'name');
    includesArr = CustomSorting.getSortedUsers(includesArr, 'uniqueName');
    return concat(startsWithArr, includesArr);
  }

  // filtering data for own usage
  private doFilter(arr: any, key: string, term: string) {
    return arr.filter((item: any) => {
      return includes(item[key].toLocaleLowerCase(), term);
    });
  }
}
