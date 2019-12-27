import { Component, EventEmitter, Input, OnDestroy, Output, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { UploadExceltableResponse } from 'apps/web-giddh/src/app/models/api-models/import-excel';
import { base64ToBlob } from 'apps/web-giddh/src/app/shared/helpers/helperFunctions';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'upload-success',
	styleUrls: ['./upload-success.component.scss'],
	templateUrl: './upload-success.component.html',
})

export class UploadSuccessComponent implements OnInit, OnDestroy {
	@Input() public UploadExceltableResponse: UploadExceltableResponse;
	@Output() public onShowReport: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onContinueUpload = new EventEmitter();
	public file: File = null;
	public selectedType: string = '';
	public isAre: string = 'are';
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private store: Store<AppState>, private _importActions: ImportExcelActions, private _route: Router, private _activateRoute: ActivatedRoute) {
		//
	}
	public ngOnInit() {
		if (this.UploadExceltableResponse) {
			this.isAre = Number(this.UploadExceltableResponse.successCount) > 1 ? 'are' : 'is';
		}
		this._activateRoute.params.subscribe(res => {
			if (res) {
				if (res.type) {
					if (res.type === 'trial-balance' || res.type === 'entries') {
						this.selectedType = res.type;
					} else {
						this.selectedType = Number(this.UploadExceltableResponse.successCount) > 1 ? res.type + 's' : res.type;
					}
				} else {
					this.selectedType = 'accounts';
				}
			}
		});


	}
	public downloadImportFile() {
		// rows less than 400 download report
		if (!this.UploadExceltableResponse.message && this.UploadExceltableResponse.response) {
			let blob = base64ToBlob(this.UploadExceltableResponse.response, 'application/vnd.ms-excel', 512);
			return saveAs(blob, `Import-report.csv`);
		}

		// rows grater than 400 show import report screen
		if (this.UploadExceltableResponse.message) {
			this.onShowReport.emit(true);
		}
	}

	private resetStoreData() {
		this.store.dispatch(this._importActions.resetImportExcelState());
	}

	ngOnDestroy(): void {
		this.resetStoreData();
	}

}
