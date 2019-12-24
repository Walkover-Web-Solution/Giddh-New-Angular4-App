import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { ToasterService } from '../../services/toaster.service';
import { ExportLedgerRequest, MailLedgerRequest } from '../../models/api-models/Ledger';
import { validateEmail } from '../../shared/helpers/helperFunctions';
import { some } from '../../../../lodash-optimized';
import * as moment from 'moment/moment';

@Component({
	selector: 'export-group-ledger',
	templateUrl: './export-group-ledger.component.html'
})
export class ExportGroupLedgerComponent implements OnInit {

	@Output() public closeExportGroupLedgerModal: EventEmitter<any> = new EventEmitter();

	public emailTypeSelected: string = '';
	public emailTypeMini: string = '';
	public emailTypeDetail: string;
	public emailData: string = '';
	public fileType: string = 'pdf';
	public order: string = 'asc';
	public dateRange: { from: string, to: string } = { from: '', to: '' };

	public datePickerOptions: any = {
		locale: {
			applyClass: 'btn-green',
			applyLabel: 'Go',
			fromLabel: 'From',
			format: 'D-MMM-YY',
			toLabel: 'To',
			cancelLabel: 'Cancel',
			customRangeLabel: 'Custom range'
		},
		ranges: {
			'Last 1 Day': [
				moment().subtract(1, 'days'),
				moment()
			],
			'Last 7 Days': [
				moment().subtract(6, 'days'),
				moment()
			],
			'Last 30 Days': [
				moment().subtract(29, 'days'),
				moment()
			],
			'Last 6 Months': [
				moment().subtract(6, 'months'),
				moment()
			],
			'Last 1 Year': [
				moment().subtract(12, 'months'),
				moment()
			]
		},
		startDate: moment().subtract(30, 'days'),
		endDate: moment()
	};

	constructor(private _permissionDataService: PermissionDataService) {
		//
	}

	public ngOnInit() {
		// Set a default date
		this.dateRange.from = moment(moment().subtract(30, 'days')).format(GIDDH_DATE_FORMAT);
		this.dateRange.to = moment(moment()).format(GIDDH_DATE_FORMAT);

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
		this.closeExportGroupLedgerModal.emit({ from: this.dateRange.from, to: this.dateRange.to, type: this.emailTypeSelected, fileType: this.fileType, order: this.order });
	}

	public onSelectDateRange(ev) {
		this.dateRange.from = moment(ev.picker.startDate).format(GIDDH_DATE_FORMAT);
		this.dateRange.to = moment(ev.picker.endDate).format(GIDDH_DATE_FORMAT);
	}

}
