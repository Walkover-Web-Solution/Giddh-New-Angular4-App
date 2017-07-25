import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PermissionActions } from '../../services/actions/permission/permission.action';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

export interface Permission {
    code: string;
}

export interface Scopes {
    name: string;
    permissions: Permission[];
}

export interface Role {
    name: string;
    scopes: Scopes[];
}

export interface NewRole extends Role {
    isFresh: boolean;
}

@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html',
    styleUrls: ['./permission.model.component.css'],
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class PermissionModelComponent implements OnDestroy {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);

    public allRoles: object;
    private newRole: object = {};
    private pageNames = [];
    private selectedPages = [];

    private roleType: string;
    private dropdownHeading: string = 'Select pages';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private router: Router, private store: Store<AppState>, private permissionActions: PermissionActions) {
        this.store.select(p => p.permission.roles).takeUntil(this.destroyed$).subscribe((roles) => {
            this.allRoles = roles;
            if (this.allRoles[1]) {
                this.pageNames = this.allRoles[1].scopes;
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public closePopupEvent() {
        this.closeEvent.emit(true);
    }

    public onDDShown() {
        this.dropdownHeading = 'Close list';
    }

    public onDDHidden() {
        this.dropdownHeading = 'Select pages';
    }

    public hideRoleModel() {
        this.closeEvent.emit(true);
    }

    public selectPage(pageName) {
        let indx = this.selectedPages.findIndex(function (item) {
            return item === pageName;
        });
        if (indx === -1) {
            this.selectedPages.push(pageName);
        } else {
            this.selectedPages.splice(indx, 1);
        }

        console.log("Iside selectPage the this.selectedPages is :", this.selectedPages);
    }

    // public selectPages(pageName) {
    //     let indx = this.selectedPages.findIndex(function (item) {
    //         return item == pageName;
    //     });
    //     if (indx === -1) {
    //         this.selectedPages.push(pageName);
    //     } else {
    //         this.selectedPages.splice(indx, 1);
    //     }
    // }

    /**
     * addNewRole
     */
    public addNewRole(data) {
        if (data.copyoption === 'copy_permission') {
            data.scopes = this.pageNames;
            data.pages = [];
        } else if (data.copyoption === 'select_heads') {
            data.pages = this.selectedPages;
            data.scopes = null;
        }

        this.store.take(1).subscribe(state => {
            this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
        });

        console.log('the data in addnewRole function is :', data);

        this.closeEvent.emit(data);
    }
}