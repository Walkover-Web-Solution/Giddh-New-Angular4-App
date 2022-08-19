import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
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

    @ViewChild(ElementViewContainerRef, { static: true }) public elementViewContainerRef: ElementViewContainerRef;
    @ViewChild('permissionModel', { static: true }) public permissionModel: ModalDirective;
    @ViewChild('permissionConfirmationModel', { static: true }) public permissionConfirmationModel: ModalDirective;

    public localState: any;
    public allRoles: IRoleCommonResponseAndRequest[] = [];
    public selectedRoleForDelete: IRoleCommonResponseAndRequest;
    public session$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    // showBackButton will be used to show/hide the back button
    public showBackButton: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        public route: ActivatedRoute,
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
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                let superAdminIndx = activeCompany.userEntityRoles.findIndex((entity) => entity?.role?.uniqueName === 'super_admin');
                if (superAdminIndx === -1) {
                    this.redirectToDashboard();
                }
            } else {
                this.redirectToDashboard();
            }
        });

        this.route.data.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => this.localState = data.yourData);
        // Getting roles every time user refresh page
        this.store.dispatch(this.permissionActions.GetRoles());
        this.store.dispatch(this.permissionActions.RemoveNewlyCreatedRoleFromStore());
        this.store.pipe(select(p => p.permission.roles), takeUntil(this.destroyed$)).subscribe((roles: IRoleCommonResponseAndRequest[]) => {
            this.allRoles = roles;
            if (this.allRoles?.length > 0) {
                this.showBackButton = true;
            }
        });
    }

    /**
     * This function will check if showBackButton is true then will open the add new role modal
     *
     * @memberof PermissionListComponent
     */
    public ngAfterViewInit(): void {
        if (this.showBackButton) {
            this.openPermissionModal();
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public redirectToDashboard() {
        this._toasty.errorToast('You do not have permission to access this module');
        this._generalService.invalidMenuClicked.next({
            next: { type: 'MENU', name: 'Dashboard', uniqueName: '/pages/home' },
            previous: { type: 'MENU', name: 'Permissions', uniqueName: '/pages/permissions/list', isInvalidState: true }
        });
    }

    public closePopupEvent(userAction) {
        this.permissionModel.hide();
        if (userAction === 'save') {
            this.router.navigate(['/pages', 'permissions', 'details']);
        }
    }

    public updateRole(role: NewRoleClass) {
        let data = new NewRoleClass(role?.name, role?.scopes, role?.isFixed, role?.uniqueName, true);
        this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
        this.router.navigate(['/pages/permissions/details']);
    }

    public deleteRole(role: IRoleCommonResponseAndRequest) {
        this.selectedRoleForDelete = role;
        this.permissionConfirmationModel.show();
    }

    public deleteConfirmedRole() {
        this.permissionConfirmationModel.hide();
        this.store.dispatch(this.permissionActions.DeleteRole(this.selectedRoleForDelete?.uniqueName));
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
