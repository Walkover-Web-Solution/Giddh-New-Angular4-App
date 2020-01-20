import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { FormBuilder } from '@angular/forms';
import { ToasterService } from '../../../../services/toaster.service';
import { SettingsBunchService } from '../../../../services/settings.bunch.service';

@Component({
    selector: 'get-companies',
    templateUrl: './get-companies.component.html',
    styleUrls: ['./get-companies.component.css']
})

export class GetBunchModalComponent implements OnChanges {

    @Input() public activeBunch: any = {};
    @Input() public selectedBunch: any = {};

    @Output() public closeModalEvent: EventEmitter<boolean> = new EventEmitter(false);
    @Output() public deleteCompanyEvent: EventEmitter<any> = new EventEmitter(null);
    @Output() public saveDataEvent: EventEmitter<any> = new EventEmitter(null);

    constructor(private _fb: FormBuilder,
        private _toaster: ToasterService,
        private _settingsBunchService: SettingsBunchService,
    ) {

    }

    /**
     * deleteCompany
     */
    public deleteCompany(companyUniqueName) {
        this.deleteCompanyEvent.emit([companyUniqueName]);
    }

    /**
     * create
     */
    public createBunch() {
        let dataToSend = [];
        this.saveDataEvent.emit(dataToSend);
        // this._settingsBunchService.CreateBunch(dataToSend);
    }

    public onCancel() {
        this.closeModalEvent.emit(true);
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s) {
        //
    }
}
