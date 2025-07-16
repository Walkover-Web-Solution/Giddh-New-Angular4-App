import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, Observable, ReplaySubject, take, takeUntil, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SalesPersonComponentStore } from './utility/sales-person.store';
import { KeyboardShortutModule } from '../helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';
import { ElementViewChildModule } from '../helpers/directives/elementViewChild/elementViewChild.module';
import { MatTableModule } from '@angular/material/table';
import { GeneralService } from '../../services/general.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../app.constant';
import { SalesBifurcationDetailsStore } from './utility/sales-bifurcation-details.store';
import { SalesBifurcationDetailsActionEnum } from './utility/sales-bifurcation-details.constant';
import { SalesBifurcationDetailsService } from './utility/sales-bifurcation-details.service';

@Component({
    selector: 'app-sales-person',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormFieldsModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatExpansionModule,
        MatPaginatorModule,
        KeyboardShortutModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        ElementViewChildModule
    ],
    templateUrl: './sales-person.component.html',
    styleUrls: ['./sales-person.component.scss'],
    providers: [SalesBifurcationDetailsService, SalesBifurcationDetailsStore]
})

export class SalesBifurcationDetailsComponent implements OnInit, OnDestroy {
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form submission flag */
    public isFormSubmitted: boolean = false;
    /** Create form group of Name, Email and Mobile Number */
    public salesPersonForm: FormGroup;
    /** Sales Bifurcation Details Store */
    public salesBifurcationDetailsList$: Observable<any> = this.componentStore.salesBifurcationDetailsList$;
    /** Sales Bifurcation Details Save In Progress */
    public salesBifurcationDetailsListInProgress$: Observable<boolean> = this.componentStore.salesBifurcationDetailsListInProgress$;
    /** Displayed columns for sales person table */
    public displayedColumns: string[] = [];
    /** Holds page Size Options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds advance Filters keys */
    public requestParams: any = {
        page: 1,
        count: this.pageSizeOptions[0]
    };
    /** Stores the searched name value for the Name filter */
    public searchValue: FormControl = new FormControl<string>('');

    constructor(
        @Inject(MAT_DIALOG_DATA) public salesPersonData: any,
        public dialogRef: MatDialogRef<any>,
        private componentStore: SalesBifurcationDetailsStore,
        private changeDetection: ChangeDetectorRef,
        private elementRef: ElementRef,
        private generalService: GeneralService,
        private dialog: MatDialog
    ) { }

    /**
     * Lifecycle hook runs on component initialization
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public ngOnInit(): void {


                this.searchValue?.valueChanges.pipe(
                    debounceTime(700),
                    distinctUntilChanged(),
                    takeUntil(this.destroyed$),
                ).subscribe(searchedText => {
                    if (searchedText !== null && searchedText !== undefined) {
                        // this.showClearFilter = true;
                        this.salesBifurcationDetailsAction(SalesBifurcationDetailsActionEnum.GET_ALL);
                    }
                });
     
        this.salesBifurcationDetailsAction(SalesBifurcationDetailsActionEnum.GET_ALL); }


    /**
     * Handle sales person action
     *
     * @param {SalesBifurcationDetailsActionEnum} action
     * @param {any} [element]
     * @memberof SalesBifurcationDetailsComponent
     */
    public salesBifurcationDetailsAction(action: SalesBifurcationDetailsActionEnum, element?: any): void {
        switch (action) {
            case SalesBifurcationDetailsActionEnum.GET_ALL:
                this.componentStore.getAllSalesBifurcationDetails({params: this.requestParams });
                break;
        }
    }

    /**
     * Handle page change event and make API call
     *
     * @param {*} event
     * @memberof SalesBifurcationDetailsComponent
     */
    public handlePageChange(event: any): void {
        this.requestParams.page = event.pageIndex + 1;
        this.requestParams.count = event.pageSize;
        this.salesBifurcationDetailsAction(SalesBifurcationDetailsActionEnum.GET_ALL);
    }

    /**
     * Releases memory
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
