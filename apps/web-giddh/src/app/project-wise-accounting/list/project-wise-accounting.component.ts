
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CreateProjectComponent } from '../components/create-project/create-project.component';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProjectAccountingComponentStore } from '../project-wise-accounting.store';
import { projectDetails, projectType } from '../project-wise-accounting';
import { GeneralService } from '../../services/general.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PAGE_SIZE_OPTIONS } from '../../vouchers/utility/vouchers.const';
import { MatSort, Sort } from "@angular/material/sort";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { cloneDeep } from '../../lodash-optimized';



@Component({
    selector: 'project-wise-accounting',
    styleUrls: ['./project-wise-accounting.component.scss'],
    templateUrl: './project-wise-accounting.component.html',
    providers: [ProjectAccountingComponentStore]
})
export class ProjectWiseAccountingListComponent implements OnInit, OnDestroy {
    @ViewChild('productSearch', { static: true }) public productSearch: ElementRef;
    // Holds table sorting reference
    @ViewChild(MatSort) sort: MatSort;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Data source of table */
    public dataSource: projectDetails[] = [];
    /** Holds the request param from the url */
    public projectListRequest: projectType;
    /** Holds page Size Options for pagination */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Hold active company */
    public activeCompany: any;
    /** Instance for company list form */
    public companyListForm: FormGroup;
    /** Holds Total Results Count */
    public totalResults: number = 0;
    /** Observable for fetching projects */
    public isFetchingProjects$: Observable<any> = this.componentStore.isFetchingProjects$;
    /** ReplaySubject to handle component's lifecycle */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** If true, the project search box is displayed */
    public showProductSearch: boolean = false;
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator: MatPaginator;
    /** This will use for displayed table columns */
    public displayedColumns: string[] = ['position', 'name', 'archive_status', 'status', 'symbol', 'action'];
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
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Getter for the 'name' form control from the companyListForm. */
    public get name(): FormControl {
        return this.companyListForm.get('name') as FormControl
    }


    constructor(
        public dialog: MatDialog,
        private componentStore: ProjectAccountingComponentStore,
        private generalService: GeneralService,
        private fb: FormBuilder,
        private changeDetection: ChangeDetectorRef,
        private modalService: BsModalService
    ) {
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
        this.initForm();
        this.getAllProjectList();
        this.companyListForm.get('name').valueChanges.pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((searchedText) => {
            if (searchedText) {
                this.projectListRequest.q = searchedText;
                this.getAllProjectList();
            }
        });

        this.componentStore.projectsList$.pipe(takeUntil(this.destroyed$)).subscribe(projectList => {
            if (projectList) {
                this.totalResults = projectList.totalItems;
                this.dataSource = this.addProfitAndLossKey(projectList.results);
            }
        });

        this.componentStore.projectProfitDetails$.pipe(takeUntil(this.destroyed$)).subscribe(profitandloss => {
            if (profitandloss) {
                this.dataSource.forEach((project) => {
                    if (project.uniqueName === profitandloss.uniqueName)
                        project.profitAndLoss = profitandloss.profitAndLoss;
                })
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

        this.componentStore.removeProjectSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(deleteProject => {
            if (deleteProject) {
                this.dataSource = this.dataSource.filter((project) => {
                    if (project.uniqueName != deleteProject) {
                        return project;
                    }
                });
                this.totalResults -= 1;
                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * Adds a default profit and loss key to the project details.
     *
     * @private
     * @param {projectDetails[]} response - The project details.
     * @returns {projectDetails[]} - The updated project details with profit and loss key.
     * @memberof ProjectWiseAccountingListComponent
     */
    private addProfitAndLossKey(response: projectDetails[]): projectDetails[] {
        return response.map(project => ({
            ...project,
            profitAndLoss: -1
        }));
    }

    /**
     * Initializes the form for the company list.
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public initForm(): void {
        this.companyListForm = this.fb.group({
            name: ['']
        });
    }

    /**
     * Retrieves the list of all projects.
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public getAllProjectList(): void {
        this.componentStore.getAllProjects(this.projectListRequest);
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
            sort: 'asc',
            sortBy: 'NAME',
            page: 1,
            count: 10,
            q: ''
        }
    }

    /**
     * Handles page change events and makes an API call to fetch data for the new page.
     *
     * @param {*} event - The event containing pagination details.
     * @memberof ProjectWiseAccountingListComponent
     */
    public handlePageChange(event: any): void {
        this.projectListRequest.count = event.pageSize;
        this.projectListRequest.page = event.pageIndex + 1;
        this.getAllProjectList();
    }

    /**
     * Toggles the visibility of the product search box and focuses on the input if visible.
     *
     * @param {boolean} setBox - Whether to show the product search box.
     * @memberof ProjectWiseAccountingListComponent
     */
    public showProductSearchBox(setBox: boolean): void {
        this.showProductSearch = setBox;
        setTimeout(() => {
            if (this.showProductSearch) {
                this.productSearch?.nativeElement.focus();
            }
        }, 200);
        this.changeDetection.detectChanges();
    }

    /**
     * Handles table sort events and fetches sorted project data.
     *
     * @param {*} event - The sorting event.
     * @memberof ProjectWiseAccountingListComponent
     */
    public sortChange(event: any): void {
        this.projectListRequest.sort = event?.direction ? event?.direction : 'asc';
        this.projectListRequest.sortBy = event?.active.toUpperCase();
        this.getAllProjectList();
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
            width: 'var(--aside-pane-width)',
            height: '100vh',
            position: {
                right: '0',
                top: '0'
            },
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

        dialogRef.afterClosed().pipe(take(1)).subscribe((response) => {
            if (response) {
                if (isCreateFlow) {
                    response["profitAndLoss"] = -1;
                    this.dataSource = [response, ...this.dataSource];
                } else {
                    this.dataSource.forEach((project) => {
                        if (project.uniqueName === response.uniqueName) {
                            project.name = response.name;
                        }
                    });
                }
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
        const data: any = {
            companyUniqueName: this.projectListRequest.companyUniqueName,
            branchUniqueName: this.projectListRequest.branchUniqueName,
            projectUniqueName: project.uniqueName
        };
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: '630px',
            data: {
                configuration: this.generalService.deleteConfiguration(this.commonLocaleData?.app_delete, this.commonLocaleData)
            }

        });

        dialogRef.afterClosed().pipe(take(1)).subscribe((response) => {
            if (response) {
                this.componentStore.deleteProject(data);
            }
        });
    }

    /**
     * Fetches profit and loss details for a specific project.
     *
     * @param {*} event - The project for which to fetch profit and loss details.
     * @memberof ProjectWiseAccountingListComponent
     */
    public getProfitLoss(event): void {
        const profitRequest = {
            companyUniqueName: this.activeCompany.uniqueName,
            projectUniqueName: event.uniqueName,
            from: this.fromDate,
            to: this.toDate
        }
        this.componentStore.getProjectProfit(profitRequest);
    }

    /**
     * This will hide the datepicker
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ProjectWiseAccountingListComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     *To show the datepicker
    *
    * @param {*} element
    * @memberof ProjectWiseAccountingListComponent
    */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }
}
