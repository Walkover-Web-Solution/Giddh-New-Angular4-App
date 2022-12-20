import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImportExcelRequestData, ImportExcelResponseData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { cloneDeep, sortBy } from '../../lodash-optimized';

@Component({
    selector: 'import-process',
    styleUrls: ['./import-process.component.scss'],
    templateUrl: './import-process.component.html'
})
export class ImportProcessComponent {
    public rawImportData: ImportExcelResponseData;

    public get importData(): ImportExcelResponseData {
        return this._importData;
    }

    @Input()
    public set importData(value: ImportExcelResponseData) {
        this.userHeader = [];
        this.rawImportData = value;

        let clonedValues: ImportExcelResponseData = cloneDeep(value);

        // prepare table header from mappings.mappedColumn and first sortBy columnNumber
        sortBy(clonedValues.mappings, ['columnNumber']).forEach(f => this.userHeader.push(f.mappedColumn));

        clonedValues.data.items = clonedValues.data.items?.filter(item => {
            item.row = item.row?.filter(ro => clonedValues.mappings.some(s => s.columnNumber === parseInt(ro.columnNumber)));

            if(item.row?.length < this.userHeader?.length) {
                for(let i = item.row.length; i < this.userHeader.length; i++) {
                    item.row.push({columnValue: '', columnNumber: String(i), valid: true});
                }
            }

            return item;
        });
        this._importData = clonedValues;
    }

    @Output() public onSubmit = new EventEmitter<ImportExcelResponseData>();
    @Output() public onBack = new EventEmitter();
    @Input() public isLoading: boolean;
    @Input() public entity: string;
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
    public options: IOption[];
    public userHeader: string[] = [];
    public importDisable: boolean = true;
    private _importData: ImportExcelRequestData;

    public save() {
        const data = { ...this.importData.data, items: this.importData.data.items };
        this.onSubmit.emit({ ...this.importData, data });
    }
}
