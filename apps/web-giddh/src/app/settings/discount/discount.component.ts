import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { CreateDiscountRequest, IDiscountList } from '../../models/api-models/SettingsDiscount';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SalesService } from '../../services/sales.service';
import { SettingsDiscountService } from '../../services/settings.discount.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'setting-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class DiscountComponent implements OnInit, OnDestroy {
    @ViewChild('discountConfirmationModel', { static: true }) public discountConfirmationModel: ModalDirective;
    public discountTypeList: IOption[] = []
    public accounts: IOption[];
    public createRequest: CreateDiscountRequest = new CreateDiscountRequest();
    public deleteRequest: string = null;
    public discountList: IDiscountList[] = [];
    /** Observable for create/update/delete api call in progress */
    public isLoading$: Observable<boolean>;
    public accountAsideMenuState: string = 'out';
    private createAccountIsSuccess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if get all discounts api call in progress */
    public isLoading: boolean = false;

    constructor(
        private salesService: SalesService,
        private store: Store<AppState>,
        private settingsDiscountService: SettingsDiscountService,
        private toaster: ToasterService
    ) {
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.getDiscountAccounts();
        this.getDiscounts();

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            if (yes) {
                if (this.accountAsideMenuState === 'in') {
                    this.toggleAccountAsidePane();
                    this.getDiscountAccounts();
                }
            }
        });
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public submit() {
        if (this.createRequest.discountUniqueName) {
            this.isLoading$ = of(true);
            this.settingsDiscountService.UpdateDiscount(this.createRequest, this.createRequest.discountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.showToaster(this.commonLocaleData?.app_messages?.discount_updated, response);
                this.isLoading$ = of(false);
            });
        } else {
            this.isLoading$ = of(true);
            this.settingsDiscountService.CreateDiscount(this.createRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.showToaster(this.commonLocaleData?.app_messages?.discount_created, response);
                this.isLoading$ = of(false);
            });
        }
    }

    public edit(data: IDiscountList) {
        this.createRequest.type = data.discountType;
        this.createRequest.name = data.name;
        this.createRequest.discountValue = data.discountValue;
        this.createRequest.accountUniqueName = data.linkAccount?.uniqueName;
        this.createRequest.discountUniqueName = data.uniqueName;
    }

    public showDeleteDiscountModal(uniqueName: string) {
        this.deleteRequest = uniqueName;
        this.discountConfirmationModel?.show();
    }

    public hideDeleteDiscountModal() {
        this.deleteRequest = null;
        this.discountConfirmationModel.hide();
    }

    public delete() {
        this.isLoading$ = of(true);
        this.settingsDiscountService.DeleteDiscount(this.deleteRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.showToaster(this.commonLocaleData?.app_messages?.discount_deleted, response);
            this.isLoading$ = of(false);
        });
        this.hideDeleteDiscountModal();
    }

    /**
     * Fetches the discount accounts
     *
     * @memberof DiscountComponent
     */
    public getDiscountAccounts(): void {
        this.salesService.getAccountsWithCurrency('discount').pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results) {
                this.accounts = response.body.results.map(discount => {
                    return { label: discount.name, value: discount?.uniqueName };
                });
            } else {
                this.accounts = [];
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof DiscountComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.discountTypeList = [
                { label: this.localeData?.discount_types?.as_per_value, value: 'FIX_AMOUNT' },
                { label: this.localeData?.discount_types?.as_per_percent, value: 'PERCENTAGE' }
            ];
        }
    }

    /**
     * Fetching list of discounts
     *
     * @private
     * @memberof DiscountComponent
     */
    private getDiscounts(): void {
        this.isLoading = true;
        this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.discountList = response?.body;
            }
            this.isLoading = false;
        });
    }

    /**
     * This will show toaster for success/error message and will get all discounts if success response received
     *
     * @private
     * @param {string} successMessage
     * @param {*} response
     * @memberof DiscountComponent
     */
    private showToaster(successMessage: string, response: any): void {
        this.toaster.clearAllToaster();
        if (response?.status === "success") {
            this.createRequest = new CreateDiscountRequest();
            this.deleteRequest = null;
            this.getDiscounts();
            this.toaster.successToast(successMessage, this.commonLocaleData?.app_success);
        } else {
            this.toaster.errorToast(response?.message, response?.code);
        }
    }
}
