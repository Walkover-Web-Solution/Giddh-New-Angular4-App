import { Component, EventEmitter, Output, Input, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { AddAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
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

    constructor(
        private accountService: AccountService,
        private toasterService: ToasterService,
        private generalService: GeneralService
    ) {

    }
    /**
     * This will use for toggle stock pane
     *
     * @param {string} [type]
     * @memberof AsideMenuProductServiceComponent
     */
    public toggleStockPane(type?: string) {
        this.hideFirstStep = true;
        this.isAddServiceOpen = false;
        this.stockType = type;
        this.isAddStockOpen = !this.isAddStockOpen;
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

    /**
     * Ths will use for close aside pane
     *
     * @param {*} [e]
     * @memberof AsideMenuProductServiceComponent
     */
    public closeAsidePane(e?: any) {
        this.stockType = '';
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
        this.closeAsideEvent.emit();
    }

    /**
     * This will use for back step
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public backButtonPressed() {
        this.stockType = '';
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
    }

    /**
     * Lifecycle hook runs on component initialization
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector('body')?.classList?.add('aside-menu-product-service-page');
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
}
