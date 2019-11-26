import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from '../shared/helpers/window.object';
import { ModalDirective, TabsetComponent } from 'ngx-bootstrap';
import { GeneralService } from '../services/general.service';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { ReplaySubject } from 'rxjs';
import { GeneralActions } from '../actions/general/general.actions';

@Component({
  selector: 'onboarding-component',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']

})

export class OnboardingComponent implements OnInit, AfterViewInit {
  @ViewChild('talkSalesModal') public talkSalesModal: ModalDirective;
  @ViewChild('supportTab') public supportTab: TabsetComponent;
  public sideMenu: { isopen: boolean } = {isopen: true};
  public loadAPI: Promise<any>;
  public CompanySettingsObj: any = {};
  // public selectedPlans: CreateCompanyUsersPlan;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public imgPath: string = '';

  constructor(
    private _router: Router, private _window: WindowRef, private _generalService: GeneralService,
    private store: Store<AppState>,
    private settingsProfileActions: SettingsProfileActions,
    private companyActions: CompanyActions,
    private generalActions: GeneralActions
  ) {
    this._window.nativeWindow.superformIds = ['Jkvq'];
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

    // this.store.pipe(select(s => s.session.userSelectedSubscriptionPlan), takeUntil(this.destroyed$)).subscribe(res => {
    //   this.selectedPlans = res;
    // });
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'pages/onboarding';
    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

    //
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });

    this.initInventorySettingObj();
  }

  public ngAfterViewInit() {
    this._generalService.IAmLoaded.next(true);
  }

  public goTo(path: string) {
    this._router.navigate(['/pages', 'settings', 'linked-accounts'], {queryParams: {tab: 'linked-accounts', tabIndex: 2}});
  }

  public scheduleNow() {
    let newwindow = window.open('https://app.intercom.io/a/meeting-scheduler/calendar/VEd2SmtLSyt2YisyTUpEYXBCRWg1YXkwQktZWmFwckF6TEtwM3J5Qm00R2dCcE5IWVZyS0JjSXF2L05BZVVWYS0tck81a21EMVZ5Z01SQWFIaG00RlozUT09--c6f3880a4ca63a84887d346889b11b56a82dd98f', 'scheduleWindow', 'height=650,width=1199,left=200,top=100`');
    if (window.focus) {
      newwindow.focus();
    }
    return false;
  }

  public openScheduleModal() {
    this._generalService.invokeEvent.next("openschedulemodal");
  }

  public loadScript() {
    let isFound = false;
    let scripts = document.getElementsByTagName('script');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes('loader')) {
        isFound = true;
      }
    }

    if (!isFound) {
      let dynamicScripts = ['https://random-scripts.herokuapp.com/superform/superform.js'];

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }

    }
  }

  public sidebarStatusChange(event) {
    this.sideMenu.isopen = event;
    this.store.dispatch(this.generalActions.setSideMenuBarState(event));
  }

  public closeModal() {
    this.talkSalesModal.hide();
  }

  // public downloadPlugin() {
  //   window.location = 'https://s3.ap-south-1.amazonaws.com/giddhbuildartifacts/Walkover+Prod.tcp';
  // }

  public initInventorySettingObj() {

    this.store.dispatch(this.settingsProfileActions.GetInventoryInfo());

    this.store.select(p => p.settings.inventory).pipe().subscribe((o) => {
      if (o.profileRequest || 1 === 1) {
        let inventorySetting = _.cloneDeep(o);
        this.CompanySettingsObj = inventorySetting;
      }
    });
  }

  public updateInventorySetting(data) {
    let dataToSaveNew = _.cloneDeep(this.CompanySettingsObj);
    dataToSaveNew.companyInventorySettings = {manageInventory: data};

    this.store.dispatch(this.settingsProfileActions.UpdateInventory(dataToSaveNew));
  }
}
