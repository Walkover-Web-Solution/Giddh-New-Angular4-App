import { Injectable } from '@angular/core';
import { cloneDeep, concat, endsWith, includes, startsWith } from '../../../lodash-optimized';

export const CustomSorting = {
	/**
	 * able to sort data by any key
	 */
	getSortedUsers: (data: any[], key: string) => {
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
		let directChild: any[] = [];
		let res: any[] = arr.filter((item: any) => {
			if (!item.type || item.type === 'GROUP') {
				if (includes(item['uNameStr'].toLocaleLowerCase(), priorTerm)) {
					if (endsWith(item['uNameStr'].toLocaleLowerCase(), priorTerm)) {
						directChild.push(item);
					} else {
						return item;
					}
				}
			}
		});
		res = [...directChild, ...res];
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

		const whiteSpaceRegex = /\s/gm;
		if (whiteSpaceRegex.test(term)) {
			const names: string[] = term.split(' ');
			names.forEach((name: string) => {
				filtered = this.performIncludesFilter(array, name);
				array = cloneDeep(filtered);
			});
			let final: any[] = this.performStartsWithFilter(filtered, term);
			return final;
		} else {
			// get filtered result
			filtered = this.performIncludesFilter(array, term);
			// sort data and return
			let final: any[] = this.performStartsWithFilter(filtered, term);
			return final;
		}
	}

	// filtering data for own usage
	private performIncludesFilter(arr: any, term: string) {
		let nameArr: any[] = [];
		let unqNameArr: any[] = [];
		let strNameArr: any[] = [];
		let strUnqNameArr: any[] = [];
		arr.forEach((item: any) => {
			try {
				if (item['name'] && includes(item['name'].toLocaleLowerCase(), term)) {
					nameArr.push(item);
				} else if (item['uniqueName'] && includes(item['uniqueName'].toLocaleLowerCase(), term)) {
					unqNameArr.push(item);
				} else if (item['mergedAccounts'] && includes(item['mergedAccounts'].toLocaleLowerCase(), term)) {
					nameArr.push(item);
				} else if (!item.type || item.type && item.type === 'GROUP') {
					try {
						if (includes(item['nameStr'] && item['nameStr'].toLocaleLowerCase(), term)) {
							strNameArr.push(item);
						} else if (item['uNameStr'] && includes(item['uNameStr'].toLocaleLowerCase(), term)) {
							strUnqNameArr.push(item);
						}
					} catch (error) {
						//
					}
				}
			} catch (error) {
				console.log(error, item);
			}
		});
		return [...nameArr, ...unqNameArr, ...strUnqNameArr, ...strNameArr];
	}

	//
	private performStartsWithFilter(arr, term) {
		let startsWithArr: any[];
		let includesArr: any[] = [];
		startsWithArr = arr.filter((item: any) => {
			if (startsWith(item['name'].toLocaleLowerCase(), term)) {
				return item;
			} else {
				includesArr.push(item);
			}
		});
		// startsWith(item['uniqueName'].toLocaleLowerCase(), term);
		// startsWithArr = CustomSorting.getSortedUsers(startsWithArr, 'name');
		// includesArr = CustomSorting.getSortedUsers(includesArr, key);
		return concat(startsWithArr, includesArr);
	}
}
