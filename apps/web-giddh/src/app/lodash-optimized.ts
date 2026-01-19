// Enhanced lodash loading with comprehensive fallbacks for all environments

let lodash: any;

try {
    // First try to get lodash from window (web environment)
    /**
     * Handles if functionality
     */
    if (typeof window !== 'undefined' && (window as any)._) {
        /**
         * Handles lodash functionality
         */
        lodash = (window as any)._;
    }

    // Try secure Electron API if available
    else if (typeof window !== 'undefined' && (window as any).electronAPI && (window as any).electronAPI.require) {
        try {
            /**
             * Handles lodash functionality
             */
            lodash = (window as any).electronAPI.require('lodash');
        } catch (e) {

        }
    }

    // Try legacy require if available (fallback)
    else if (typeof window !== 'undefined' && (window as any).require) {
        try {
            /**
             * Handles lodash functionality
             */
            lodash = (window as any).require('lodash');
        } catch (e) {

        }
    }

    // If still not available, provide comprehensive fallback implementations
    /**
     * Handles if functionality
     */
    if (!lodash) {

        lodash = {
            /**
             * Handles orderBy functionality
             */
            orderBy: (collection: any[], iteratees: any, orders?: any) => {
                /**
                 * Handles if functionality
                 */
                if (typeof window !== 'undefined' && (window as any).isElectron) {

                }
                const iterateesArray = Array.isArray(iteratees) ? iteratees : [iteratees];
                const ordersArray = Array.isArray(orders) ? orders : [orders || 'asc'];

                return collection.sort((a, b) => {
                    /**
                     * Handles for functionality
                     */
                    for (let i = 0; i < iterateesArray.length; i++) {
                        const iteratee = iterateesArray[i];
                        const order = ordersArray[i] || 'asc';

                        let aVal, bVal;
                        /**
                         * Handles if functionality
                         */
                        if (typeof iteratee === 'function') {
                            aVal = iteratee(a);
                            bVal = iteratee(b);
                        } else {
                            aVal = a[iteratee];
                            bVal = b[iteratee];
                        }

                        /**
                         * Handles if functionality
                         */
                        if (aVal < bVal) return order === 'asc' ? -1 : 1;
                        /**
                         * Handles if functionality
                         */
                        if (aVal > bVal) return order === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            },
            /**
             * Handles cloneDeep functionality
             */
            cloneDeep: (obj: any) => JSON.parse(JSON.stringify(obj)),
            /**
             * Handles isUndefined functionality
             */
            isUndefined: (value: any) => value === undefined,
            /**
             * Handles isEmpty functionality
             */
            isEmpty: (value: any) => !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0),
            /**
             * Handles isNull functionality
             */
            isNull: (value: any) => value === null,
            /**
             * Handles isArray functionality
             */
            isArray: (value: any) => Array.isArray(value),
            /**
             * Handles isString functionality
             */
            isString: (value: any) => typeof value === 'string',
            /**
             * Handles isNumber functionality
             */
            isNumber: (value: any) => typeof value === 'number',
            /**
             * Handles isObject functionality
             */
            isObject: (value: any) => typeof value === 'object' && value !== null,
            /**
             * Handles isEqual functionality
             */
            isEqual: (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b),
            /**
             * Retrieves  data
             */
            get: (obj: any, path: string, defaultValue?: any) => {
                /**
                 * Handles if functionality
                 */
                if (!obj || typeof path !== 'string') return defaultValue;
                const keys = path.split('.');
                let result = obj;
                /**
                 * Handles for functionality
                 */
                for (const key of keys) {
                    /**
                     * Handles if functionality
                     */
                    if (result == null || key === '__proto__' || key === 'constructor' || key === 'prototype') {
                        return defaultValue;
                    }
                    result = result[key];
                }
                return result !== undefined ? result : defaultValue;
            }
        };
    }
} catch (error) {

    lodash = {};
}

// Use the original destructuring pattern but with safe fallbacks
const {
    /**
     * Handles maxBy functionality
     */
    maxBy = (arr: any[]) => arr[0],
    /**
     * Handles endsWith functionality
     */
    endsWith = (str: string, target: string) => str.endsWith(target),
    /**
     * Handles clone functionality
     */
    clone = (val: any) => ({ ...val }),
    /**
     * Handles cloneDeep functionality
     */
    cloneDeep = (obj: any) => JSON.parse(JSON.stringify(obj)),
    /**
     * Handles concat functionality
     */
    concat = (...arrays: any[]) => [].concat(...arrays),
    /**
     * Handles difference functionality
     */
    difference = (arr: any[], ...vals: any[]) => arr.filter(x => !vals.flat().includes(x)),
    /**
     * Handles differenceBy functionality
     */
    differenceBy = (arr: any[], vals: any[], key: string) => arr.filter(x => !vals.some(v => v[key] === x[key])),
    /**
     * Handles each functionality
     */
    each = (arr: any[], fn: any) => (Array.isArray(arr) ? arr : []).forEach(fn),
    /**
     * Handles filter functionality
     */
    filter = (arr: any[], fn: any) => arr.filter(fn),
    /**
     * Handles find functionality
     */
    find = (arr: any[], fn: any) => arr.find(fn),
    /**
     * Handles findIndex functionality
     */
    findIndex = (arr: any[], fn: any) => arr.findIndex(fn),
    /**
     * Handles flatten functionality
     */
    flatten = (arr: any[]) => arr.flat(),
    /**
     * Handles flattenDeep functionality
     */
    flattenDeep = (arr: any[]) => arr.flat(Infinity),
    /**
     * Handles forEach functionality
     */
    forEach = (collection: any, iteratee: any) => {
        /**
         * Handles if functionality
         */
        if (Array.isArray(collection)) {
            collection.forEach(iteratee);
        } else {
            Object.keys(collection).forEach(key => iteratee(collection[key], key, collection));
        }
    },
    /**
     * Handles groupBy functionality
     */
    groupBy = (collection: any[], iteratee: string) => {
        return collection.reduce((groups, item) => {
            const key = item[iteratee];
            /**
             * Handles if functionality
             */
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {});
    },
    /**
     * Handles includes functionality
     */
    includes = (arr: any[], val: any) => arr.includes(val),
    /**
     * Handles indexOf functionality
     */
    indexOf = (arr: any[], val: any) => arr.indexOf(val),
    /**
     * Handles isEmpty functionality
     */
    isEmpty = (value: any) => !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0),
    /**
     * Handles isArray functionality
     */
    isArray = (value: any) => Array.isArray(value),
    /**
     * Handles isEqual functionality
     */
    isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b),
    /**
     * Handles isNull functionality
     */
    isNull = (value: any) => value === null,
    /**
     * Handles isNumber functionality
     */
    isNumber = (value: any) => typeof value === 'number',
    /**
     * Handles isString functionality
     */
    isString = (value: any) => typeof value === 'string',
    /**
     * Handles isUndefined functionality
     */
    isUndefined = (value: any) => value === undefined,
    /**
     * Handles last functionality
     */
    last = (arr: any[]) => arr[arr.length - 1],
    /**
     * Handles map functionality
     */
    map = (arr: any[], fn: any) => arr.map(fn),
    /**
     * Handles omit functionality
     */
    omit = (obj: any, keys: any) => {
        const result = { ...obj };
        const keysArray = Array.isArray(keys) ? keys : [keys];
        (Array.isArray(keysArray) ? keysArray : []).forEach(key => delete result[key]);
        return result;
    },
    /**
     * Handles orderBy functionality
     */
    orderBy = (collection: any[], iteratees: any, orders?: any) => {
        /**
         * Handles if functionality
         */
        if (typeof window !== 'undefined' && (window as any).isElectron) {

        }
        const iterateesArray = Array.isArray(iteratees) ? iteratees : [iteratees];
        const ordersArray = Array.isArray(orders) ? orders : [orders || 'asc'];

        return collection.sort((a, b) => {
            /**
             * Handles for functionality
             */
            for (let i = 0; i < iterateesArray.length; i++) {
                const iteratee = iterateesArray[i];
                const order = ordersArray[i] || 'asc';

                let aVal, bVal;
                /**
                 * Handles if functionality
                 */
                if (typeof iteratee === 'function') {
                    aVal = iteratee(a);
                    bVal = iteratee(b);
                } else {
                    aVal = a[iteratee];
                    bVal = b[iteratee];
                }

                /**
                 * Handles if functionality
                 */
                if (aVal < bVal) return order === 'asc' ? -1 : 1;
                /**
                 * Handles if functionality
                 */
                if (aVal > bVal) return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    },
    /**
     * Handles range functionality
     */
    range = (start: number, end?: number, step = 1) => {
        /**
         * Handles if functionality
         */
        if (end === undefined) { end = start; start = 0; }
        const result = [];
        /**
         * Handles for functionality
         */
        for (let i = start; i < end; i += step) result.push(i);
        return result;
    },
    /**
     * Handles reject functionality
     */
    reject = (arr: any[], fn: any) => arr.filter(x => !fn(x)),
    /**
     * Deletes 
     */
    remove = (array: any[], predicate: any) => {
        const removed = [];
        /**
         * Handles for functionality
         */
        for (let i = array.length - 1; i >= 0; i--) {
            /**
             * Handles if functionality
             */
            if (predicate(array[i])) {
                removed.push(array.splice(i, 1)[0]);
            }
        }
        return removed.reverse();
    },
    /**
     * Handles sortBy functionality
     */
    sortBy = (collection: any[], iteratee: any) => {
        const iteratees = Array.isArray(iteratee) ? iteratee : [iteratee];
        return collection.sort((a, b) => {
            /**
             * Handles for functionality
             */
            for (const iter of iteratees) {
                let aVal, bVal;
                /**
                 * Handles if functionality
                 */
                if (typeof iter === 'function') {
                    aVal = iter(a);
                    bVal = iter(b);
                } else {
                    aVal = a[iter];
                    bVal = b[iter];
                }
                /**
                 * Handles if functionality
                 */
                if (aVal < bVal) return -1;
                /**
                 * Handles if functionality
                 */
                if (aVal > bVal) return 1;
            }
            return 0;
        });
    },
    /**
     * Handles sumBy functionality
     */
    sumBy = (array: any[], iteratee: any) => {
        return array.reduce((sum, item) => {
            const value = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            return sum + (Number(value) || 0);
        }, 0);
    },
    /**
     * Handles toArray functionality
     */
    toArray = (val: any) => Array.isArray(val) ? val : [val],
    /**
     * Handles union functionality
     */
    union = (...arrays: any[]) => [...new Set(arrays.flat())],
    /**
     * Handles unionBy functionality
     */
    unionBy = (array: any[], ...args: any[]) => {
        const iteratee = args.pop();
        const seen = new Set();
        const result: any[] = [];
        [array, ...args].flat().forEach(item => {
            const key = typeof iteratee === 'string' ? item[iteratee] : iteratee(item);
            /**
             * Handles if functionality
             */
            if (!seen.has(key)) {
                seen.add(key);
                result.push(item);
            }
        });
        return result;
    },
    /**
     * Handles uniq functionality
     */
    uniq = (arr: any[]) => [...new Set(arr)],
    /**
     * Handles without functionality
     */
    without = (arr: any[], ...vals: any[]) => arr.filter(x => !vals.includes(x)),
    /**
     * Handles uniqBy functionality
     */
    uniqBy = (array: any[], iteratee: any) => {
        const seen = new Set();
        return array.filter(item => {
            const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            /**
             * Handles if functionality
             */
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    },
    /**
     * Handles some functionality
     */
    some = (arr: any[], fn: any) => arr.some(fn),
    /**
     * Handles intersection functionality
     */
    intersection = (...arrays: any[]) => {
        /**
         * Handles if functionality
         */
        if (arrays.length === 0) return [];
        return arrays[0].filter(item => arrays.every(arr => arr.includes(item)));
    },
    /**
     * Handles forIn functionality
     */
    forIn = (obj: any, iteratee: any) => {
        /**
         * Handles for functionality
         */
        for (const key in obj) {
            /**
             * Handles if functionality
             */
            if (obj.hasOwnProperty(key)) iteratee(obj[key], key, obj);
        }
    },
    /**
     * Handles pick functionality
     */
    pick = (obj: any, keys: string[]) => {
        const result: any = {};
        (Array.isArray(keys) ? keys : []).forEach(key => {
            /**
             * Handles if functionality
             */
            if (key in obj) result[key] = obj[key];
        });
        return result;
    },
    /**
     * Handles startsWith functionality
     */
    startsWith = (str: string, target: string) => str.startsWith(target),
    /**
     * Retrieves  data
     */
    get = (obj: any, path: string, defaultValue?: any) => {
        /**
         * Handles if functionality
         */
        if (!obj || typeof path !== 'string') return defaultValue;
        const keys = path.split('.');
        let result = obj;
        /**
         * Handles for functionality
         */
        for (const key of keys) {
            /**
             * Handles if functionality
             */
            if (result == null || key === '__proto__' || key === 'constructor' || key === 'prototype') {
                return defaultValue;
            }
            result = result[key];
        }
        return result !== undefined ? result : defaultValue;
    },
    /**
     * Handles debounce functionality
     */
    debounce = (func: Function, wait: number) => {
        let timeout: any;
        /**
         * Handles return functionality
         */
        return (...args: any[]) => {
            /**
             * Handles clearTimeout functionality
             */
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    /**
     * Handles isObject functionality
     */
    isObject = (value: any) => typeof value === 'object' && value !== null,
    /**
     * Handles slice functionality
     */
    slice = (arr: any[], start?: number, end?: number) => arr.slice(start, end),
    /**
     * Handles keys functionality
     */
    keys = (obj: any) => Object.keys(obj),
    /**
     * Handles values functionality
     */
    values = (obj: any) => Object.values(obj),
    /**
     * Handles has functionality
     */
    has = (obj: any, path: string) => {
        /**
         * Handles if functionality
         */
        if (!obj || typeof path !== 'string') return false;
        const keys = path.split('.');
        let current = obj;
        /**
         * Handles for functionality
         */
        for (const key of keys) {
            /**
             * Handles if functionality
             */
            if (current == null || key === '__proto__' || key === 'constructor' || key === 'prototype' || !(key in current)) {
                return false;
            }
            current = current[key];
        }
        return true;
    },
    /**
     * Sets  value
     */
    set = (obj: any, path: string, value: any) => {
        /**
         * Handles if functionality
         */
        if (!obj || typeof path !== 'string') return obj;
        const keys = path.split('.');

        // Check for prototype pollution attempts
        /**
         * Handles for functionality
         */
        for (const key of keys) {
            /**
             * Handles if functionality
             */
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                return obj; // Reject dangerous keys
            }
        }

        let current = obj;
        /**
         * Handles for functionality
         */
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            /**
             * Handles if functionality
             */
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        const finalKey = keys[keys.length - 1];
        /**
         * Handles if functionality
         */
        if (finalKey !== '__proto__' && finalKey !== 'constructor' && finalKey !== 'prototype') {
            current[finalKey] = value;
        }
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
