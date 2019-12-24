import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { FormBuilder } from '@angular/forms';
import { ToasterService } from '../../../../services/toaster.service';
import { SettingsBunchService } from '../../../../services/settings.bunch.service';
import { ReplaySubject } from 'rxjs';
import { BsDropdownDirective } from 'ngx-bootstrap';

@Component({
    selector: 'add-bunch-company',
    templateUrl: './bunch-add-company.component.html',
    styleUrls: ['./bunch-add-company.component.css']
})

export class BunchAddCompanyModalComponent implements OnChanges, OnDestroy {

    @Input() public activeBunch: any = {};
    @Input() public companiesList: any[] = [];

    @Output() public closeModalEvent: EventEmitter<boolean> = new EventEmitter(false);
    @Output() public saveDataEvent: EventEmitter<any> = new EventEmitter(null);

    @ViewChild('companyListDropdown') public companyListDropdown: BsDropdownDirective;

    public isAllCompanySelected: boolean = false;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _fb: FormBuilder,
        private _toaster: ToasterService,
        private _settingsBunchService: SettingsBunchService,
    ) {

    }

    public selectAllPages(event) {
        if (event.target.checked) {
            this.isAllCompanySelected = true;
            this.companiesList.forEach((item) => item.isSelected = true);
        } else {
            this.isAllCompanySelected = false;
            this.companiesList.forEach((item) => item.isSelected = false);
        }
    }

    /**
     * save
     */
    public save() {
        let dataToSend = [];
        _.forEach(this.companiesList, function (obj) {
            if (obj.isSelected) {
                dataToSend.push(obj.uniqueName);
            }
        });
        this.saveDataEvent.emit(_.cloneDeep(dataToSend));
    }

    public onCancel() {
        this.closeModalEvent.emit(true);
    }

    /**
     * hideDropdown
     */
    public hideListItems() {
        this.companyListDropdown.hide();
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s) {
        //
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
