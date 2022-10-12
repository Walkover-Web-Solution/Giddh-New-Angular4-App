import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { SearchDataSet } from '../../../models/api-models/Search';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { digitsOnly } from '../../../shared/helpers/customValidationHelper';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

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
    public queryTypes = [];
    public queryDiffers = [];
    public balType = [];
    public searchQueryForm: FormGroup;
    public searchDataSet: FormArray;
    public toggleFilters: boolean = false;

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
            { name: this.localeData?.query_types.closing_balance, uniqueName: 'closingBalance' },
            { name: this.localeData?.query_types.opening_balance, uniqueName: 'openingBalance' },
            { name: this.localeData?.query_types.cr_total, uniqueName: 'creditTotal' },
            { name: this.localeData?.query_types.dr_total, uniqueName: 'debitTotal' }
        ];

        this.queryDiffers = [
            this.localeData?.query_differs.less,
            this.localeData?.query_differs.greater,
            this.localeData?.query_differs.equals
        ];

        this.balType = [
            { name: this.localeData?.balance_type.cr, uniqueName: 'CREDIT' },
            { name: this.localeData?.balance_type.dr, uniqueName: 'DEBIT' }
        ];
    }

    public filterData() {
        this.isFiltered.emit(true);
        this.searchQuery.emit(this.searchQueryForm.value.searchQuery);
    }

    public createCSV() {
        this.createCsv.emit(this.searchQueryForm.value.searchQuery);
    }

    public addSearchRow() {
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
        this.isFiltered.emit(false);
    }

    public removeSearchRow() {
        let arr = this.searchQueryForm.controls['searchQuery'] as FormArray;
        arr.removeAt(-1);
    }

}
