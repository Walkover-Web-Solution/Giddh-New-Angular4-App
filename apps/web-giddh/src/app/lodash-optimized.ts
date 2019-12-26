const lodash = (window as any)._;
const { maxBy, endsWith, clone, cloneDeep, concat, difference, differenceBy, each, filter, find, findIndex, flatten, flattenDeep, forEach, groupBy, includes, indexOf, isEmpty, isArray, isEqual, isNull, isNumber, isString, isUndefined, last, map, omit, orderBy, range, reject, remove, sortBy, sumBy, toArray, union, unionBy, uniq, without, uniqBy, some, intersection, forIn, pick, startsWith, get, debounce } = lodash;

export {
	maxBy, endsWith,
	cloneDeep, each, reject, map, filter, orderBy, isNull, flatten, sortBy, indexOf, remove, forEach,
	toArray, groupBy, difference, isUndefined, differenceBy, flattenDeep, union, omit, clone, without,
	isString, find, range, includes, uniq, isEmpty, isNumber, findIndex, concat, unionBy, last, sumBy,
	isArray, isEqual, uniqBy, some, intersection, forIn, pick, startsWith, get,
	debounce
};
