import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { some } from '../../lodash-optimized';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'export-daybook',
    templateUrl: './export-daybook.component.html'
})
export class ExportDaybookComponent implements OnInit, OnDestroy {

    @Output() public closeExportDaybookModal: EventEmitter<any> = new EventEmitter();

    public emailTypeSelected: string = '';
    public emailTypeMini: string = '';
    public emailTypeDetail: string;
    public emailData: string = '';
    public fileType: string = 'pdf';
    public order: string = 'asc';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _permissionDataService: PermissionDataService) {
        //
    }

    public ngOnInit() {
        this._permissionDataService.getData.forEach(f => {
            if (f.name === 'LEDGER') {
                let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
                this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
                this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
                this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
            }
        });
    }

    public exportLedger() {
        this.closeExportDaybookModal.emit({ type: this.emailTypeSelected, fileType: this.fileType, order: this.order });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
