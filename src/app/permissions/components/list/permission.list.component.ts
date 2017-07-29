import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ModalDirective, Ng2BootstrapModule } from 'ngx-bootstrap';
import { GroupWithAccountsAction } from '../../../services/actions/groupwithaccounts.actions';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/element.viewchild.directive';
import { CompanyActions } from '../../../services/actions/company.actions';
import { Router } from '@angular/router';
import { PermissionActions } from '../../../services/actions/permission/permission.action';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';

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
    private roleToDelete: string;
    private roleToDeleteName: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        public route: ActivatedRoute,
        private companyActions: CompanyActions,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private router: Router,
        private PermissionActions: PermissionActions
    ) { }

    public ngOnInit() {
        this.route.data.subscribe((data: any) => this.localState = data.yourData);
        // Getting roles every time user refresh page
        this.store.dispatch(this.PermissionActions.GetRoles());
        this.store.select(p => p.permission.roles).takeUntil(this.destroyed$).subscribe((roles: IRoleCommonResponseAndRequest[]) => this.allRoles = roles);
    }

    public ngOnDestroy() {
    //    this.store.dispatch(this.PermissionActions.RemoveNewlyCreatedRoleFromStore());
    }

    public closePopupEvent(userAction) {
        this.permissionModel.hide();
        if (userAction === 'save') {
            this.router.navigate(['/pages', 'permissions', 'details']);
        }
    }

    public updateRole(roleUniqueName) {
        this.router.navigate(['/pages', 'permissions', 'details', roleUniqueName]);
    }

    public deleteRole(roleUniqueName) {
        this.roleToDelete = roleUniqueName;
        this.roleToDeleteName = this.allRoles.find((r) => r.uniqueName === roleUniqueName).name;
        this.permissionConfirmationModel.show();
    }
    public deleteConfirmedRole() {
        this.permissionConfirmationModel.hide();
        this.store.dispatch(this.PermissionActions.DeleteRole(this.roleToDelete));
    }

    public closeConfirmationPopup() {
        this.permissionConfirmationModel.hide();
    }

    private openPermissionModal() {
        this.permissionModel.show();
    }

    private hidePermissionModel() {
        this.permissionModel.hide();
    }
}