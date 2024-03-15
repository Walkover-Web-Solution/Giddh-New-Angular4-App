import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivateDialogComponent } from '../activate-dialog/activate-dialog.component';
import { BuyPlanComponentStore } from './utility/buy-plan.store';
import { Observable, ReplaySubject, takeUntil, of as observableOf} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from '../../services/toaster.service';

export interface PeriodicElement {
    name: string;
    premium: string;
    popular: number;
    starter: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
    selector: 'buy-plan',
    templateUrl: './buy-plan.component.html',
    styleUrls: ['./buy-plan.component.scss'],
    providers: [BuyPlanComponentStore]
})

export class BuyPlanComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') stepperIcon: any;
    /** Form Group for company form */
    public subscriptionForm: FormGroup;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Hold selected tab*/
    public selectedStep: number = 0;
    /** Form Group for company form */
    public firstStepForm: FormGroup;
    /** Form Group for company address form */
    public secondStepForm: FormGroup;
    /** Form Group for subscription company form */
    public thirdStepForm: FormGroup;
    /** True if gstin number valid */
    public isGstinValid: boolean = false;
    /** Hold selected country */
    public selectedCountry: string = '';
    /** Hold selected state */
    public selectedState: string = '';
    /** Holds account state list */
    public accountStateList$: Observable<any[]> = observableOf(null);
    public displayedColumns: any = [];
    public dataSource: any;
    /** Holds Store Plan list observable*/
    public readonly planList$ = this.componentStore.select(state => state.planList);
    /** Holds Store Plan list API succes state as observable*/
    public readonly planListInProgress$ = this.componentStore.select(state => state.planListInProgress);
    public getColumnNames(): string[] {
        return this.displayedColumns.map(column => column.uniqueName);
    }

    constructor(
        public dialog: MatDialog,
        private readonly componentStore: BuyPlanComponentStore,
        private toasterService: ToasterService,
        private formBuilder: FormBuilder
    ) {
        this.componentStore.getAllPlans({ params: { countryCode: 'IN' } });

    }

    public ngOnInit(): void {
        this.initSubscriptionForm();
        this.getAllPlans();
        /** Country details */
        this.componentStore.countryData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.accountStateList$ = observableOf(response?.stateList?.map(res => { return { label: res.name, value: res.code } }));
            }
        });
    }

    /**
 * Initializing the company form
 *
 * @private
 * @memberof
 */
    private initSubscriptionForm(): void {
        this.firstStepForm = this.formBuilder.group({
            duration: ['YEARLY'],
            planUniqueName: ['', Validators.required]
        });

        this.secondStepForm = this.formBuilder.group({
            businessType: [''],
            businessNature: [''],
            gstin: [''],
            state: [''],
            county: [''],
            taxes: null,
            pincode: [''],
            address: [''],
        });

        this.thirdStepForm = this.formBuilder.group({
            emailId: [''],
            role: ['', Validators.required],
            ownerPermission: ['']
        });

        this.subscriptionForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm,
            thirdStepForm: this.thirdStepForm
        });

        // this.firstStepForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
        //     if (this.showPageLeaveConfirmation) {
        //         this.pageLeaveUtilityService.addBrowserConfirmationDialog();
        //     }
        // });
    }

    public selectPlan(plan: any, index: number): void {
        console.log(plan, index);
        this.firstStepForm.get('planUniqueName').setValue(plan?.uniqueName);
    }

    /**
 * This will use for next step form
 *
 * @return {*}  {void}
 * @memberof AddCompanyComponent
 */
    public nextStepForm(): void {
        console.log(this.firstStepForm);
        if (this.firstStepForm.invalid) {
            this.selectedStep = 0;
            return;
        }
        this.selectedStep = 1;
    }

    /**
 * This will use for selected tab index
 *
 * @param {*} event
 * @memberof
 */
    public onSelectedTab(event: any): void {
        console.log(event);
        this.selectedStep = event?.selectedIndex;
    }

    /**
 * Get All Plan API Call
 *
 * @memberof BuyPlanComponent
 */
    public getAllPlans(): void {
        /** Get Plan List */
        this.planList$.pipe(takeUntil(this.componentStore.destroy$)).subscribe(response => {
            if (response?.length) {
                let displayedColumns = [{ uniqueName: 'content', additional: "" }];
                displayedColumns = displayedColumns.concat(response.map(column => ({ uniqueName: column.uniqueName, additional: column })));
                this.displayedColumns = displayedColumns;
                this.dataSource = new MatTableDataSource<any>(response);
            } else {
                this.displayedColumns = [{ uniqueName: 'content', label: 'Content', sticky: true }];
                this.dataSource = new MatTableDataSource<any>([]);
            }
        });
    }

    /**
 * This will use for select country
 *
 * @param {*} event
 * @memberof AddCompanyComponent
 */
    public selectCountry(event: any): void {
        if (event?.value) {
            this.selectedCountry = event.label;
            this.secondStepForm.controls['country'].setValue(event);
        }
    }

    public ngAfterViewInit(): void {
        this.stepperIcon._getIndicatorType = () => 'number';
    }

    public activateDialog(): void {
        this.dialog.open(ActivateDialogComponent, {
            width: '600px'
        })
    }


    /**
     * This will call on component destroy
     *
     * @memberof
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
