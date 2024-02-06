import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { VatService } from '../services/vat.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';


@Component({
    selector: 'auth-hmrc-component',
    templateUrl: './auth-hmrc.component.html',
    styleUrls: ['./auth-hmrc.component.scss']
})

export class AuthHMRCComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* Hold Company Uniquename */
    private companyUniqueName: string;

    constructor(
        private route: ActivatedRoute,
        private vatService: VatService,
        private store: Store<AppState>,
        private toaster: ToasterService
    ) { 
        this.store.pipe(select(state => state.session.activeCompany), take(1)).subscribe(activeCompany => {
            if (activeCompany) {
                this.companyUniqueName = activeCompany.uniqueName;
            }
        });
    }

    /**
     * This will use for component initialization
     *
     * @memberof AuthHMRCComponent
     */
    public ngOnInit() {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(query => {
            if (query?.code) {
                this.saveAuthorization(query.code);
            }
        });
    }

    /**
     * Call Save Authorization Code API call
     *
     * @private
     * @param {string} authorizationCode
     * @memberof AuthHMRCComponent
     */
    private saveAuthorization(authorizationCode: string): void {
        this.vatService.saveAuthorizationCode(this.companyUniqueName, { code: authorizationCode }).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === 'success' && res?.message) {
                this.toaster.successToast(res?.message);
                // setTimeout(() => {
                //     this.router.navigateByUrl('pages/vat-report/obligations');
                // }, 3000);========================== Pending to ask 
                
            } else {
                this.toaster.errorToast(res?.message)
                // setTimeout(() => {
                //     this.router.navigateByUrl('pages/vat-report');
                // }, 3000);========================== Pending to ask 
            }
        })
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof AuthHMRCComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
