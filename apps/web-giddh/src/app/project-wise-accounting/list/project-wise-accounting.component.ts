
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
    /** True if get all discounts api call in progress */
    public isLoading: boolean = false;
    public dataSource: projectDetails[] = [];
    public projectListRequest: projectType;
    /** Holds page Size Options for pagination */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    public activeCompany: any;
    /** Instance for company list form */
    public companyListForm: FormGroup;
    /** True, if  custom searching  is performed */
    public showClearFilter: boolean = false;
    /** Holds Total Results Count */
    public totalResults: number = 0;
    public isFetchingProjects$: Observable<any> = this.componentStore.isFetchingProjects$;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public showProductSearch: boolean = false;
    public get name(): FormControl {
        return this.companyListForm.get('name') as FormControl
    }
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public displayedColumns: string[] = ['position', 'name', 'archive_status', 'status', 'symbol', 'action'];
    /** Universal date observer */
    public universalDate$: Observable<any>;
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
        this.universalDate$ = this.componentStore.universalDate$;
    }

    public ngOnInit() {
        this.initForm();
        this.getAllProjectList();
        this.companyListForm.get('name').valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                if (searchedText) {
                    console.log("searchedText", searchedText);

                    this.projectListRequest.q = searchedText;
                    this.showClearFilter = true;
                    this.getAllProjectList();
                } else {
                    this.showClearFilter = false;
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
                console.log(profitandloss);
                this.dataSource.forEach((project) => {
                    if (project.uniqueName === profitandloss.uniqueName)
                        project.profitAndLoss = profitandloss.profitAndLoss;
                })
            }
        });

        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
        this.componentStore.removeProjectSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(deleteProject => {
            if (deleteProject) {
                console.log(deleteProject);
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
    private addProfitAndLossKey(response: projectDetails[]): projectDetails[] {
        return response.map(project => ({
            ...project,
            profitAndLoss: -1
        }));
    }
    /**
     * This will be use for form intialization
     *
     * @memberof CompanyListDialogComponent
     */
    public initForm(): void {
        this.companyListForm = this.fb.group({
            name: ['']
        });
    }

    public getAllProjectList() {
        this.componentStore.getAllProjects(this.projectListRequest);
    }
    public setDefaultProject() {
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
     * Handle Page Change event and Make API Call
     *
     * @param {*} event
     * @memberof VoucherListComponent
     */
    public handlePageChange(event: any): void {
        this.projectListRequest.count = event.pageSize;
        this.projectListRequest.page = event.pageIndex + 1;
        this.getAllProjectList();
    }

    showProductSearchBox(setBox: boolean) {
        this.showProductSearch = setBox;
        setTimeout(() => {
            if (this.showProductSearch) {
                this.productSearch?.nativeElement.focus();
            }
        }, 200);
        this.changeDetection.detectChanges();
    }

    /**
     *  Handle Mat table sort event
     *
     * @param {*} event
     * @memberof VoucherListComponent
     */
    public sortChange(event: any): void {
        this.projectListRequest.sort = event?.direction ? event?.direction : 'asc';
        this.projectListRequest.sortBy = event?.active.toUpperCase();
        this.getAllProjectList();
    }

    public ngOnDestroy() {

    }
    /**
     *
     */
    public openCreateProjectDialog(isCreateFlow: boolean, project: any) {
        const data: any = {
            isCreateFlow: isCreateFlow,
            project: {
                companyUniqueName: this.projectListRequest.companyUniqueName,
                branchUniqueName: this.projectListRequest.branchUniqueName,
                ...(isCreateFlow ? {} : { projectUniqueName: project.uniqueName })
            },
            ...(isCreateFlow ? {} : { name: project.name })
        };

        const dialogRef = this.dialog.open(CreateProjectComponent, {
            width: 'var(--aside-pane-width)',
            height: '100vh',
            position: {
                right: '0',
                top: '0'
            },
            data: data,
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
                console.log("Updated dataSource with response at index 0:", this.dataSource);
            }
        });
    }

    public openDeleteProjectDialog(project: any) {
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


    public getProfitLoss(event) {
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
     * @memberof AuditLogsFormComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ActivityLogsComponent
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
    * @memberof AuditLogsFormComponent
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
