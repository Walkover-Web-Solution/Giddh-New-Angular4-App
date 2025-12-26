// Enhanced lodash loading for Electron with comprehensive fallbacks
console.log('🔧 Loading lodash-optimized for Electron environment');

let lodash: any;

try {
    // Try to get lodash from window (web environment)
    lodash = (window as any)._;

    // If lodash is not available on window, try to require it (Electron environment)
    if (!lodash && typeof (window as any).require !== 'undefined') {
        lodash = (window as any).require('lodash');
    }

    // If still not available, provide comprehensive fallback implementations
    if (!lodash) {
        console.warn('Lodash not available, using fallback implementations');
        lodash = {
            orderBy: (collection: any[], iteratees: any, orders?: any) => {
                console.log('🔧 Using ELECTRON orderBy fallback implementation');
                const iterateesArray = Array.isArray(iteratees) ? iteratees : [iteratees];
                const ordersArray = Array.isArray(orders) ? orders : [orders || 'asc'];

                return collection.sort((a, b) => {
                    for (let i = 0; i < iterateesArray.length; i++) {
                        const iteratee = iterateesArray[i];
                        const order = ordersArray[i] || 'asc';

                        let aVal, bVal;
                        if (typeof iteratee === 'function') {
                            aVal = iteratee(a);
                            bVal = iteratee(b);
                        } else {
                            aVal = a[iteratee];
                            bVal = b[iteratee];
                        }

                        if (aVal < bVal) return order === 'asc' ? -1 : 1;
                        if (aVal > bVal) return order === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            },
            cloneDeep: (obj: any) => JSON.parse(JSON.stringify(obj)),
            isUndefined: (value: any) => value === undefined,
            isEmpty: (value: any) => !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0),
            isNull: (value: any) => value === null,
            isArray: (value: any) => Array.isArray(value),
            isString: (value: any) => typeof value === 'string',
            isNumber: (value: any) => typeof value === 'number',
            isObject: (value: any) => typeof value === 'object' && value !== null,
            isEqual: (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b),
            get: (obj: any, path: string, defaultValue?: any) => {
                const keys = path.split('.');
                let result = obj;
                for (const key of keys) {
                    if (result == null) return defaultValue;
                    result = result[key];
                }
                return result !== undefined ? result : defaultValue;
            }
        };
    }
} catch (error) {
    console.error('Error loading lodash:', error);
    lodash = {};
}

// Use the original destructuring pattern but with safe fallbacks
const {
    maxBy = (arr: any[]) => arr[0],
    endsWith = (str: string, target: string) => str.endsWith(target),
    clone = (val: any) => ({ ...val }),
    cloneDeep = (obj: any) => JSON.parse(JSON.stringify(obj)),
    concat = (...arrays: any[]) => [].concat(...arrays),
    difference = (arr: any[], ...vals: any[]) => arr.filter(x => !vals.flat().includes(x)),
    differenceBy = (arr: any[], vals: any[], key: string) => arr.filter(x => !vals.some(v => v[key] === x[key])),
    each = (arr: any[], fn: any) => arr.forEach(fn),
    filter = (arr: any[], fn: any) => arr.filter(fn),
    find = (arr: any[], fn: any) => arr.find(fn),
    findIndex = (arr: any[], fn: any) => arr.findIndex(fn),
    flatten = (arr: any[]) => arr.flat(),
    flattenDeep = (arr: any[]) => arr.flat(Infinity),
    forEach = (collection: any, iteratee: any) => {
        if (Array.isArray(collection)) {
            collection.forEach(iteratee);
        } else {
            Object.keys(collection).forEach(key => iteratee(collection[key], key, collection));
        }
    },
    groupBy = (collection: any[], iteratee: string) => {
        return collection.reduce((groups, item) => {
            const key = item[iteratee];
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {});
    },
    includes = (arr: any[], val: any) => arr.includes(val),
    indexOf = (arr: any[], val: any) => arr.indexOf(val),
    isEmpty = (value: any) => !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0),
    isArray = (value: any) => Array.isArray(value),
    isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b),
    isNull = (value: any) => value === null,
    isNumber = (value: any) => typeof value === 'number',
    isString = (value: any) => typeof value === 'string',
    isUndefined = (value: any) => value === undefined,
    last = (arr: any[]) => arr[arr.length - 1],
    map = (arr: any[], fn: any) => arr.map(fn),
    omit = (obj: any, keys: any) => {
        const result = { ...obj };
        const keysArray = Array.isArray(keys) ? keys : [keys];
        keysArray.forEach(key => delete result[key]);
        return result;
    },
    orderBy = (collection: any[], iteratees: any, orders?: any) => {
        console.log('🔧 Using ELECTRON orderBy fallback implementation');
        const iterateesArray = Array.isArray(iteratees) ? iteratees : [iteratees];
        const ordersArray = Array.isArray(orders) ? orders : [orders || 'asc'];

        return collection.sort((a, b) => {
            for (let i = 0; i < iterateesArray.length; i++) {
                const iteratee = iterateesArray[i];
                const order = ordersArray[i] || 'asc';

                let aVal, bVal;
                if (typeof iteratee === 'function') {
                    aVal = iteratee(a);
                    bVal = iteratee(b);
                } else {
                    aVal = a[iteratee];
                    bVal = b[iteratee];
                }

                if (aVal < bVal) return order === 'asc' ? -1 : 1;
                if (aVal > bVal) return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    },
    range = (start: number, end?: number, step = 1) => {
        if (end === undefined) { end = start; start = 0; }
        const result = [];
        for (let i = start; i < end; i += step) result.push(i);
        return result;
    },
    reject = (arr: any[], fn: any) => arr.filter(x => !fn(x)),
    remove = (array: any[], predicate: any) => {
        const removed = [];
        for (let i = array.length - 1; i >= 0; i--) {
            if (predicate(array[i])) {
                removed.push(array.splice(i, 1)[0]);
            }
        }
        return removed.reverse();
    },
    sortBy = (collection: any[], iteratee: any) => {
        const iteratees = Array.isArray(iteratee) ? iteratee : [iteratee];
        return collection.sort((a, b) => {
            for (const iter of iteratees) {
                let aVal, bVal;
                if (typeof iter === 'function') {
                    aVal = iter(a);
                    bVal = iter(b);
                } else {
                    aVal = a[iter];
                    bVal = b[iter];
                }
                if (aVal < bVal) return -1;
                if (aVal > bVal) return 1;
            }
            return 0;
        });
    },
    sumBy = (array: any[], iteratee: any) => {
        return array.reduce((sum, item) => {
            const value = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            return sum + (Number(value) || 0);
        }, 0);
    },
    toArray = (val: any) => Array.isArray(val) ? val : [val],
    union = (...arrays: any[]) => [...new Set(arrays.flat())],
    unionBy = (array: any[], ...args: any[]) => {
        const iteratee = args.pop();
        const seen = new Set();
        const result: any[] = [];
        [array, ...args].flat().forEach(item => {
            const key = typeof iteratee === 'string' ? item[iteratee] : iteratee(item);
            if (!seen.has(key)) {
                seen.add(key);
                result.push(item);
            }
        });
        return result;
    },
    uniq = (arr: any[]) => [...new Set(arr)],
    without = (arr: any[], ...vals: any[]) => arr.filter(x => !vals.includes(x)),
    uniqBy = (array: any[], iteratee: any) => {
        const seen = new Set();
        return array.filter(item => {
            const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    },
    some = (arr: any[], fn: any) => arr.some(fn),
    intersection = (...arrays: any[]) => {
        if (arrays.length === 0) return [];
        return arrays[0].filter(item => arrays.every(arr => arr.includes(item)));
    },
    forIn = (obj: any, iteratee: any) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) iteratee(obj[key], key, obj);
        }
    },
    pick = (obj: any, keys: string[]) => {
        const result: any = {};
        keys.forEach(key => {
            if (key in obj) result[key] = obj[key];
        });
        return result;
    },
    startsWith = (str: string, target: string) => str.startsWith(target),
    get = (obj: any, path: string, defaultValue?: any) => {
        const keys = path.split('.');
        let result = obj;
        for (const key of keys) {
            if (result == null) return defaultValue;
            result = result[key];
        }
        return result !== undefined ? result : defaultValue;
    },
    debounce = (func: Function, wait: number) => {
        let timeout: any;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    isObject = (value: any) => typeof value === 'object' && value !== null,
    slice = (arr: any[], start?: number, end?: number) => arr.slice(start, end),
    keys = (obj: any) => Object.keys(obj),
    values = (obj: any) => Object.values(obj),
    has = (obj: any, path: string) => {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (current == null || !(key in current)) return false;
            current = current[key];
        }
        return true;
    },
    set = (obj: any, path: string, value: any) => {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
        return obj;
    }
} = lodash;

export {
    maxBy, endsWith,
    cloneDeep, each, reject, map, filter, orderBy, isNull, flatten, sortBy, indexOf, remove, forEach,
    toArray, groupBy, difference, isUndefined, differenceBy, flattenDeep, union, omit, clone, without,
    isString, find, range, includes, uniq, isEmpty, isNumber, findIndex, concat, unionBy, last, sumBy,
    isArray, isEqual, uniqBy, some, intersection, forIn, pick, startsWith, get,
    debounce, isObject, slice, keys, values, has, set
};
