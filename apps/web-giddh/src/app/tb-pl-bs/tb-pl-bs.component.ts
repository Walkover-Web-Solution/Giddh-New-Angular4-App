import { distinctUntilKeyChanged, take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CompanyResponse, StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ReplaySubject } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap';
import { CurrentPage } from '../models/api-models/Common';
import { GeneralActions } from '../actions/general/general.actions';

@Component({
    selector: 'tb-pl-bs',
    templateUrl: './tb-pl-bs.component.html',
    styleUrls: ['./tb-pl-bs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsComponent implements OnInit, AfterViewInit {

    public selectedCompany: CompanyResponse;
    public CanTBLoad: boolean = true;
    public CanPLLoad: boolean = false;
    public CanBSLoad: boolean = false;
    public CanNewTBLoadOnThisEnv: boolean = false;
    public isWalkoverCompany: boolean = false;

    @ViewChild('staticTabsTBPL') public staticTabs: TabsetComponent;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private companyActions: CompanyActions, private cd: ChangeDetectorRef, private _route: ActivatedRoute, private router: Router, private _generalActions: GeneralActions) {
        this.store.pipe(select(p => p.session), distinctUntilKeyChanged('companyUniqueName')).subscribe(p => {
            let companies = p.companies;
            this.selectedCompany = companies.find(q => q.uniqueName === p.companyUniqueName);
        });
    }

    public ngOnInit() {
        this.setCurrentPageTitle('Trial Balance');

        if (TEST_ENV) {
            this.CanNewTBLoadOnThisEnv = true;
        } else {
            this.CanNewTBLoadOnThisEnv = false;
        }

        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        // Sagar: show new trial balance for Walkover company only
        this.isWalkoverCompany = (companyUniqueName === 'walkpvindore14504197149880siqli') ? true : false;
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'trial-balance-and-profit-loss';

        this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val && val.tab && val.tabIndex) {
                this.selectTab(val.tabIndex);
            }
        });

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }

    public ngAfterViewInit() {
        //
    }

    public selectTab(id: number) {
        this.staticTabs.tabs[id].active = true;
    }

    public setCurrentPageTitle(title) {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = title;
        currentPageObj.url = this.router.url;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }
}
