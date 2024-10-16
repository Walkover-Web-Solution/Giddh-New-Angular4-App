import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { CompanyResponse } from 'apps/web-giddh/src/app/models/api-models/Company';
import { ExportBodyRequest } from 'apps/web-giddh/src/app/models/api-models/DaybookRequest';
import { ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { TrialBalanceRequest } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { RecTypePipe } from 'apps/web-giddh/src/app/shared/helpers/pipes/recType/recType.pipe';
import { AppState } from 'apps/web-giddh/src/app/store';
import { saveAs } from 'file-saver';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataFormatter, IFormatable } from '../../model/data-formatter';

export interface Total {
    ob: number;
    cb: number;
    cr: number;
    dr: number;
}

class FormatCsv implements IFormatable {
    public csv = () => `${this.header}\r\n\r\n${this.title}\r\n${this.body}\r\n${this.footer}\r\n`;
    private header: string = '';
    private body: string = '';
    private footer: string = '';
    private title: string = '';

    constructor(
        private request: TrialBalanceRequest,
        private localeData) {
        this.title = this.localeData?.csv.trial_balance.name + ',' + this.localeData?.csv.trial_balance.opening_balance + ',' + this.localeData?.csv.trial_balance.debit + ',' + this.localeData?.csv.trial_balance.credit + ',' + this.localeData?.csv.trial_balance.closing_balance + '\r\n';
    }

    public setHeader(selectedCompany: CompanyResponse) {
        this.header = `${selectedCompany.name ?? ''}\r\n"${selectedCompany.address ?? ''}"\r\n${selectedCompany.city ?? ''}${selectedCompany?.pincode ? '-' : ''}${selectedCompany?.pincode ?? ''}\r\n${this.localeData?.csv.trial_balance.trial_balance} ${this.request.from ?? ''} ${this.localeData?.csv.trial_balance.to} ${this.request.to  ?? ''}\r\n`;
    }

    public setRowData(data: any[], padding: number) {
        this.body += ' '.repeat(padding);
        data.forEach(value => this.body += `${value},`);
        this.body += `\r\n`;
    }

    public setFooter(data: any[]) {
        this.footer += this.localeData?.csv.trial_balance.total;
        data.forEach(value => this.footer += `${value},`);
        this.footer += `\r\n`;
    }
}

@Component({
    selector: 'trial-balance-export-csv',
    templateUrl: './export-csv.component.html',
    providers: [RecTypePipe]
})
export class TrialBalanceExportCsvComponent implements OnInit, OnDestroy {
    @Input() public trialBalanceRequest: TrialBalanceRequest;
    @Input() public selectedCompany: CompanyResponse;
    @Output() public tbExportCsvEvent = new EventEmitter<string>();

    public showCsvDownloadOptions: boolean;
    public enableDownload: boolean = true;
    public imgPath: string = '';

    private dataFormatter: DataFormatter;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private exportData: ChildGroup[];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private recType: RecTypePipe,
        private ledgerService: LedgerService,
        private router: Router,
        private toaster: ToasterService) {
        this.store.pipe(select(p => p.tlPl.tb.exportData), takeUntil(this.destroyed$)).subscribe(p => {
            this.exportData = p;
            this.dataFormatter = new DataFormatter(p, this.selectedCompany, recType);
        });
    }

    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/images/csv.svg' : AppUrl + APP_FOLDER + 'assets/images/csv.svg';
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public downloadCSV(value: string) {
        this.showCsvDownloadOptions = false;
        let csv = '';
        let name = '';
        let formatCsv = new FormatCsv(this.trialBalanceRequest, this.localeData);        
        switch (value) {
            case 'group-wise':
                csv = this.dataFormatter.formatDataGroupWise(this.localeData, this.trialBalanceRequest.from, this.trialBalanceRequest.to);
                name = this.localeData?.csv.trial_balance_group_wise_report_file_name;
                break;
            case 'condensed':
                this.dataFormatter.formatDataCondensed(formatCsv);
                csv = formatCsv.csv();
                name = this.localeData?.csv.trial_balance_condensed_report_file_name;
                break;
            case 'account-wise':
                this.dataFormatter.formatDataAccountWise(formatCsv);
                csv = formatCsv.csv();                
                name = this.localeData?.csv.trial_balance_account_wise_report_file_name;
                break;
            default:
                break;
        }
        this.downLoadFile(name, csv);
    }

    private getIEVersion(): number {
        let Idx;
        let sAgent;
        sAgent = window.navigator.userAgent;
        Idx = sAgent?.indexOf('MSIE');
        if (Idx > 0) {
            return parseInt(sAgent.substring(Idx + 5, sAgent?.indexOf('.', Idx)));
        } else if (!!navigator.userAgent.match(/Trident\/7\./)) {
            return 11;
        } else {
            return 0;
        }
    }

    private downLoadFile(fileName: string, csv: string) {
        if (this.getIEVersion() > 0) {
            let win;
            win = window.open();
            win.document.write('sep=,\r\n', csv);
            win.document.close();
            win.document.execCommand('SaveAs', true, fileName);
            win.close();
        } else {
            let data = new Blob([csv], { type: 'data:text/csv;charset=utf-8' });
            saveAs(data, fileName);
        }
    }

    /**
     * Exports flat report
     *
     * @memberof TrialBalanceExportCsvComponent
     */
    public exportFlatTrialBalanceReport(): void {
        let exportBodyRequest: ExportBodyRequest = new ExportBodyRequest();
        exportBodyRequest.from = this.trialBalanceRequest.from;
        exportBodyRequest.to = this.trialBalanceRequest.to;
        exportBodyRequest.exportType = "FLAT_TRIAL_BALANCE_EXPORT";
        exportBodyRequest.tagName = this.trialBalanceRequest.tagName;
        exportBodyRequest.branchUniqueName = this.trialBalanceRequest.branchUniqueName;
        this.ledgerService.exportData(exportBodyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.router.navigate(["/pages/downloads"]);
                this.toaster.showSnackBar("success", response?.body);
            } else {
                this.toaster.showSnackBar("error", response?.message, response?.code);
            }
        });
    }
}
