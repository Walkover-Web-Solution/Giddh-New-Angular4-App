import { take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StateDetailsRequest } from '../models/api-models/Company';
import { AppState } from '../store/roots';
import { Store, select } from '@ngrx/store';
import { CompanyActions } from '../actions/company.actions';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'about',
    styles: [`
  `],
    template: `
    <h1>About</h1>
    <div>
      For hot module reloading run
      <pre>npm run start:hmr</pre>
    </div>
    <div>
      <h3>
        patrick@AngularClass.com
      </h3>
    </div>
    <pre>this.localState = {{ localState | json }}</pre>
  `
})
export class AboutComponent implements OnInit, OnDestroy {

    public localState: any;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        public route: ActivatedRoute, private store: Store<AppState>, private companyActions: CompanyActions
    ) {
    }

    public ngOnInit() {
        this.route
            .data
            .pipe(takeUntil(this.destroyed$))
            .subscribe((data: any) => {
                /**
                 * Your resolved data from route.
                 */
                this.localState = data.yourData;
            });

        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'about';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        /**
         * static data that is bundled
         * var mockData = require('assets/mock-data/mock-data.json');
         * console.log('mockData', mockData);
         * if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
         */
        this.asyncDataWithWebpack();
    }

    private asyncDataWithWebpack() {
        /**
         * you can also async load mock data with 'es6-promise-loader'
         * you would do this if you don't want the mock-data bundled
         * remember that 'es6-promise-loader' is a promise
         */

    }

    /**
     * Releases memory
     *
     * @memberof AboutComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
