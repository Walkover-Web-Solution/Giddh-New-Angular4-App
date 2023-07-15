import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { SearchDataSet } from '../../../models/api-models/Search';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { digitsOnly } from '../../../shared/helpers/customValidationHelper';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
    selector: 'search-filter',
    templateUrl: './search-filter.component.html',
    styleUrls: ['./search-filter.component.scss']
})

export class SearchFilterComponent implements OnInit {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** True, if send button needs to be displayed */
    @Input() public showSendButton: boolean = true;
    /** True, if download CSV button needs to be displayed */
    @Input() public showDownloadCsv: boolean = true;

    @Output() public searchQuery = new EventEmitter<SearchDataSet[]>();
    @Output() public isFiltered = new EventEmitter<boolean>();
    @Output() public createCsv = new EventEmitter();
    @Output() public openEmailDialog = new EventEmitter();
    @Output() public openSmsDialog = new EventEmitter();
    @ViewChild('filterDropdown', { static: true }) public filterDropdown: BsDropdownDirective;
    @ViewChild('filterMenu', { static: false, read: MatAutocompleteTrigger }) filterMenu: MatAutocompleteTrigger;
    public queryTypes = [];
    public queryDiffers = [];
    public balType = [];
    public searchQueryForm: FormGroup;
    public searchDataSet: FormArray;
    public toggleFilters: boolean = false;
    public resetValues: boolean = false;

    /**
     * TypeScript public modifiers
     */
    constructor(private fb: FormBuilder) {
        this.searchQueryForm = this.fb.group({
            searchQuery: this.fb.array([this.fb.group({
                queryType: ['', Validators.required],
                openingBalanceType: ['DEBIT', Validators.required],
                closingBalanceType: ['DEBIT', Validators.required],
                queryDiffer: ['', Validators.required],
                amount: ['', [Validators.required, digitsOnly]],
            })])
        });
        this.searchDataSet = this.searchQueryForm.controls['searchQuery'] as FormArray;
    }

    public ngOnInit() {
        this.queryTypes = [
            { label: this.localeData?.query_types.closing_balance, value: 'closingBalance' },
            { label: this.localeData?.query_types.opening_balance, value: 'openingBalance' },
            { label: this.localeData?.query_types.cr_total, value: 'creditTotal' },
            { label: this.localeData?.query_types.dr_total, value: 'debitTotal' }
        ];

        this.queryDiffers = [
            { label: this.localeData?.query_differs.less, value: this.localeData?.query_differs.less},
            { label: this.localeData?.query_differs.greater, value: this.localeData?.query_differs.greater },
            { label: this.localeData?.query_differs.equals, value: this.localeData?.query_differs.equals }
        ];

        this.balType = [
            { label: this.localeData?.balance_type.cr, value: 'CREDIT' },
            { label: this.localeData?.balance_type.dr, value: 'DEBIT' }
        ];
    }

    public filterData() {
        if (this.searchQueryForm.invalid) {
            return;
        }
        this.isFiltered.emit(true);
        this.searchQuery.emit(this.searchQueryForm?.value.searchQuery);
    }

    public createCSV() {
        this.createCsv.emit(this.searchQueryForm?.value.searchQuery);
    }

    public addSearchRow() {
        if (this.searchDataSet?.controls?.length > 3 || this.searchQueryForm.invalid) {
            return;
        }
        this.searchDataSet.push(this.fb.group({
            queryType: ['closingBalance', Validators.required],
            openingBalanceType: ['DEBIT', Validators.required],
            closingBalanceType: ['DEBIT', Validators.required],
            queryDiffer: ['Greater', Validators.required],
            amount: ['1', Validators.required],
        }));
    }

    public resetQuery() {
        this.searchDataSet.controls = [];
        this.addSearchRow();
        this.resetValues = true;
        this.isFiltered.emit(false);
    }

    public removeSearchRow() {
        let arr = this.searchQueryForm.controls['searchQuery'] as FormArray;
        arr.removeAt(-1);
    }

}
