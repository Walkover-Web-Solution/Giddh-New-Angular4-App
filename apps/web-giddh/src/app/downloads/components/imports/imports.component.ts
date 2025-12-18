import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter' // load on demand
dayjs.extend(isSameOrAfter) // use plugin
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { download } from '@giddh-workspaces/utils';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { ImportsData, ImportsRequest, ImportsSheetDownloadRequest } from '../../../models/api-models/imports';
import { OrganizationType } from '../../../models/user-login-state';
import { GeneralService } from '../../../services/general.service';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { ImportsService } from '../../../services/imports.service';
import { ServiceConfig } from '../../../services/service.config';
import { Configuration } from '../../../app.constant';
import { environment } from '../../../../environments/environment';
import { cloneDeep, find, forEach, keys, map, remove } from '../../../lodash-optimized';
/** Hold information of import  */
const ELEMENT_DATA: ImportsData[] = [];
@Component({
    selector: 'imports',
    
    standalone: false,templateUrl: './imports.component.html',
    styleUrls: ['./imports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ImportsComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* it will store image path */
    public imgPath: string = '';
    /** True if api call in progress */
    public isLoading: boolean = true;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Selected from date */
    public selectedFromDate: Date;
    /** Selected to date */
    public selectedToDate: Date;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Angular Material menu trigger for datepicker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** This will store universalDate */
    public universalDate: any;
    /** To show clear filter */
    public showClearFilter: boolean = false;
    /** This will use for table heading */
    public displayedColumns: string[] = ['importDate', 'by', 'module', 'importFile', 'count', 'errorSheet', 'succesSheet', 'expiry'];
    /** Hold the data of imports */
    public dataSource = ELEMENT_DATA;
    /** This will use for import object */
    /** This will use for page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** This will use for import object */
    public importRequest: ImportsRequest = {
        count: PAGINATION_LIMIT,
        page: 1,
        totalItems: 0,
        from: "",
        to: "",
    };
    /** This will use for to date static*/
    public toDate: string;
    /** This will use for from date static*/
    public fromDate: string;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the current company */
    public activeCompany: any;
    /** True if initial api got called */
    public initialApiCalled: boolean = false;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Instance of is electron variable */
    public isElectron: any = Configuration.isElectron;

    constructor(@Inject(ServiceConfig) private serviceConfig,  public dialog: MatDialog, private importsService: ImportsService, private changeDetection: ChangeDetectorRef, private generalService: GeneralService, private toaster: ToasterService, private settingsBranchAction: SettingsBranchActions, private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof ImportsComponent
     */
    public ngOnInit(): void {
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        document.querySelector('body')?.classList?.add('import-page');

        this.currentOrganizationType = this.generalService.currentOrganizationType;

        this.store.pipe(
            select(state => state.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.name,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (!this.currentBranch || !this.currentBranch.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        };
                    }
                }
                this.importRequest.branchUniqueName = (this.currentBranch) ? this.currentBranch.uniqueName : "";
                if (!this.initialApiCalled) {
                    this.initialApiCalled = true;
                    /** Universal date observer */
                    this.universalDate$.subscribe(dateObj => {
                        if (dateObj) {
                            let universalDate = cloneDeep(dateObj);
                            this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                            this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                            this.importRequest.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.importRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                            this.getImports();
                        }
                    });
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
    }

    /**
     *This function will be called when get the Imports
     *
     * @param {boolean} [resetPage]
     * @memberof ImportsComponent
     */
    public getImports(resetPage?: boolean): void {
        if (resetPage) {
            this.importRequest.page = 1;
        }
        this.isLoading = true;
        this.importsService.getImports(this.importRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            if (response && response.status === 'success') {
                response.body?.items?.forEach((result: any) => {
                    let success = 0;
                    let failed = 0;
                    let total = 0;
                    Object.keys(result.metaData).forEach(key => {
                        total += Number(result.metaData[key].total);
                        success += Number(result.metaData[key].success);
                        failed += Number(result.metaData[key].failed);
                    });
                    result.count = {
                        success: success,
                        failed: failed,
                        total: total
                    }
                    result.date = dayjs(result.date, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                    result.expireAt = dayjs(result.expireAt, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                    
                });
                this.dataSource = response.body?.items;
                this.importRequest.page = response.body?.page;
                this.importRequest.totalItems = response.body?.totalItems;
                this.importRequest.totalPages = response.body?.totalPages;
                this.importRequest.count = response.body?.count;
            } else {
                this.dataSource = [];
                this.importRequest.totalItems = 0;
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
    * This function will change the page of activity logs
    *
    * @param {PageEvent} event
    * @memberof ImportsComponent
    */
    public handlePageEvent(event: PageEvent): void {
        this.importRequest.page = this.importRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.importRequest.count = event.pageSize;
        this.getImports();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} [value]
     * @param {*} [from]
     * @return {*}  {void}
     * @memberof ImportsComponent
     */
    public dateSelectedCallback(value?: any, from?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.showClearFilter = true;
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.importRequest.from = this.fromDate;
            this.importRequest.to = this.toDate;
            this.getImports(true);
        }
    }

    /**
    * This will hide the datepicker
    *
    * @memberof ImportsComponent
    */

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof ImportsComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * To reset applied filter
     *
     * @memberof ImportsComponent
     */
    public resetFilter(): void {
        this.showClearFilter = false;
        //Reset Date with universal date
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.importRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.importRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
        this.getImports(true);
        this.changeDetection.detectChanges();
    }

    /**
     * Releases the memory
     *
     * @memberof ImportsComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('import-page');
    }

    /**
   * Branch change handler
   *
   * @memberof EWayBillComponent
   */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.importRequest.branchUniqueName = selectedEntity?.value;
        this.getImports();
    }

    /**
     * Download import file
     *
     * @param {*} url
     * @memberof ImportsComponent
     */
    public downloadFile(url: string): void {
        if (url) {
            let fileName = url.substring(url.lastIndexOf('/') + 1);
            download(fileName, url, "");
        }
    }

    /**
     * This will use for download error sheet
     *
     * @param {*} element
     * @memberof ImportsComponent
     */
    public downloadErrorSheet(element: any): void {
        let exportRequest = new ImportsSheetDownloadRequest();
        exportRequest.requestId = element.requestId;
        exportRequest.status = "FAILED";
        this.importsService.downloadImportsSheet(exportRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === "success") {
                let blob = this.generalService.base64ToBlob(response?.body, 'application/vnd.ms-excel', 512);
                download(`error_sheet.xlsx`, blob, 'application/vnd.ms-excel');
            } else {
                this.toaster.showSnackBar("error", response.message, response.code);
            }
        });
    }

    /**
     *This will use for download success sheet
     *
     * @param {*} element
     * @memberof ImportsComponent
     */
    public downloadSuccessSheet(element: any): void {
        let exportRequest = new ImportsSheetDownloadRequest();
        exportRequest.requestId = element.requestId;
        exportRequest.status = "SUCCESS";
        this.importsService.downloadImportsSheet(exportRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === "success") {
                let blob = this.generalService.base64ToBlob(response?.body, 'application/vnd.ms-excel', 512);
                download(`success_sheet.xlsx`, blob, 'application/vnd.ms-excel');
            } else {
                this.toaster.showSnackBar("error", response.message, response.code);
            }
        });
    }
}

