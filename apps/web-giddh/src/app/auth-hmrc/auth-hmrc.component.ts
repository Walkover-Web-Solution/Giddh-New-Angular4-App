import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { VatService } from '../services/vat.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { GeneralService } from '../services/general.service';

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
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hold system user client ip */
    public clientIp: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private vatService: VatService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private toaster: ToasterService
    ) {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
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
    public ngOnInit(): void {
        this.generalService.getClientIp().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.ipAddress) {
                this.clientIp = response.ipAddress;
            }
        });
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
        this.vatService.saveAuthorizationCode(this.companyUniqueName, { code: authorizationCode }, this.clientIp).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === 'success') {
                this.toaster.showSnackBar('success', this.commonLocaleData?.app_messages.auth_hmrc_success_message);
                this.router.navigate(['/pages/vat-report/obligations']);
            } else {
                if (res?.message) {
                    this.toaster.showSnackBar('error', res?.message);
                }
                this.router.navigate(['/pages/vat-report']);
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
