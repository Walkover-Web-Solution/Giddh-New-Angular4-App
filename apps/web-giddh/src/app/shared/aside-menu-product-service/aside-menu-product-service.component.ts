import { Component, EventEmitter, Output, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { AddAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';
import { AccountsAction } from '../../actions/accounts.actions';

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
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;
    /** This will hold stock type */
    public stockType: string = '';
    /** True if account has unsaved changes */
    public hasUnsavedChanges: boolean = false;

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
     * Releases memory
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('aside-menu-product-service-page');
    }

    public toggleStockPane(): void {
        this.hideFirstStep = true;
        this.isAddServiceOpen = false;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    public toggleServicePane(): void {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = !this.isAddServiceOpen;
    }

    public closeAsidePane(event?: any): void {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
        this.closeAsideEvent.emit();
    }

    public backButtonPressed(): void {
        if (this.isAddServiceOpen && this.hasUnsavedChanges) {
            this.pageLeaveUtilityService.confirmPageLeave(() => {
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                this.hideFirstStep = false;
                this.isAddStockOpen = false;
                this.isAddServiceOpen = false;
                this.changeDetectionRef.detectChanges();
            });
        } else {
            this.hideFirstStep = false;
            this.isAddStockOpen = false;
            this.isAddServiceOpen = false;
        }
    }
}
