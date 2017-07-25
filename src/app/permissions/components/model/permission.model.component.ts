import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { PermissionActions } from '../../../services/actions/permission/permission.action';

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

export interface NewRole {
    name: string;
    selectedPages: Scopes[];
    isFresh: boolean;
}

export interface Page {
    name: string;
    selected: boolean;
}

@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html',
    styleUrls: ['./permission.model.component.css'],
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class PermissionModelComponent implements OnInit, OnDestroy {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);

    public allRoles: object;
    private newRole: NewRole = { name: '', selectedPages:[], isFresh: false };
    private pageNames: Page[] = [];
    private selectedPages = [];

    private roleType: string = '';
    private dropdownHeading: string = 'Select pages';
    private isSelectedAllPages: boolean;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private router: Router, private store: Store<AppState>, private permissionActions: PermissionActions) {
        this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((permission) => {
            this.allRoles = permission.roles;
            if (!this.pageNames.length) {
                permission.pages.forEach((page) => this.pageNames.push({ name: String(page), selected: false }) );
            }
        });
    }

    public ngOnInit() {
        this.store.dispatch(this.permissionActions.LoadAllPageNames());
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

    public selectPage(pageName, event) {
        let isChecked = event.target.checked;
        let pageIndx = this.pageNames.findIndex((obj) => obj.name === pageName);
        if (!isChecked && this.isSelectedAllPages) {
            this.isSelectedAllPages = false;
            this.selectedPages.splice(this.selectedPages.indexOf(pageName), 1);
            this.pageNames[pageIndx].selected = false;
        }else if (!this.isSelectedAllPages && isChecked) {
            this.selectedPages.push(pageName);
            this.pageNames[pageIndx].selected = true;
            if (this.pageNames.length === this.selectedPages.length) {
                this.isSelectedAllPages = true;
            }
        }else if (!isChecked && !this.isSelectedAllPages) {
            this.pageNames[pageIndx].selected = false;
            this.selectedPages.splice(this.selectedPages.indexOf(pageName), 1);
        }
        console.log('Iside selectPage the this.selectedPages is :', this.selectedPages);
    }

    /**
     * addNewRole
     */
    public addNewRole(data) {
        if (!this.isFormNotValid()) {
            if (this.roleType === 'fresh') {
                data.selectedPages = this.selectedPages;
                data.isFresh = true;
            } else if (this.roleType === 'copy') {
                // data.pages = this.selectedPages;
                // data.isFresh = false;
            }

            this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));

            console.log('the data in addnewRole function is :', data);

            this.closeEvent.emit(data);
        }
    }

    public selectAllPages(event) {
        let isChecked = event.target.checked;
        if (isChecked) {
            this.isSelectedAllPages = true;
            this.pageNames.forEach((obj) => {
                obj.selected = true;
                this.selectedPages.push(obj.name);
            });
        } else {
            this.isSelectedAllPages = false;
            this.selectedPages = [];
            this.pageNames.forEach((obj) => obj.selected = false );
        }
        console.log('Inside selectAllPages the this.selectedPages is :', this.selectedPages);
    }

    public isFormNotValid() {
        if (this.newRole.name && (this.roleType === 'fresh' && this.selectedPages.length)) {
            return false;
        }
        return true;
    }

}