import { Component, EventEmitter, Output, Input, OnDestroy, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { AddAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';
import { AccountsAction } from '../../actions/accounts.actions';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'aside-menu-product-service',
    styleUrls: ['./aside-menu-product-service.component.scss'],
    templateUrl: './aside-menu-product-service.component.html',
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
export class AsideMenuProductServiceComponent implements OnInit, OnDestroy {
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Input() public selectedVoucherType: string;
    /* This will hold branch transfer mode input  */
    @Input() public inputData: string = '';
    @Input() public includeSearchedGroup: boolean = false;
    public autoFocusInChild: boolean = true;
    public isAddStockOpen: boolean = false;
    public isAddServiceOpen: boolean = false;
    public hideFirstStep: boolean = false;
    /** Aside menu state */
    public accountAsideMenuState: string = "in";
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if account has unsaved changes */
    public hasUnsavedChanges: boolean = false;
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;
    /** This will hold stock type */
    public stockType: string = '';


    constructor(
        private accountService: AccountService,
        private toasterService: ToasterService,
        private store: Store<AppState>,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private accountsAction: AccountsAction,
        private changeDetectionRef: ChangeDetectorRef,
        private generalService: GeneralService
    ) {
    }

    /**
     * Lifecycle hook runs on component initialization
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector('body')?.classList?.add('aside-menu-product-service-page');

        this.store.pipe(select(state => state.groupwithaccounts.hasUnsavedChanges), takeUntil(this.destroyed$)).subscribe(response => {
            this.hasUnsavedChanges = response;
        });
    }

    /**
     * This will create the service account
     *
     * @param {AddAccountRequest} item
     * @memberof AsideMenuProductServiceComponent
     */
    public addNewServiceAccount(item: AddAccountRequest): void {
        this.accountService.CreateAccountV2(item.accountRequest, item.activeGroupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.successToast(this.commonLocaleData?.app_account_created);
                this.closeAsideEvent.emit();
            } else {
                this.toasterService.errorToast(response?.message);
            }
        });
    }

    /**
     * This will use for toggle stock pane
     *
     * @param {string} [type]
     * @memberof AsideMenuProductServiceComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('aside-menu-product-service-page');
    }

    public toggleStockPane(type?: string): void {
        this.hideFirstStep = true;
        this.isAddServiceOpen = false;
        this.stockType = type;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    /**
    * Ths will use for toggle service pane
    *
    *
    * @memberof AsideMenuProductServiceComponent
    */
    public toggleServicePane(): void {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = !this.isAddServiceOpen;
    }

    /**
     * Ths will use for close aside pane
     *
     * @param {*} [e]
     * @memberof AsideMenuProductServiceComponent
     */
    public closeAsidePane(event?: any): void {
        if (this.isAddServiceOpen && this.hasUnsavedChanges) {
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                if (action) {
                    this.stockType = '';
                    this.hideFirstStep = false;
                    this.isAddStockOpen = false;
                    this.isAddServiceOpen = false;
                    this.closeAsideEvent.emit();
                }
            });
        } else {
            this.stockType = '';
            this.hideFirstStep = false;
            this.isAddStockOpen = false;
            this.isAddServiceOpen = false;
            this.closeAsideEvent.emit();
        }
    }

    /**
     * This will use for back button presse
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public backButtonPressed(): void {
        if (this.isAddServiceOpen && this.hasUnsavedChanges) {
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                if (action) {
                    this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                    this.stockType = '';
                    this.hideFirstStep = false;
                    this.isAddStockOpen = false;
                    this.isAddServiceOpen = false;
                    this.changeDetectionRef.detectChanges();
                }
            });
        } else {
            this.stockType = '';
            this.hideFirstStep = false;
            this.isAddStockOpen = false;
            this.isAddServiceOpen = false;
        }
    }

    /**
     * This will use for toggle account pane
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public toggleAccountPane() {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = !this.isAddServiceOpen;
    }
}
