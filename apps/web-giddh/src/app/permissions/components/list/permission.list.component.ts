import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ModalDirective } from 'ngx-bootstrap';
import { GroupWithAccountsAction } from '../../../actions/groupwithaccounts.actions';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyActions } from '../../../actions/company.actions';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { Observable, ReplaySubject } from 'rxjs';
import { NewRoleClass } from '../../permission.utility';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';

@Component({
    templateUrl: './permission-list.html',
    styleUrls: ['./permission.component.scss']
})
export class PermissionListComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
    @ViewChild('permissionModel') public permissionModel: ModalDirective;
    @ViewChild('permissionConfirmationModel') public permissionConfirmationModel: ModalDirective;

    public localState: any;
    public allRoles: IRoleCommonResponseAndRequest[] = [];
    public selectedRoleForDelete: IRoleCommonResponseAndRequest;
    public session$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    // showBackButton will be used to show/hide the back button
    public showBackButton: boolean = false;

    constructor(
        private store: Store<AppState>,
        public route: ActivatedRoute,
        private companyActions: CompanyActions,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private router: Router,
        private permissionActions: PermissionActions,
        private _toasty: ToasterService,
        private _generalService: GeneralService
    ) {
    }

    public ngOnInit() {

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            if (params && params["tab"] && params["tab"] === "settings") {
                this.showBackButton = true;
                this.router.navigate(['pages/permissions/list'], { replaceUrl: true });
            }
        });

        // This module should be accessible to superuser only
        this.session$ = this.store.select(s => {
            return s.session;
        }).pipe(takeUntil(this.destroyed$));

        this.session$.subscribe((session) => {
            this.store.select(state => state.company).pipe(takeUntil(this.destroyed$)).subscribe((company) => {
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
        this.store.select(p => p.permission.roles).pipe(takeUntil(this.destroyed$)).subscribe((roles: IRoleCommonResponseAndRequest[]) => this.allRoles = roles);
    }

    /**
     * This function will check if showBackButton is true then will open the add new role modal
     *
     * @memberof PermissionListComponent
     */
    public ngAfterViewInit(): void {
        if(this.showBackButton) {
            this.openPermissionModal();
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        //    this.store.dispatch(this.permissionActions.RemoveNewlyCreatedRoleFromStore());
    }

    public redirectToDashboard() {
        this._toasty.errorToast('You do not have permission to access this module');
        this._generalService.invalidMenuClicked.next({
            next: { type: 'MENU', name: 'Dashboard', uniqueName: '/pages/home' },
            previous: { type: 'MENU', name: 'Permissions', uniqueName: '/pages/permissions/list', isInvalidState: true }
        });
        // this.router.navigateByUrl('/home');
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
