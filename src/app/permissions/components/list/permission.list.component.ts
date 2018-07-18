import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ModalDirective } from 'ngx-bootstrap';
import { GroupWithAccountsAction } from '../../../actions/groupwithaccounts.actions';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyActions } from '../../../actions/company.actions';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { NewRoleClass } from '../../permission.utility';
import { CapitalizePipe } from './capitalize.pipe';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  templateUrl: './permission-list.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionListComponent implements OnInit, OnDestroy {

  @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
  @ViewChild('permissionModel') public permissionModel: ModalDirective;
  @ViewChild('permissionConfirmationModel') public permissionConfirmationModel: ModalDirective;

  public localState: any;
  public allRoles: IRoleCommonResponseAndRequest[] = [];
  public selectedRoleForDelete: IRoleCommonResponseAndRequest;
  public session$: Observable<any>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private store: Store<AppState>,
    public route: ActivatedRoute,
    private companyActions: CompanyActions,
    private groupWithAccountsAction: GroupWithAccountsAction,
    private router: Router,
    private permissionActions: PermissionActions,
    private _toasty: ToasterService
  ) { }

  public ngOnInit() {

    // This module should be accessible to superuser only
    this.session$ = this.store.select(s => {
      return s.session;
    }).takeUntil(this.destroyed$);

    this.session$.subscribe((session) => {
      this.store.select(state => state.company).takeUntil(this.destroyed$).subscribe((company) => {
        if (company && session.companies.length) {
          let selectedCompany = session.companies.find(cmp => {
            return cmp.uniqueName === session.companyUniqueName;
          });
          if (selectedCompany && selectedCompany.uniqueName === session.companyUniqueName) {
            let superAdminIndx = selectedCompany.userEntityRoles.findIndex((entity) => entity.role.uniqueName === 'super_admin');
            // selectedCompany.userEntityRoles[0].role.uniqueName !== 'super_admin'
            if (superAdminIndx === -1) {
              this.redirectToDashboard();
            }
          } else {
            this.redirectToDashboard();
          }
        } else {
          this.redirectToDashboard();
        }
      });
    });

    this.route.data.subscribe((data: any) => this.localState = data.yourData);
    // Getting roles every time user refresh page
    this.store.dispatch(this.permissionActions.GetRoles());
    this.store.dispatch(this.permissionActions.RemoveNewlyCreatedRoleFromStore());
    this.store.select(p => p.permission.roles).takeUntil(this.destroyed$).subscribe((roles: IRoleCommonResponseAndRequest[]) => this.allRoles = roles);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    //    this.store.dispatch(this.permissionActions.RemoveNewlyCreatedRoleFromStore());
  }

  public redirectToDashboard() {
    this._toasty.errorToast('You do not have permission to access this module');
    this.router.navigateByUrl('/home');
  }

  public closePopupEvent(userAction) {
    this.permissionModel.hide();
    if (userAction === 'save') {
      this.router.navigate(['/pages', 'permissions', 'details']);
    }
  }

  public updateRole(role: NewRoleClass) {
    let data = new NewRoleClass(role.name, role.scopes, role.isFixed, role.uniqueName, true);
    this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
    this.router.navigate(['/pages/permissions/details']);
  }

  public deleteRole(role: IRoleCommonResponseAndRequest) {
    this.selectedRoleForDelete = role;
    this.permissionConfirmationModel.show();
  }
  public deleteConfirmedRole() {
    this.permissionConfirmationModel.hide();
    this.store.dispatch(this.permissionActions.DeleteRole(this.selectedRoleForDelete.uniqueName));
  }

  public closeConfirmationPopup() {
    this.permissionConfirmationModel.hide();
  }

  public openPermissionModal() {
    this.permissionModel.show();
  }

  public hidePermissionModel() {
    this.permissionModel.hide();
  }
}
