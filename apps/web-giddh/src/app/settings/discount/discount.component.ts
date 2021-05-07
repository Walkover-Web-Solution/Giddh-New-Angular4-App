import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { CreateDiscountRequest, IDiscountList } from '../../models/api-models/SettingsDiscount';
import { Observable, ReplaySubject } from 'rxjs';
import { SettingsDiscountActions } from '../../actions/settings/discount/settings.discount.action';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SalesService } from '../../services/sales.service';

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
    @ViewChild('discountConfirmationModel', {static: true}) public discountConfirmationModel: ModalDirective;
    public discountTypeList: IOption[] = []
    public accounts: IOption[];
    public createRequest: CreateDiscountRequest = new CreateDiscountRequest();
    public deleteRequest: string = null;
    public discountList$: Observable<IDiscountList[]>;
    public isDiscountListInProcess$: Observable<boolean>;
    public isDiscountCreateInProcess$: Observable<boolean>;
    public isDiscountCreateSuccess$: Observable<boolean>;
    public isDiscountUpdateInProcess$: Observable<boolean>;
    public isDiscountUpdateSuccess$: Observable<boolean>;
    public isDeleteDiscountInProcess$: Observable<boolean>;
    public isDeleteDiscountSuccess$: Observable<boolean>;
    public accountAsideMenuState: string = 'out';

    private createAccountIsSuccess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private _settingsDiscountAction: SettingsDiscountActions,
        private salesService: SalesService,
        private store: Store<AppState>) {
        this.getDiscountAccounts();

        this.discountList$ = this.store.pipe(select(s => s.settings.discount.discountList), takeUntil(this.destroyed$));
        this.isDiscountListInProcess$ = this.store.pipe(select(s => s.settings.discount.isDiscountListInProcess), takeUntil(this.destroyed$));
        this.isDiscountCreateInProcess$ = this.store.pipe(select(s => s.settings.discount.isDiscountCreateInProcess), takeUntil(this.destroyed$));
        this.isDiscountCreateSuccess$ = this.store.pipe(select(s => s.settings.discount.isDiscountCreateSuccess), takeUntil(this.destroyed$));
        this.isDiscountUpdateInProcess$ = this.store.pipe(select(s => s.settings.discount.isDiscountUpdateInProcess), takeUntil(this.destroyed$));
        this.isDiscountUpdateSuccess$ = this.store.pipe(select(s => s.settings.discount.isDiscountUpdateSuccess), takeUntil(this.destroyed$));
        this.isDeleteDiscountInProcess$ = this.store.pipe(select(s => s.settings.discount.isDeleteDiscountInProcess), takeUntil(this.destroyed$));
        this.isDeleteDiscountSuccess$ = this.store.pipe(select(s => s.settings.discount.isDeleteDiscountSuccess), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());

        this.isDiscountCreateSuccess$.subscribe(s => {
            this.createRequest = new CreateDiscountRequest();
        });

        this.isDiscountUpdateSuccess$.subscribe(s => {
            this.createRequest = new CreateDiscountRequest();
        });

        this.isDeleteDiscountSuccess$.subscribe(d => {
            this.createRequest = new CreateDiscountRequest();
            this.deleteRequest = null;
        });

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
            this.store.dispatch(this._settingsDiscountAction.UpdateDiscount(this.createRequest, this.createRequest.discountUniqueName));
        } else {
            this.store.dispatch(this._settingsDiscountAction.CreateDiscount(this.createRequest));
        }
    }

    public edit(data: IDiscountList) {
        this.createRequest.type = data.discountType;
        this.createRequest.name = data.name;
        this.createRequest.discountValue = data.discountValue;
        this.createRequest.accountUniqueName = data.linkAccount.uniqueName;
        this.createRequest.discountUniqueName = data.uniqueName;
    }

    public showDeleteDiscountModal(uniqueName: string) {
        this.deleteRequest = uniqueName;
        this.discountConfirmationModel.show();
    }

    public hideDeleteDiscountModal() {
        this.deleteRequest = null;
        this.discountConfirmationModel.hide();
    }

    public delete() {
        this.store.dispatch(this._settingsDiscountAction.DeleteDiscount(this.deleteRequest));
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
                    return { label: discount.name, value: discount.uniqueName };
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
        if(event) {
            this.discountTypeList = [
                { label: this.localeData?.discount_types?.as_per_value, value: 'FIX_AMOUNT' },
                { label: this.localeData?.discount_types?.as_per_percent, value: 'PERCENTAGE' }
            ];
        }
    }
}
