import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionReportRequest } from '../../models/api-models/Subscriptions';
import { ReplaySubject, debounceTime, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyListComponentStore } from './utility/company-list.store';
import { MatTableDataSource } from '@angular/material/table';
import { PAGINATION_LIMIT } from '../../app.constant';
import { SubscriptionComponentStore } from '../utility/subscription.store';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
export interface CompanyRequest {
    page: number;
    count: number;
    query: string;
    sort: 'asc' | 'desc' | '';
    sortBy: 'NAME' | 'TOTAL_INVOICES' | 'TOTAL_INVOICES' | 'TOTAL_BILLS' | 'STATUS';
}
@Component({
    selector: 'company-list',
    templateUrl: './company-list.component.html',
    styleUrls: ['./company-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CompanyListComponentStore, SubscriptionComponentStore]
})
export class CompanyListComponent implements OnInit {
    /** Instance of company list */
    @ViewChild('companyList', { static: false }) public companyList: ElementRef;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Store Plan list API success state as observable*/
    public companyList$ = this.componentStore.select(state => state.companyList);
    /** Holds Store Plan list API success state as observable*/
    public companyListInProgress$ = this.componentStore.select(state => state.companyListInProgress);
    /** Holds Object for Get All Company API Request */
    public companyListRequest: CompanyRequest;
    /** Holds Store Plan list API success state as observable*/
    public subscribedCompanies$ = this.subscriptionComponentStore.select(state => state.subscribedCompanies);
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    public displayedColumns: string[] = ['NAME', 'TOTAL_INVOICES', 'TOTAL_BILLS', 'STATUS'];
    public dataSource: any;
    public companyListForm: UntypedFormGroup;


    constructor(@Inject(MAT_DIALOG_DATA) public inputData, private changeDetection: ChangeDetectorRef, public dialog: MatDialog, private fb: UntypedFormBuilder,
        private router: Router,
        private componentStore: CompanyListComponentStore,
        private subscriptionComponentStore: SubscriptionComponentStore,
        public dialogRef: MatDialogRef<any>) {
    }

    public ngOnInit(): void {
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        document.body?.classList?.add("subscription-sidebar");
        console.log(this.inputData);
        this.initFrom();
        this.initCompanyListRequest();
        this.getAllCompaniesList();
        this.companyList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            if (response) {
                this.dataSource = new MatTableDataSource<any>(response?.results);;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
            }
            console.log(this.dataSource);
        });

        this.companyListForm.get('name').valueChanges.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                if (searchedText !== null && searchedText !== undefined) {
                    this.companyListRequest.query = searchedText;
                    this.showClearFilter = true;
                    this.getAllCompaniesList();
                }

            });
        this.changeDetection.detectChanges();
    }

    public initFrom(): void {
        this.companyListForm = this.fb.group({
            name: [''],
            invoiceCount: [''],
            billCount: [''],
            status: ['']
        });
    }

    public clearFilter(): void {
        this.showClearFilter = false;
        this.initCompanyListRequest();
        this.companyListForm.get('name').setValue("");
        this.companyListForm.reset();
        this.getAllCompaniesList();
    }

    /**
 * Initialize get all company API request object
 *
 * @memberof CompanyListComponent
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


    public getAllCompaniesList(): void {
        let request = {
            subscriptionId: this.inputData.rowData?.subscriptionId,
            model: this.companyListForm.value,
            params: this.companyListRequest
        }
        console.log(request);
        this.componentStore.getCompanyListBySubscriptionId(request);
    }

    public createCompanyInSubscription(): void {
        this.router.navigate(['/pages/new-company/' + this.inputData.rowData?.subscriptionId]);
    }


    /**
     * Callback for sorting change
     *
     * @param {*} event
     * @memberof CompanyListComponent
     */
    public sortChange(event: any): void {
        this.companyListRequest.sortBy = event?.active;
        this.companyListRequest.sort = event?.direction;
        this.getAllCompaniesList();
    }



    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-sidebar");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
