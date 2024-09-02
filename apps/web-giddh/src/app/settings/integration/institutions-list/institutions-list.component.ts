import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { InsitutionsRequest } from '../../../models/api-models/SettingsIntegraion';
import { SettingIntegrationComponentStore } from '../utility/setting.integration.store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'institutions-list',
    styleUrls: ['./institutions-list.component.scss'],
    templateUrl: './institutions-list.component.html',
    providers: [SettingIntegrationComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InstitutionsListComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold institutions list */
    public institutions: any[] = [];
    /** Holds Store Institutions list API success state as observable*/
    public institutionsList$: Observable<any> = this.componentStore.select(state => state.institutionList);
    /** This will hold institutions request api form request */
    public institutionsRequest: InsitutionsRequest = new InsitutionsRequest();
    /** This will use for open window */
    public openedWindow: Window | null = null;
    /** Holds Store Save payment provider company API success state as observable*/
    public createEndUserAgreementSuccess$: Observable<any> = this.componentStore.select(state => state.createEndUserAgreementSuccess);
    /** Holds Store Institutions list provider company API success state as observable*/
    public institutionsListInProgress$: Observable<any> = this.componentStore.select(state => state.institutionsListInProgress);
    /** Instance for form group*/
    public searchForm: FormGroup;
    /** Hold filetered item from bank list*/
    public filteredItems: any[] = [];

    constructor(
        private componentStore: SettingIntegrationComponentStore,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public inputData
    ) {
        this.initialForm();
    }

    /**
     * Initializes the component
     *
     * @memberof InstitutionsListComponent
     */
    public ngOnInit(): void {
        this.localeData = this.inputData?.localeData;
        this.commonLocaleData = this.inputData?.commonLocaleData;
        this.getAllInstitutionsList();
        this.institutionsList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.institutions = response.results;
                this.filteredItems = response.results;
                this.changeDetection.detectChanges();
            }
        });

        this.createEndUserAgreementSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dialog?.closeAll();
                this.openWindow(response.link);
                this.changeDetection.detectChanges();
            }
        });

        this.searchForm.get('search')?.valueChanges
            .pipe(debounceTime(300))
            .subscribe(searchTerm => this.filterInstitutions(searchTerm));
    }

    /**
     * This will be use for intialization form
     *
     * @memberof InstitutionsListComponent
     */
    public initialForm(): void {
        this.searchForm = this.formBuilder.group({
            search: ['']
        });
    }

    /**
     * Get All Institutions list
     *
     * @memberof InstitutionsListComponent
     */
    public getAllInstitutionsList(): void {
        this.institutionsRequest.countryCode = 'gb';
        this.componentStore.getAllInstitutions(this.institutionsRequest);
    }

    /**
     * This will be use for filter insitutions from list
     *
     * @param {string} searchText
     * @memberof InstitutionsListComponent
     */
    public filterInstitutions(searchText: string) {
        const lowerCaseTerm = searchText.toLowerCase();
        this.filteredItems = this.institutions.filter(item =>
            item.id.toLowerCase().includes(lowerCaseTerm)
        );
        this.changeDetection.detectChanges();
    }

    /**
     * Open gocardless dialog
     *
     * @param {*} item
     * @memberof InstitutionsListComponent
     */
    public openGocardlessDialog(item: any): void {
        //change krna h abh api se deployed nh hua h ----requisitionId----
        this.componentStore.createEndUserAgreementByInstitutionId('SANDBOXFINANCE_SFIN0000');
    }

    /**
    * This will be open window by url
    *
    * @param {string} url
    * @memberof InstitutionsListComponent
    */
    public openWindow(url: string): void {
        const width = 700;
        const height = 900;

        this.openedWindow = this.generalService.openCenteredWindow(url, '', width, height);
    }

    /**
    * Releases memory
    *
    * @memberof InstitutionsListComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
