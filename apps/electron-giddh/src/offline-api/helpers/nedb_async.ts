/**
 * Connects to local database
 *
 * @export
 * @param {*} db
 * @returns {Promise<any>}
 */
export function loadDatabase(db: any): Promise<any> {
    return new Promise((resolve, reject) => {
        db.loadDatabase((err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Inserts in local database
 *
 * @export
 * @template T
 * @param {*} db
 * @param {T} newDoc
 * @returns {Promise<T>}
 */
export function insertAsync<T>(db: any, newDoc: T): Promise<T> {
    return new Promise((resolve, reject) => {
        db.insert(newDoc, (err, document) => {
            if (err) {
                reject(err);
            } else {
                resolve(document);
            }
        });
    });
}

/**
 * Finds from local database
 *
 * @export
 * @template T
 * @param {*} db
 * @param {*} params
 * @param {T} [projection]
 * @returns {Promise<Array<T>>}
 */
export function findAsync<T>(db: any, params: any, projection?: T): Promise<Array<T>> {
    if (projection) {
        return new Promise((resolve, reject) => {
            db.find(params?.query, projection).skip(params?.start).limit(params?.limit).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            db.find(params?.query).skip(params?.start).limit(params?.limit).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

/**
 * Counts from local database
 *
 * @export
 * @template T
 * @param {*} db
 * @param {*} params
 * @param {T} [projection]
 * @returns {Promise<Array<T>>}
 */
export function countAsync<T>(db: any, params: any, projection?: T): Promise<Array<T>> {
    if (projection) {
        return new Promise((resolve, reject) => {
            db.count(params?.query, projection, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            db.count(params?.query, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

/**
 * Updates in local database
 *
 * @export
 * @template T
 * @param {*} db
 * @param {*} query
 * @param {*} updateQuery
 * @param {*} options
 * @returns {Promise<{ numberOfUpdated: number, affectedData: any, upsert: boolean }>}
 */
export function updateAsync<T>(db: any, query: any, updateQuery: any, options: any): Promise<{ numberOfUpdated: number, affectedData: any, upsert: boolean }> {
    return new Promise((resolve, reject) => {
        db.update(query, updateQuery, options, (err, numberOfUpdated, affectedData, upsert) => {
            if (err) {
                reject(err);
            } else {
                resolve({ numberOfUpdated, affectedData, upsert });
            }
        });
    });
}

/**
 * Removes from local database
 *
 * @export
 * @template T
 * @param {*} db
 * @param {*} query
 * @param {*} [options]
 * @returns {Promise<number>}
 */
export function removeAsync<T>(db: any, query: any, options?: any): Promise<number> {
    if (options) {
        return new Promise((resolve, reject) => {
            db.remove(query, options, (err, n) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(n);
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            db.remove(query, (err, n) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(n);
                }
            });
        });
    }
}