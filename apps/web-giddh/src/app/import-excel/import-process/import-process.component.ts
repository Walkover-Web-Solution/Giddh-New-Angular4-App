import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImportExcelRequestData, ImportExcelResponseData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { cloneDeep } from '../../lodash-optimized';

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
        this.sheetHeaders = [];
        this.giddhHeaders = [{
            label: this.unmapHeader,
            value: this.unmapHeader
        }];
        this.rawImportData = value;

        let clonedValues: ImportExcelResponseData = cloneDeep(value);

        clonedValues?.headers?.items?.forEach(header => {
            this.sheetHeaders.push(header.columnHeader);
        });

        clonedValues?.giddhHeaders?.forEach((header, index) => {
            this.giddhHeaders.push({ label: header, value: header });
        });

        this.mappings = this.doMapping();

        clonedValues.data.items = clonedValues.data.items?.filter(item => {
            if (item.row?.length < this.sheetHeaders?.length) {
                for (let i = item.row.length; i < this.sheetHeaders.length; i++) {
                    item.row.push({ columnValue: '', columnNumber: String(i), valid: true });
                }
            }
            return item;
        });

        this._importData = clonedValues;
    }

    @Output() public onSubmit = new EventEmitter<any>();
    @Output() public onBack = new EventEmitter();
    @Input() public isLoading: boolean;
    @Input() public entity: string;
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public localeData: any = {};
    public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
    public options: IOption[];
    public sheetHeaders: string[] = [];
    /** List of giddh columns */
    public giddhHeaders: any[] = [];
    public importDisable: boolean = true;
    private _importData: ImportExcelRequestData;
    public mappings: any[] = [];
    public unmapHeader: string = "Don't Map";

    public save() {
        let mappings = this.mappings.map(mapping => {
            if (!mapping.mappedColumn || mapping.mappedColumn === this.unmapHeader) {
                mapping.mappedColumn = "";
            }
            return mapping;
        });

        const data = { requestId: this.importData.requestId, mappings: mappings, isHeaderProvided: this.importData.isHeaderProvided };
        this.onSubmit.emit(data);
    }

    /**
     * Mapping of giddh columns with sheet columns
     *
     * @private
     * @returns {*}
     * @memberof ImportProcessComponent
     */
    private doMapping(): any {
        let mappings = [];
        let mappedColumns = [];
        this.sheetHeaders?.forEach((header, index) => {
            const headerMatched = this.giddhHeaders?.filter(giddhHeader => !mappedColumns.includes(header?.trim()?.toLowerCase()) && giddhHeader?.label?.trim()?.toLowerCase() === header?.trim()?.toLowerCase());
            if (headerMatched?.length) {
                mappedColumns.push(headerMatched[0]?.label?.toLowerCase());
                mappings.push({
                    columnHeader: header,
                    columnNumber: index,
                    mappedColumn: headerMatched[0]?.label
                });
            } else {
                mappings.push({
                    columnHeader: header,
                    columnNumber: index,
                    mappedColumn: this.unmapHeader
                });
            }
        });

        return mappings;
    }
}
