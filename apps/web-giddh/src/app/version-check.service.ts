import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class VersionCheckService {

    public onVersionChange$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    // this will be replaced by actual hash post-build.js
    private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

    constructor(private http: HttpClient) {
    }

    /**
     * Checks in every set frequency the version of frontend application
     * @param url
     * @param {number} frequency - in milliseconds, defaults to 30 minutes
     */
    public initVersionCheck(url, frequency = 1000 * 60 * 1) { // will check in every 1 minutes
        this.checkVersion(url);

        setTimeout(() => {
            this.checkVersion(url);
        }, 2000);

        setInterval(() => {
            this.checkVersion(url);
        }, frequency);
    }

    /**
     * Will do the call and check if the hash has changed or not
     * @param url
     */
    private checkVersion(url) {
        // timestamp these requests to invalidate caches
        this.http.get(url + '?t=' + new Date().getTime()).pipe(take(1))
            .subscribe(
                (response: any) => {
                    const hash = response.hash;
                    const hashChanged = this.hasHashChanged(this.currentHash, hash);

                    // If new version, do something
                    if (hashChanged) {
                        // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
                        // for an example: location.reload();
                        this.onVersionChange$.next(true);
                    }
                    // store the new hash so we wouldn't trigger versionChange again
                    // only necessary in case you did not force refresh
                    this.currentHash = hash;
                },
                (err) => {
                    console.error(err, 'Could not get version');
                }
            );
    }

    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     * @param currentHash
     * @param newHash
     * @returns {boolean}
     */
    private hasHashChanged(currentHash, newHash) {
        if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
            return false;
        }
        return currentHash !== newHash;
    }
}
