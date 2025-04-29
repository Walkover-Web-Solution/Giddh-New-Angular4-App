import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, debounceTime, take, takeUntil } from 'rxjs';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PAGINATION_LIMIT } from '../../app.constant';
import { MatMenuTrigger } from '@angular/material/menu';
import { SubscriptionComponentStore } from '../utility/subscription.store';
import { CompanyListDialogComponentStore } from './utility/company-list-dialog.store';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { ToasterService } from '../../services/toaster.service';

export interface CompanyRequest {
    page: number;
    count: number;
    query: string;
    sort: 'asc' | 'desc' | '';
    sortBy: 'NAME' | 'TOTAL_INVOICES' | 'TOTAL_INVOICES' | 'TOTAL_BILLS' | 'STATUS';
}

@Component({
    selector: 'company-list-dialog',
    templateUrl: './company-list-dialog.component.html',
    styleUrls: ['./company-list-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CompanyListDialogComponentStore, SubscriptionComponentStore]
})
export class CompanyListDialogComponent implements OnInit {
    /** Instance of company list */
    @ViewChild('companyList', { static: false }) public companyList: ElementRef;
    /** Mat menu instance reference */
    @ViewChild(MatMenuTrigger) menu: MatMenuTrigger;
    /** This will use for move company in to another company  */
    @ViewChild("moveCompany", { static: false }) public moveCompany: any;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Store Company list API success state as observable*/
    public companyList$ = this.componentStore.select(state => state.companyList);
    /** Holds Store Company list API success state as observable*/
    public companyListInProgress$ = this.componentStore.select(state => state.companyListInProgress);
    /** Holds Store Archive company API success state as observable*/
    public archiveCompanySuccess$ = this.componentStore.select(state => state.archiveCompanySuccess);
    /** Holds Object for Get All Company API Request */
    public companyListRequest: CompanyRequest;
    /** Holds Store Subscribe companies API success state as observable*/
    public subscribedCompanies$ = this.subscriptionComponentStore.select(state => state.subscribedCompanies);
    /** True, if  custom searching  is performed */
    public showClearFilter: boolean = false;
    /** Hold displayed columns */
    public displayedColumns: string[] = ['NAME', 'TOTAL_INVOICES', 'TOTAL_BILLS', 'STATUS'];
    /** Hold table data source */
    public dataSource: any;
    /** Instance for company list form */
    public companyListForm: UntypedFormGroup;
    /* This will hold the companies to use in selected company */
    public selectedCompany: any;
    /** True if subscription will move */
    public subscriptionMove: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private changeDetection: ChangeDetectorRef,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private router: Router,
        private toasterService: ToasterService,
        private componentStore: CompanyListDialogComponentStore,
        private subscriptionComponentStore: SubscriptionComponentStore,
        public dialogRef: MatDialogRef<any>
    ) {
    }

    /**
     * Hook cycle for component initialization.
     *
     * @memberof CompanyListDialogComponent
     */
    public ngOnInit(): void {
        this.localeData = this.inputData?.localeData;
        this.commonLocaleData = this.inputData?.commonLocaleData;
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        document.body?.classList?.add("subscription-sidebar");
        this.initForm();
        this.initCompanyListRequest();
        this.getAllCompaniesList();

        this.companyList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dataSource = new MatTableDataSource<any>(response?.results);
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
            }
        });

        this.archiveCompanySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let text = this.localeData?.company_message;
                text = text?.replace("[TYPE]", response?.archiveStatus === 'USER_ARCHIVED' ? this.commonLocaleData?.app_unarchive : this.commonLocaleData?.app_archive);
                this.toasterService.showSnackBar('success', text);
                this.getAllCompaniesList();
            }
        });

        this.companyListForm.get('name').valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                if (searchedText !== null && searchedText !== undefined) {
                    this.companyListRequest.query = searchedText;
                    this.showClearFilter = true;
                    this.getAllCompaniesList();
                }
                if (searchedText === null || searchedText === "") {
                    this.showClearFilter = false;
                }
            });

        this.componentStore.isUpdateCompanySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getAllCompaniesList();
            }
        });

        this.changeDetection.detectChanges();
    }

    /**
     * This will be use for form intialization
     *
     * @memberof CompanyListDialogComponent
     */
    public initForm(): void {
        this.companyListForm = this.fb.group({
            name: [''],
            invoiceCount: [''],
            billCount: [''],
            status: ['']
        });
    }

    /**
     * Clears the filter and resets the form in the CompanyListDialogComponent.
     *
     * @memberof CompanyListDialogComponent
     */
    public clearFilter(): void {
        this.showClearFilter = false;
        this.initCompanyListRequest();
        this.companyListForm.get('name').setValue("");
        this.companyListForm.reset();
    }


    /**
     * Initialize get all company API request object
     *
     * @memberof CompanyListDialogComponent
     */
    private initCompanyListRequest(): void {
        this.companyListRequest = {
            page: 1,
            count: this.companyListRequest?.count ?? PAGINATION_LIMIT,
            query: '',
            sort: 'asc',
            sortBy: 'NAME'
        };
    }

    /**
     * Retrieves the list of all companies in the CompanyListDialogComponent.
     *
     * @memberof CompanyListDialogComponent
     */
    public getAllCompaniesList(): void {
        let request = {
            subscriptionId: this.inputData.rowData?.subscriptionId,
            model: this.companyListForm.value,
            params: this.companyListRequest
        };
        this.componentStore.getCompanyListBySubscriptionId(request);
    }

    /**
     * Navigates to the page for creating a new company within the subscription in the CompanyListDialogComponent.
     *
     * @memberof CompanyListDialogComponent
     */
    public createCompanyInSubscription(): void {
        this.router.navigate(['/pages/new-company/' + this.inputData.rowData?.subscriptionId]);
    }

    /**
     * Callback for sorting change
     *
     * @param {*} event
     * @memberof CompanyListDialogComponent
     */
    public sortChange(event: any): void {
        this.companyListRequest.sortBy = event?.active;
        this.companyListRequest.sort = event?.direction;
        this.getAllCompaniesList();
    }

    /**
      *This function will open the move company popup
      *
      * @param {*} company
      * @memberof CompanyListDialogComponent
      */
    public openModalMove(company: any, event: any): void {
        this.menu.closeMenu();
        this.selectedCompany = company;
        this.subscriptionMove = true;
        this.dialog.open(this.moveCompany, {
            width: 'var(--aside-pane-width)',
            role: 'alertdialog',
            ariaLabel: 'moveDialog'
        });
    }

    /**
     * Archives or unarchives a company in the CompanyListDialogComponent.
     *
     * @param data - The data of the company to be archived or unarchived.
     * @param type - The type of action, whether to archive or unarchive.
     * @memberof CompanyListDialogComponent
     */
    public archiveCompany(data: any, type: string): void {
        let request = {
            companyUniqueName: data.uniqueName,
            status: { archiveStatus: type }
        };
        this.openConfirmationDialog(request);
    }

    /**
     * Open confirmation dialog for archive company
     *
     * @private
     * @param {*} request
     * @memberof CompanyListDialogComponent
     */
    private openConfirmationDialog(request: any): void {
        let text = this.localeData?.confirm_archive_message;
        text = text?.replace("[TYPE]", request.status.archiveStatus === 'UNARCHIVED' ? this.commonLocaleData?.app_unarchive : this.commonLocaleData?.app_archive);
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '540px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: text,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.componentStore.archiveCompany(request);
            }
        });
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Removes "subscription-sidebar" class from body, and completes the subject indicating component destruction.
     *
     * @memberof CompanyListDialogComponent
     */
    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-sidebar");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
