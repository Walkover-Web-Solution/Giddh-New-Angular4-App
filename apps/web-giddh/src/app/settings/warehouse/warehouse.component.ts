import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { createSelector } from 'reselect';
import { Store, select } from '@ngrx/store';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppState } from '../../store/roots';
import * as _ from '../../lodash-optimized';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { BsDropdownConfig, ModalDirective } from 'ngx-bootstrap';
import { CompanyAddComponent } from '../../shared/header/components';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyResponse } from '../../models/api-models/Company';
import { CompanyActions } from '../../actions/company.actions';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';

export const IsyncData = [
    { label: 'Debtors', value: 'debtors' },
    { label: 'Creditors', value: 'creditors' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Taxes', value: 'taxes' },
    { label: 'Bank', value: 'bank' }
];

@Component({
    selector: 'setting-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class WarehouseComponent implements OnInit {
    public imgPath: string = '';
    @ViewChild('companyadd') public companyadd: ElementViewContainerRef;
    @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
    constructor(
        private store: Store<AppState>,
        private settingsBranchActions: SettingsBranchActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions
    ) { }
    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
    public openCreateCompanyModal() {
        this.loadAddCompanyComponent();
        this.addCompanyModal.show();
    }
    public hideAddCompanyModal() {
        this.addCompanyModal.hide();
    }


    public loadAddCompanyComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddComponent);
        let viewContainerRef = this.companyadd.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as CompanyAddComponent).createBranch = true;
        (componentRef.instance as CompanyAddComponent).closeCompanyModal.subscribe((a) => {
            this.hideAddCompanyModal();
        });
        (componentRef.instance as CompanyAddComponent).closeCompanyModalAndShowAddManege.subscribe((a) => {
            this.hideCompanyModalAndShowAddAndManage();
        });
    }
    public hideCompanyModalAndShowAddAndManage() {
        this.addCompanyModal.hide();
    }
    public warehouseDetails = false;
}
