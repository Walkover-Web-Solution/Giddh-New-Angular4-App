import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { HeaderItem, ImportExcelResponseData, Mappings } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-select/option.interface';
import { cloneDeep } from '../../lodash-optimized';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';

interface DataModel {
    field: HeaderItem;
    options: IOption[];
    selected: string;
}

@Component({
    selector: 'map-excel-data',
    styleUrls: ['./map-excel-data.component.scss'],
    templateUrl: './map-excel-data.component.html'
})
export class MapExcelDataComponent implements OnInit {
    public get importData(): ImportExcelResponseData {
        return this._importData;
    }

    @Input()
    public set importData(value: ImportExcelResponseData) {
        this.prepareDataModel(value);
        this._importData = cloneDeep(value);
    }

    @Input() public entity: string;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public onNext = new EventEmitter<ImportExcelResponseData>();
    @Output() public onBack = new EventEmitter();
    @Input() public dataModel: DataModel[];
    @ViewChildren(ShSelectComponent) public shSelectComponents: ShSelectComponent[];
    public imgPath: string;
    private importRequestData: ImportExcelResponseData;
    private _importData: ImportExcelResponseData;

    constructor(

    ) {

    }

    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/icon/' : AppUrl + APP_FOLDER + 'assets/icon/';
    }

    public mapExcelData() {
        this.importRequestData = {
            ...this._importData,
            data: {
                items: this._importData?.data?.items.map(p => {
                    p.row = p.row.map((pr, index) => {
                        pr.columnNumber = index?.toString();
                        return pr;
                    });
                    return p;
                }),
                numRows: 0,
                totalRows: 0
            }
        };
        this.onNext.emit(this.importRequestData);
    }

    public columnSelected(val: IOption, data: DataModel) {
        if (!val?.value) {
            return;
        }

        // filter dataModel options as per selection and for handling duplicate column case
        this.dataModel = this.dataModel.map(m => {
            if (data.field.columnNumber !== m.field.columnNumber) {
                m.options = m.options?.filter(f => f?.value !== val?.value);
            }
            return m;
        });

        // change mapping column header as per selection
        let indexFromMappings = this._importData.mappings?.findIndex(f => f.columnNumber === parseInt(data.field.columnNumber));

        if (indexFromMappings > -1) {
            this._importData.mappings[indexFromMappings].mappedColumn = val?.value;
        } else {
            let newMapping = new Mappings();
            newMapping.mappedColumn = val?.value;
            newMapping.columnNumber = parseInt(data.field.columnNumber);
            newMapping.columnHeader = data.field.columnHeader;
            this._importData.mappings.push(newMapping);
        }
    }

    public clearSelected(val: IOption, data: DataModel) {
        // re-push cleared selection to option
        this.dataModel = this.dataModel.map(m => {
            if (data.field.columnNumber !== m.field.columnNumber) {
                m.options.push(val);
            }
            return m;
        });

        // change mapping column header as per de-selection
        this._importData.mappings = this._importData.mappings?.filter(f => f.columnNumber !== parseInt(data.field.columnNumber));
    }

    private prepareDataModel(value: ImportExcelResponseData) {
        this.dataModel = value.headers.items.map((field: HeaderItem) => {
            let selectedIndex;
            let allMappedColumnHeader = value.mappings.map(m => m.mappedColumn);
            let options: IOption[] = [];

            selectedIndex = value.mappings?.findIndex(f => f.columnNumber === parseInt(field.columnNumber));
            if (selectedIndex > -1) {
                options = value.giddhHeaders?.filter(f => allMappedColumnHeader?.filter(mf => mf !== value.mappings[selectedIndex].mappedColumn)?.indexOf(f) === -1).map(p => {
                    return { label: p, value: p };
                });
            }
            return {
                field,
                options,
                selected: selectedIndex > -1 ? value.mappings[selectedIndex].mappedColumn : '',
            };
        });
    }
}
