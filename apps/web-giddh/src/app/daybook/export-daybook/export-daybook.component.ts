import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { forEach, some } from '../../lodash-optimized';

@Component({
    selector: 'export-daybook',
    templateUrl: './export-daybook.component.html',
    styleUrls: ['./export-daybook.component.scss'],
    standalone:false
})
export class ExportDaybookComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    @Output() public closeExportDaybookModal: EventEmitter<any> = new EventEmitter();

    public emailTypeSelected: string = '';
    /** This variable holds value of Mini button */
    public emailTypeMini: string = '';
    /** This variable holds value of Detailed button */
    public emailTypeDetail: string;
    /** This variable holds value of expanded button */
    public emailTypeExpanded: string;
    public emailData: string = '';
    public fileType: string = 'pdf';
    public order: string = 'asc';
    /** Hide/show voucher number in exported csv */
    public showVoucherNumber: boolean = false;
    /** Hide/show entry voucher in exported csv */
    public showEntryVoucher: boolean = false;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;

    constructor(private permissionDataService: PermissionDataService) {

    }

    public ngOnInit() {
        this.permissionDataService.getData.forEach(f => {
            if (f.name === 'LEDGER') {
                let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
                this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
                this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
                this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
            }
        });
    }

    public exportLedger() {
        this.closeExportDaybookModal.emit({ type: this.emailTypeSelected, fileType: this.fileType, order: this.order, showVoucherNumber: this.showVoucherNumber, showEntryVoucher: this.showEntryVoucher });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }


    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }



}
