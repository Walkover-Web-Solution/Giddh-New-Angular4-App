import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';

@Component({
    selector: 'upload-file',
    styleUrls: ['./upload-file.component.scss'],
    templateUrl: './upload-file.component.html',
})

export class UploadFileComponent implements OnInit, OnDestroy {
    @Input() public isLoading: boolean;
    @Input() public entity: string;
    @Output() public onFileUpload = new EventEmitter();
    public file: File = null;
    public selectedFileName: string = '';
    public selectedType: string = '';
    public title: string;

    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = {
        name: '',
        uniqueName: ''
    };
    /** Stores the current company */
    public activeCompany: any;

    /** Subject to unsubscribe all the listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private toasterService: ToasterService,
        private activatedRoute: ActivatedRoute,
        private settingsBranchAction: SettingsBranchActions,
        private store: Store<AppState>,
        private generalService: GeneralService
    ) {
        //
    }

    public onFileChange(file: FileList) {
        let validExts = ['csv', 'xls', 'xlsx'];
        let type = this.getExt(file.item(0).name);
        let isValidFileType = validExts.some(s => type === s);

        if (!isValidFileType) {
            this.toasterService.errorToast('Only XLS files are supported for Import');
            this.selectedFileName = '';
            this.file = null;
            return;
        }

        this.file = file.item(0);
        if (this.file) {
            this.selectedFileName = this.file.name;
        } else {
            this.selectedFileName = '';
        }
    }

    public async downloadSampleFile(entity: string, isCsv: boolean = false) {
        const fileUrl = `assets/sample-files/${entity}-sample.${isCsv ? 'csv' : 'xlsx'}`;
        const fileName = `${entity}-sample.${isCsv ? 'csv' : 'xlsx'}`;
        try {
            let blob = await fetch(fileUrl).then(r => r.blob());
            saveAs(blob, fileName);
        } catch (e) {
            console.log('error while downloading sample file :', e);
        }
    }

    public getExt(path) {
        return (path.match(/(?:.+..+[^\/]+$)/ig) != null) ? path.split('.').pop(-1) : 'null';
    }

    /**
     * Initializes the component
     *
     * @memberof UploadFileComponent
     */

    public ngOnInit(): void {
        this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data) {
                this.entity = data.type;
                this.setTitle();
            }
        });
        this.setTitle();
        this.store.pipe(
            select(state => state.session.companies), take(1)
        ).subscribe(companies => {
            companies = companies || [];
            this.activeCompany = companies.find(company => company.uniqueName === this.generalService.companyUniqueName);
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
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
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
                }
            }
        });
    }

    /**
     * Sets the title of the page according to type of entity
     *
     * @memberof UploadFileComponent
     */
    public setTitle(): void {
        if (this.entity === 'group' || this.entity === 'account') {
            this.title = this.entity + 's';
        } else if (this.entity === 'stock') {
            this.title = 'inventories';
        } else if (this.entity === 'trial-balance') {
            this.title = 'Trial Balances';
        } else {
            this.title = this.entity;
        }
    }

    /**
     * Unsubscribes from all the listeners
     *
     * @memberof UploadFileComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Branch change handler
     *
     * @memberof UploadFileComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
    }

    /**
     * File upload handler
     *
     * @param {File} file File uploaded
     * @memberof UploadFileComponent
     */
    public handleFileUpload(file: File): void {
        this.onFileUpload.emit({
            file,
            branchUniqueName: this.entity === 'entries' ? this.currentBranch.uniqueName : ''
        });
    }
}
