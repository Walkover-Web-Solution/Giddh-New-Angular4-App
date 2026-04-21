
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CreateProjectComponent } from '../components/create-project/create-project.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProjectWiseAccountingComponentStore } from '../project-wise-accounting.store';
import { ProjectDetails, ProjectRequestType, ProjectStatusType } from '../project-wise-accounting';
import { GeneralService } from '../../services/general.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ASIDE_PANE_CONFIG, PAGE_SIZE_OPTIONS } from '../../app.constant';
import { MatSort, Sort } from "@angular/material/sort";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';
import { cloneDeep, filter, forEach, includes, map, set } from '../../lodash-optimized';
import { GoToBranchVariant } from '../../shared/go-to-branch/go-to-branch.component';
@Component({
    selector: 'project-wise-accounting',
    templateUrl: './project-wise-accounting.component.html',
    styleUrls: ['./project-wise-accounting.component.scss'],
    providers: [ProjectWiseAccountingComponentStore],
    standalone: false
})
export class ProjectWiseAccountingListComponent implements OnInit, OnDestroy {
    /** Expose GoToBranchVariant enum to template */
    protected readonly GoToBranchVariant = GoToBranchVariant;
    /** Holds table sorting reference */
    @ViewChild(MatSort) sortBy: MatSort;
    /** MatMenuTrigger reference for the date picker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator: MatPaginator;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Data source of table */
    public dataSource: ProjectDetails[] = [];
    /** Holds the request parameters from the URL */
    public projectListRequest: ProjectRequestType;
    /** Holds page size options for pagination */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Hold active company */
    public activeCompany: any;
    /** Holds Total Results Count */
    public totalResults: number = 0;
    /** Observable for fetching projects */
    public isFetchingProjects$: Observable<any> = this.componentStore.isFetchingProjects$;
    /** ReplaySubject to handle component's lifecycle */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** If true, the project search box is displayed */
    public isShowSearchBox: any = {
        name: false,
        status: false
    };
    /** This will use for displayed table columns */
    public displayedColumns: string[] = ['sno', 'name', 'status', 'symbol'];
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store universalDate */
    public universalDate: any;
    /** Selected from date */
    public fromDate: string;
    /** Selected to date */
    public toDate: string;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** True, if search filter is applied */
    public isSearch: boolean = false;
    /** Holds company branches */
    public branches: Array<any>;
    /** True if is company */
    public isCompany: boolean = true;
    /** Enum representing the types of project-wise accounting status type */
    public projectStatusType: typeof ProjectStatusType = ProjectStatusType;
    /** True if project is fetching. */
    public isLoadingGetProject: boolean = false;
    /** Stores the searched name value for the Name filter */
    public projectName: FormControl = new FormControl<string>('');
    /** Stores the searched status value for the status filter */
    public projectStatus: FormControl = new FormControl<string>('');
    /** Stores loading status of profit and loss */
    public profitAndLossStatus: string = 'loading';

    constructor(
        public dialog: MatDialog,
        private componentStore: ProjectWiseAccountingComponentStore,
        private generalService: GeneralService,
        private fb: FormBuilder,
        private changeDetection: ChangeDetectorRef
    ) {
        this.componentStore.patchState({ isFetchingProjects: true });
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                this.setDefaultProject();
            }
        });
    }

    /**
     * Lifecycle hook for component initialization.
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public ngOnInit(): void {
        this.projectName.valueChanges.pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((searchedText: string) => {
            if (typeof searchedText === 'string' && searchedText.trim() !== this.projectListRequest.searchQuery) {
                this.isSearch = searchedText !== '';
                this.projectListRequest.queryColumn = 'NAME';
                this.projectListRequest.searchQuery = searchedText;
                this.projectListRequest.page = 1;
                this.projectStatus.reset();
                this.isShowSearchBox.status = false;
                this.getAllProjectList();
            }
        });

        this.projectStatus.valueChanges.pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((searchedText: string) => {
            if (typeof searchedText === 'string' && searchedText.trim() !== this.projectListRequest.searchQuery) {
                this.isSearch = searchedText !== '';
                this.projectListRequest.queryColumn = 'STATUS';
                this.projectListRequest.searchQuery = searchedText;
                this.projectListRequest.page = 1;
                this.projectName.reset();
                this.isShowSearchBox.name = false;
                this.getAllProjectList();
            }
        });

        this.componentStore.projectsList$.pipe(takeUntil(this.destroyed$)).subscribe(projectList => {
            if (projectList) {
                this.totalResults = projectList.totalItems;
                this.dataSource = this.addDefaultProfitAndLoss(projectList.results);
                this.isLoadingGetProject = false;
            }
        });

        this.componentStore.projectProfitDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                (Array.isArray(this.dataSource) ? this.dataSource : []).forEach((project) => {
                    if (project.uniqueName === response.uniqueName)
                        project.profitAndLoss = response.profitAndLoss;
                })
                this.changeDetection.detectChanges();
            }
        });

        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });

        this.componentStore.removeProjectSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(deleteProjectUniqueName => {
            if (deleteProjectUniqueName) {
                this.dataSource = this.dataSource.filter((project) => {
                    if (project?.uniqueName != deleteProjectUniqueName) {
                        return project;
                    }
                });
                this.totalResults -= 1;
                this.projectListRequest.page = this.generalService.adjustPageIndex(this.totalResults, this.projectListRequest.page, this.projectListRequest.count);
                if (this.dataSource.length === 0) {
                    this.getAllProjectList();
                }
                this.changeDetection.detectChanges();
            }
        });

        this.componentStore.saveProjectSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.body) {
                this.handleProjectResponse(response);
                this.changeDetection.detectChanges();
            }
        });

        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(branchList => {
            if (branchList) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && branchList.length > 1;
                if (!this.isCompany) {
                    if (!this.displayedColumns?.includes("action")) {
                        this.displayedColumns.splice(this.displayedColumns.length, 0, "action");
                    }
                    this.projectListRequest.branchUniqueName = this.generalService.currentBranchUniqueName ?? '';
                } else {
                    this.displayedColumns = this.displayedColumns?.filter(column => column !== "action");
                }
                this.branches = [];
                (Array.isArray(branchList) ? branchList : []).forEach((branch) => {
                    this.branches.push({
                        label: branch?.name,
                        value: branch?.uniqueName
                    });
                });
            }
        });
    }

    /**
     * Toogles the search field
     *
     * @param {string} fieldName Field name to toggle
     * @memberof ProjectWiseAccountingListComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === "name") {
            this.isShowSearchBox.name = true;
        } else if (fieldName === "status") {
            this.isShowSearchBox.status = true;
        }
    }

    /**
    * Returns the placeholder for the current searched field
    *
    * @param {string} fieldName Field name for which placeholder is required
    * @returns {string} Placeholder text
    * @memberof ProjectWiseAccountingListComponent
    */
    public getSearchFieldText(fieldName: string): string {
        if (fieldName === "name" || fieldName === "status") {
            return fieldName === "name" ? this.localeData?.project_name : this.commonLocaleData?.app_status;
        }
        return "";
    }

    /**
     * Click outside handler for Name field search
     *
     * @param {*} event Click outside event
     * @param {*} element Focused element
     * @param {string} searchedFieldName Name of the field through which search is to be performed
     * @return {*}  {void}
     * @memberof ProjectWiseAccountingListComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === "name") {
            if (this.projectName?.value) {
                return;
            }
            if (this.generalService.childOf(event.target, element)) {
                return;
            } else {
                this.isShowSearchBox.name = false;
            }
        } else if (searchedFieldName === "status") {
            if (this.projectStatus?.value) {
                return;
            }
            if (this.generalService.childOf(event.target, element)) {
                return;
            } else {
                this.isShowSearchBox.status = false;
            }
        }
    }

    /**
     * Handles project creation and updates within the data source.
     *
     * @param {*} response - The response object containing project details.
     * @memberof ProjectWiseAccountingListComponent
     */
    public handleProjectResponse(response: any): void {
        if (response.isCreateFlow) {
            response.body["profitAndLoss"] = null;
            this.totalResults += 1;
            this.dataSource = [response.body, ...this.dataSource];
        } else {
            (Array.isArray(this.dataSource) ? this.dataSource : []).forEach((project) => {
                if (project.uniqueName === response.body.uniqueName) {
                    project.name = response.body.name;
                    project.status = response.body.status;
                }
            });
        }
    }

    /**
     * Adds a default profit and loss key to the project details.
     *
     * @private
     * @param {ProjectDetails[]} response - The project details.
     * @returns {ProjectDetails[]} - The updated project details with profit and loss key.
     * @memberof ProjectWiseAccountingListComponent
     */
    private addDefaultProfitAndLoss(response: ProjectDetails[]): ProjectDetails[] {
        return response.map(project => ({
            ...project,
            profitAndLoss: null
        }));
    }

    /**
     * Retrieves the list of all projects.
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public getAllProjectList(): void {
        if (!this.isLoadingGetProject) {
            this.isLoadingGetProject = true;
            this.componentStore.getAllProjects(this.projectListRequest);
        }
    }

    /**
     * Sets the default project details for the project list request.
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public setDefaultProject(): void {
        this.projectListRequest = {
            companyUniqueName: this.activeCompany.uniqueName,
            branchUniqueName: this.generalService.currentBranchUniqueName ?? this.activeCompany.uniqueName,
            sort: 'desc',
            sortBy: 'STATUS',
            page: 1,
            count: PAGINATION_LIMIT,
            searchQuery: '',
            queryColumn: 'STATUS'
        }
        this.getAllProjectList();
    }

    /**
     * Handles page change events and makes an API call to fetch data for the new page.
     *
     * @param {PageEvent} event - The event containing pagination details.
     * @memberof ProjectWiseAccountingListComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.projectListRequest.page = this.projectListRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.projectListRequest.count = event.pageSize;
        this.getAllProjectList();
    }

    /**
     * Handles table sort events and fetches sorted project data.
     *
     * @param {*} event - The sorting event.
     * @memberof ProjectWiseAccountingListComponent
     */
    public sortChange(event: Sort): void {
        if (event) {
            this.projectListRequest.sort = event.direction ? event.direction : 'asc';
            this.projectListRequest.sortBy = event.active?.toUpperCase();
            this.getAllProjectList();
        }
    }

    /**
     * Lifecycle hook for component cleanup.
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Opens a dialog for creating or editing a project.
     *
     * @param {boolean} isCreateFlow - Whether the dialog is for creating a new project.
     * @param {*} project - The project data (if editing).
     * @memberof ProjectWiseAccountingListComponent
     */
    public openCreateProjectDialog(isCreateFlow: boolean, project: any): void {
        const dialogRef = this.dialog.open(CreateProjectComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                isCreateFlow: isCreateFlow,
                project: {
                    companyUniqueName: this.projectListRequest.companyUniqueName,
                    branchUniqueName: this.projectListRequest.branchUniqueName,
                    ...(isCreateFlow ? {} : { projectUniqueName: project.uniqueName })
                },
                ...(isCreateFlow ? {} : { name: project.name })
            },
        });

        dialogRef.afterClosed().subscribe((response) => {
            if (response?.body) {
                this.handleProjectResponse(response);
                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * Opens a confirmation dialog for deleting a project.
     *
     * @param {*} project - The project to be deleted.
     * @memberof ProjectWiseAccountingListComponent
     */
    public openDeleteProjectDialog(project: any): void {
        if (project?.uniqueName) {
            const data: any = {
                companyUniqueName: this.projectListRequest.companyUniqueName,
                branchUniqueName: this.projectListRequest.branchUniqueName,
                projectUniqueName: project.uniqueName
            };
            const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                        width: '630px',
                data: {
                    configuration: this.generalService.deleteConfiguration(this.localeData?.project_delete_confirmation_message?.replace('[PROJECT_NAME]', project.name), this.commonLocaleData)
                }
            });

            dialogRef.afterClosed().subscribe((response) => {
                if (response === this.commonLocaleData?.app_yes) {
                    this.componentStore.deleteProject(data);
                }
            });
        }
    }

    /**
     * Fetches profit and loss details for a specific project.
     *
     * @param {*} event - The project for which to fetch profit and loss details.
     * @memberof ProjectWiseAccountingListComponent
     */
    public getProfitLoss(event: any): void {
        if (event?.uniqueName) {
            event.profitAndLoss = this.profitAndLossStatus;
            const profitRequest = {
                companyUniqueName: this.activeCompany.uniqueName,
                projectUniqueName: event.uniqueName,
                from: this.fromDate,
                to: this.toDate
            }
            this.componentStore.getProjectProfit(profitRequest);
        }
    }

    /**
    * This will show the datepicker
    *
    * @param {boolean} isOpen
    * @memberof ProjectWiseAccountingListComponent
    */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value - Selected date/range value
     * @returns {void}
     * @memberof ProjectWiseAccountingListComponent
     */
    public dateSelectedCallback(value?: any): void {
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            (Array.isArray(this.dataSource) ? this.dataSource : []).forEach((data) => {
                data.profitAndLoss = null;
            });
        }
    }

    /**
     * To reset applied filter
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public resetFilter(): void {
        this.projectName.reset();
        this.projectStatus.reset();
        this.projectListRequest.searchQuery = '';
        this.projectListRequest.queryColumn = 'STATUS';
        this.getAllProjectList();
    }

    /**
     * Toggles the status of a project between "Closed" and "In Progress".
     * @param {*} project
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public convertToClosedOrInProgress(project: any): void {
        this.componentStore.createNewProject({
            request: {
                data: {
                    projectUniqueName: project.uniqueName,
                    companyUniqueName: this.projectListRequest.companyUniqueName,
                    branchUniqueName: this.projectListRequest.branchUniqueName,
                },
                isCreateFlow: false,
            },
            payload: { status: project.status === this.projectStatusType.Closed ? this.projectStatusType.InProgress : this.projectStatusType.Closed }
        });
    }
}
