import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IOption } from '../../../theme/ng-select/option.interface';
import * as moment from 'moment';
import { CompanyImportExportFileTypes } from '../../../models/interfaces/companyImportExport.interface';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { CompanyImportExportActions } from '../../../actions/company-import-export/company-import-export.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { GeneralService } from '../../../services/general.service';
import { OrganizationType } from '../../../models/user-login-state';

@Component({
	selector: 'company-import-export-form-component',
    templateUrl: 'company-import-export-form.html',
    styleUrls: [`./company-import-export-form.scss`],
})

export class CompanyImportExportFormComponent implements OnInit, OnDestroy {
	@Input('mode') public mode: 'export' | 'import' = 'export';
	@Output('backPressed') public backPressed: EventEmitter<boolean> = new EventEmitter();
	public fileTypes: IOption[] = [
		{ label: 'Accounting Entries', value: CompanyImportExportFileTypes.ACCOUNTING_ENTRIES.toString() },
		{ label: 'Master Except Accounting Entries', value: CompanyImportExportFileTypes.MASTER_EXCEPT_ACCOUNTS.toString() },
	];
	public fileType: string = '';
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
	public from: string = moment().subtract(30, 'days').format('DD-MM-YYYY');
	public to: string = moment().format('DD-MM-YYYY');
	public selectedFile: File = null;

	public isExportInProcess$: Observable<boolean>;
	public isExportSuccess$: Observable<boolean>;
	public isImportInProcess$: Observable<boolean>;
    public isImportSuccess$: Observable<boolean>;

    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
        private _store: Store<AppState>,
        private _companyImportExportActions: CompanyImportExportActions,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService) {
		this.isExportInProcess$ = this._store.select(s => s.companyImportExport.exportRequestInProcess).pipe(takeUntil(this.destroyed$));
		this.isExportSuccess$ = this._store.select(s => s.companyImportExport.exportRequestSuccess).pipe(takeUntil(this.destroyed$));
		this.isImportInProcess$ = this._store.select(s => s.companyImportExport.importRequestInProcess).pipe(takeUntil(this.destroyed$));
		this.isImportSuccess$ = this._store.select(s => s.companyImportExport.importRequestSuccess).pipe(takeUntil(this.destroyed$));
	}

	public ngOnInit() {
		this.isExportSuccess$.subscribe(s => {
			if (s) {
				this.backButtonPressed();
			}
		});

		this.isImportSuccess$.subscribe(s => {
			if (s) {
				this.backButtonPressed();
			}
        });
        this._store.pipe(
            select(state => state.session.companies), take(1)
        ).subscribe(companies => {
            companies = companies || [];
            this.activeCompany = companies.find(company => company.uniqueName === this.generalService.companyUniqueName);
        });
        this.currentCompanyBranches$ = this._store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                const hoBranch = response.find(branch => !branch.parentBranch);
                const currentBranchUniqueName = this.generalService.currentOrganizationType === OrganizationType.Branch ? this.generalService.currentBranchUniqueName : hoBranch ? hoBranch.uniqueName : '';
                this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName));
                this.currentBranch.name = this.currentBranch.name + (this.currentBranch.alias ? ` (${this.currentBranch.alias})` : '');
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this._store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
                }
            }
        });
	}

	public selectedDate(value: any) {
		this.from = moment(value.picker.startDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
		this.to = moment(value.picker.endDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
	}

	public fileSelected(file: File) {
		if (file && file[0]) {
			this.selectedFile = file[0];
		} else {
			this.selectedFile = null;
		}
	}

	public save() {
		if (this.mode === 'export') {
			this._store.dispatch(this._companyImportExportActions.ExportRequest(parseInt(this.fileType), this.from, this.to, this.currentBranch.uniqueName));
		} else {
			this._store.dispatch(this._companyImportExportActions.ImportRequest(parseInt(this.fileType), this.selectedFile, this.currentBranch.uniqueName));
		}
	}

	public backButtonPressed() {
		this.backPressed.emit(true);
	}

	public ngOnDestroy(): void {
		this._store.dispatch(this._companyImportExportActions.ResetCompanyImportExportState());
		this.destroyed$.next(true);
		this.destroyed$.complete();
    }

    /**
     * Branch change handler
     *
     * @memberof CompanyImportExportFormComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
    }
}
