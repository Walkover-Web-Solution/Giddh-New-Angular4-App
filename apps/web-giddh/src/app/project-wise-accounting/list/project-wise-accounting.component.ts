
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CreateProjectComponent } from '../components/create-project/create-project.component';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProjectAccountingComponentStore } from '../project-wise-accounting.store';
import { projectDetails, projectType } from '../project-wise-accounting';
import { GeneralService } from '../../services/general.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const ELEMENT_DATA: projectDetails[] = [
    { position: 1, name: 'Project 1', status: 'ACTIVE', symbol: '', action: '' },
    { position: 2, name: 'Project 2', status: 'ACTIVE', symbol: '', action: '' },
    { position: 3, name: 'Project 3', status: 'ACTIVE', symbol: '', action: '' },
];


@Component({
    selector: 'project-wise-accounting',
    styleUrls: ['./project-wise-accounting.component.scss'],
    templateUrl: './project-wise-accounting.component.html',
    providers: [ProjectAccountingComponentStore]
})
export class ProjectWiseAccountingListComponent implements OnInit, OnDestroy {
    @ViewChild('productSearch', { static: true }) public productSearch: ElementRef;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if get all discounts api call in progress */
    public isLoading: boolean = false;
    public dataSource: projectDetails[] = [];
    public projectListRequest: projectType;
    public activeCompany: any;
    /** Instance for company list form */
    public companyListForm: FormGroup;
    /** True, if  custom searching  is performed */
    public showClearFilter: boolean = false;
    public isFetchingProjects$: Observable<any> = this.componentStore.isFetchingProjects$;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public showProductSearch: boolean = false;
    public get name(): FormControl {
        return this.companyListForm.get('name') as FormControl
    }
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ['position', 'name', 'archived', 'weight', 'symbol', 'action'];
    dataToDisplay = [...ELEMENT_DATA];

    constructor(
        public dialog: MatDialog,
        private componentStore: ProjectAccountingComponentStore,
        private generalService: GeneralService,
        private fb: FormBuilder,
        private changeDetection: ChangeDetectorRef
    ) {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                this.setDefaultProject();
            }
        });
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
                this.dataSource = projectList.results;
            }
        });
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
            count: 30,
            q: ''
        }
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

    public ngOnDestroy() {

    }
    /**
     *
     */
    public openCreateProjectDialog() {
        this.dialog.open(CreateProjectComponent, {
            width: 'var(--aside-pane-width)',
            height: '100vh',
            position: {
                right: '0',
                top: '0'
            }
        })
    }

}
