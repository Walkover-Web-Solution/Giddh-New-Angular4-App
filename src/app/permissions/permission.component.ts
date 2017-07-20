import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ModalDirective } from 'ngx-bootstrap';
import { GroupWithAccountsAction } from '../services/actions/groupwithaccounts.actions';
import { ElementViewContainerRef } from '../shared/helpers/directives/element.viewchild.directive';
import { CompanyActions } from '../services/actions/company.actions';
import { Router } from '@angular/router';
import { PermissionActions } from '../services/actions/permission/permission.action';
import { PermissionResponse } from '../models/api-models/Permission';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
    selector: 'permissions',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit, AfterViewInit {

    @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
    @ViewChild('permissionModel') public permissionModel: ModalDirective;
    @ViewChild('permissionConfirmationModel') public permissionConfirmationModel: ModalDirective;

    public localState: any;
    public allRoles: PermissionResponse[];
    private createRoleStep: string = 'one';
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
        this.route
            .data
            .subscribe((data: any) => {
                this.localState = data.yourData;
            });

        this.store.take(1).subscribe(state => {
            if (!state.permission.roles.length) {
                this.store.dispatch(this.PermissionActions.GetRoles());
            }
        });
    }

    public ngAfterViewInit() {
        this.store.select(p => p.permission.roles).takeUntil(this.destroyed$).subscribe((roles) => {
            this.allRoles = roles;
        });
    }

    public closePopupEvent(data) {
        console.log('The data in closePopupEvent function is :', data);
        this.permissionModel.hide();
        this.createRoleStep = 'two';
        this.router.navigate(['/pages', 'permissions', 'add-new']);
    }

    public deleteRole(roleUniqueName) {
        this.roleToDelete = roleUniqueName;
        console.log('It is returning is :', this.allRoles.find((r) => r.uniqueName === roleUniqueName));
        this.roleToDeleteName = this.allRoles.find((r) => r.uniqueName === roleUniqueName).name;
        this.permissionConfirmationModel.show();
    }
    public deleteConfirmedRole() {
        this.permissionConfirmationModel.hide();
        this.store.dispatch(this.PermissionActions.DeleteRole({ roleUniqueName: this.roleToDelete }));
        // this.store.select(p => p.permission.roles).takeUntil(this.destroyed$).subscribe((roles) => {
        //     this.allRoles = roles;
        //     console.log('Role refreshed...');
        // });
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