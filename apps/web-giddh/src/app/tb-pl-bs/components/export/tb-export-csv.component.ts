import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { RecTypePipe } from '../../../shared/helpers/pipes/recType/recType.pipe';
import { ChildGroup } from '../../../models/api-models/Search';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { CompanyResponse } from '../../../models/api-models/Company';
import { saveAs } from 'file-saver';
import { DataFormatter, IFormatable } from './data-formatter.class';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';

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
	private title: string = 'Name' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\r\n';

	constructor(private request: TrialBalanceRequest) {
		//
	}

	public setHeader(selectedCompany: CompanyResponse) {
		this.header = `${selectedCompany.name}\r\n"${selectedCompany.address}"\r\n${selectedCompany.city}-${selectedCompany.pincode}\r\nTrial Balance: ${this.request.from} to ${this.request.to}\r\n`;
	}

	public setRowData(data: any[], padding: number) {
		this.body += ' '.repeat(padding);
		data.forEach(value => this.body += `${value},`);
		this.body += `\r\n`;
	}

	public setFooter(data: any[]) {
		this.footer += `Total,`;
		data.forEach(value => this.footer += `${value},`);
		this.footer += `\r\n`;
	}
}

@Component({
	selector: 'tb-export-csv',  // <home></home>
	template: `
        <div class="btn-group" dropdown>
        <a dropdownToggle class="cp"><img src="{{ imgPath }}"/></a>
        <ul id="dropdown-pdf" *dropdownMenu class="dropdown-menu dropdown-menu-right cp tbpl-dropdown" role="menu" aria-labelledby="button-basic">
            <span class="caret"></span>
           <li><a (click)="downloadCSV('group-wise')" data-report="group-wise">Group Wise
            Report</a></li>
          <li><a (click)="downloadCSV('condensed')" data-report="condensed">Condensed
            Report</a></li>
          <li><a (click)="downloadCSV('account-wise')" data-report="account-wise">Account
            Wise
            Report</a></li>
        </ul>
      </div>
    <!-- end form-group -->
  `,
	providers: [RecTypePipe]
})

export class TbExportCsvComponent implements OnInit, OnDestroy {
	@Input() public trialBalanceRequest: TrialBalanceRequest;
	@Input() public selectedCompany: CompanyResponse;
	@Output() public tbExportCsvEvent = new EventEmitter<string>();

	public showCsvDownloadOptions: boolean;
	public enableDownload: boolean = true;
	public imgPath: string = '';

	private dataFormatter: DataFormatter;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
	private exportData: ChildGroup[];
	private showOptions: boolean;
	private csvAW: any;

	constructor(private store: Store<AppState>, private recType: RecTypePipe) {
		this.store.select(p => p.tlPl.tb.exportData).subscribe(p => {
			this.exportData = p;
			this.dataFormatter = new DataFormatter(p, this.selectedCompany, recType);
		});
	}

	public ngOnInit() {
		this.imgPath =  (isElectron|| isCordova) ? 'assets/images/csv.png' : AppUrl + APP_FOLDER + 'assets/images/csv.png';
	}

	public ngOnDestroy() {
		//
	}

	public downloadCSV(value: string) {
		this.showCsvDownloadOptions = false;
		let csv = '';
		let name = '';
		let formatCsv = new FormatCsv(this.trialBalanceRequest);
		switch (value) {
			case 'group-wise':
				csv = this.dataFormatter.formatDataGroupWise();
				name = 'Trial_Balance_group-wise.csv';
				break;
			case 'condensed':
				this.dataFormatter.formatDataCondensed(formatCsv);
				csv = formatCsv.csv();
				name = 'Trial_Balance_condensed.csv';
				break;
			case 'account-wise':
				this.dataFormatter.formatDataAccountWise(formatCsv);
				csv = formatCsv.csv();
				name = 'Trial_Balance_account-wise.csv';
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
		Idx = sAgent.indexOf('MSIE');
		if (Idx > 0) {
			return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf('.', Idx)));
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

}
