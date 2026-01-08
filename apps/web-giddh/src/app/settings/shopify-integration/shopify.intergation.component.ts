import { Component, OnDestroy, OnInit } from '@angular/core';
import { EcommerceService } from '../../services/ecommerce.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { isEmpty } from '../../lodash-optimized';

@Component({
    selector: 'shopify-integration',
    templateUrl: './shopify.intergation.component.html',
    styleUrls: ['./shopify.intergation.component.scss'],
    standalone:false
})
export class ShopifyIntegrationComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* True if shopify use is verified */
    public isEcommerceShopifyUserVerified: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private ecommerceService: EcommerceService, private store: Store<AppState>,) {
    }

    /**
     * This hook will use for init
     *
     * @memberof ShopifyIntegrationComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(profileObj => profileObj.settings.profile), takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && !isEmpty(res)) {
                if (res && res.ecommerceDetails && res.ecommerceDetails.length > 0) {
                    (Array.isArray(res.ecommerceDetails) ? res.ecommerceDetails : []).forEach(item => {
                        if (item && item.ecommerceType && item.ecommerceType.name && item.ecommerceType.name === "shopify") {
                            this.getShopifyVerifyStatus(item.uniqueName);
                        }
                    })
                }
            }
        });
    }

    /**
     * API call to get know about ecommerce platform shopify connected or not
     *
     * @param {string} ecommerceUniqueName ecommerce unique name for shopify
     * @memberof ShopifyIntegrationComponent
     */
    public getShopifyVerifyStatus(ecommerceUniqueName: string): void {
        const requestObj = { source: "shopify" };
        this.ecommerceService.isShopifyConnected(requestObj, ecommerceUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success' && response.body === 'VERIFIED') {
                    this.isEcommerceShopifyUserVerified = true;
                }
            }
        })
    }

    /**
     * Releases memory
     *
     * @memberof ShopifyIntegrationComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}


