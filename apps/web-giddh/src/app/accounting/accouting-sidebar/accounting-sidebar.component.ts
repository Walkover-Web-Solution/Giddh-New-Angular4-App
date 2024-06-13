import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { IPageInfo, TallyModuleService } from './../tally-service';
import { ReplaySubject } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { isEqual } from 'apps/web-giddh/src/app/lodash-optimized';
import { VOUCHERS } from '../constants/accounting.constant';

@Component({
    selector: 'accounting-sidebar',
    templateUrl: './accounting-sidebar.component.html',
    styleUrls: ['./accounting-sidebar.component.scss']
})

export class AccountingSidebarComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public AccountListOpen: boolean;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* This will hold locale JSON data */
    @Input() public localeData: any = {};
    public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    public isGroupToggle: boolean;
    public accountSearch: string = '';
    public grpUniqueName: string = '';
    public showAccountList: boolean = true;
    public selectedVoucher: string = null;
    public selectedGrid: string = null;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public accountingVouchers: any = VOUCHERS;
    /** Emits the show discount event  */
    @Output() public showDiscountEvent: EventEmitter<boolean> = new EventEmitter();
    /** Emits the show tax event  */
    @Output() public showTaxEvent: EventEmitter<boolean> = new EventEmitter();
    /** Hold sales entry event  */
    @Input() public salesEntry: boolean;

    constructor(private _tallyModuleService: TallyModuleService) {
        //
    }

    public ngOnInit() {
        this._tallyModuleService.flattenAccounts.pipe(take(1)).subscribe((accounts) => {
            if (accounts) {
                this.setSelectedPage('Contra', 'voucher', 'purchases');
            }
        });
        this.selectedVoucher = 'contra';

        this._tallyModuleService.selectedPageInfo.pipe(distinctUntilChanged((p, q) => {
            if (p && q) {
                return (isEqual(p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        }), takeUntil(this.destroyed$)).subscribe((pageInfo: IPageInfo) => {
            if (pageInfo) {
                this.selectedVoucher = pageInfo.page;
                this.selectedGrid = pageInfo.gridType;
            }
        });
    }

    public ngOnChanges(s) {
        if (s.AccountListOpen) {
            this.showAccountList = !this.showAccountList;
        }
    }

    public setSelectedPage(pageName: string, grid: string, grpUnqName: string) {
        this._tallyModuleService.setVoucher({
            page: pageName,
            uniqueName: grpUnqName,
            gridType: grid
        });
        this.selectedVoucher = pageName;
        this.selectedGrid = grid;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will be use for emit the show discount sidebar state
     *
     * @param {*} event
     * @memberof AccountingSidebarComponent
     */
    public showDiscountSidebar(event: any): void {
        if (event) {
            this.showDiscountEvent.emit(true);
        }
    }

    /**
     * This will be use for emit the show tax sidebar state
     *
     * @param {*} event
     * @memberof AccountingSidebarComponent
     */
    public showTaxSidebar(event: any): void {
        if (event) {
            this.showTaxEvent.emit(true);
        }
    }
}