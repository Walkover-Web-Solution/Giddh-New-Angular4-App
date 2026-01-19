import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { ReplaySubject } from 'rxjs';
import { forEach, some } from '../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'export-daybook',
    templateUrl: './export-daybook.component.html',
    styleUrls: ['./export-daybook.component.scss'],
    standalone:false
})
/**
 * ExportDaybookComponent component
 * Handles exportdaybook functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private permissionDataService: PermissionDataService) {

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        (Array.isArray(this.permissionDataService.getData) ? this.permissionDataService.getData : []).forEach(f => {
            /**
             * Handles if functionality
             */
            if (f.name === 'LEDGER') {
                let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
                this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
                this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
                this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
            }
        });
    }

    /**
     * Handles exportLedger functionality
     */
    public exportLedger() {
        this.closeExportDaybookModal.emit({ type: this.emailTypeSelected, fileType: this.fileType, order: this.order, showVoucherNumber: this.showVoucherNumber, showEntryVoucher: this.showEntryVoucher });
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
