import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { PermissionActions } from '../../../services/actions/permission/permission.action';
import { NewRoleClass, NewRoleFormClass, IPage, INewRoleFormObj } from '../../permission.utility';
import { INameUniqueName } from '../../../models/interfaces/nameUniqueName.interface';
import * as _ from 'lodash';

@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html',
    styleUrls: ['./permission.model.component.css'],
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class PermissionModelComponent implements OnInit, OnDestroy {
    @Output() public closeEvent: EventEmitter<string> = new EventEmitter<string>();

    private allRoles: INameUniqueName[] = [];
    private newRoleObj: INewRoleFormObj = new NewRoleFormClass();
    private dropdownHeading: string = 'Select pages';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private router: Router, private store: Store<AppState>, private permissionActions: PermissionActions) {
        this.store.select(p => p.permission).takeUntil(this.destroyed$).subscribe((permission) => {
            this.allRoles = [];
            permission.roles.forEach((role) => {
                this.allRoles.push({name: role.name, uniqueName: role.uniqueName});
            });
            this.newRoleObj.pageList = [];
            permission.pages.forEach((page) => {
                this.newRoleObj.pageList.push({name: page, selected: false});
            });
        });
    }

    public ngOnInit() {
        this.store.dispatch(this.permissionActions.LoadAllPageNames());
        this.newRoleObj.isFresh = true;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private closePopupEvent() {
        this.closeEvent.emit('close');
    }

    private onDDShown() {
        this.dropdownHeading = 'Close list';
    }

    private onDDHidden() {
        this.dropdownHeading = 'Select pages';
    }

    /**
     * addNewRole
    */
    private addNewRole() {
        if (this.isFormValid) {
            let data;
            if (this.newRoleObj.isFresh) {
                data = _.omit(this.newRoleObj, 'uniqueName');
            }else {
                data = _.omit(this.newRoleObj, 'pageList');
            }
            this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
            this.closeEvent.emit('save');
        }
    }

    private assignPagesForScope(){
        return [];
    }

    private selectAllPages(event) {
        if (event.target.checked) {
            this.newRoleObj.isSelectedAllPages = true;
            this.newRoleObj.pageList.forEach((item) => item.selected = true);
        } else {
            this.newRoleObj.isSelectedAllPages = false;
            this.newRoleObj.pageList.forEach((item) => item.selected = false);
        }
    }

    private makeCount() {
        let count: number = 0;
        this.newRoleObj.pageList.forEach((item) => {
            if (item.selected) {
                count += 1;
            }
        });
        return count;
    }

    private selectPage(event) {
        if (event.target.checked) {
            if (this.makeCount() === this.newRoleObj.pageList.length) {
                this.newRoleObj.isSelectedAllPages = true;
            }
        } else {
            if (this.makeCount() === this.newRoleObj.pageList.length) {
                this.newRoleObj.isSelectedAllPages = false;
            }
        }
    }

    get isFormValid() {
        if (this.newRoleObj.name && this.newRoleObj.isFresh && this.makeCount() > 0 ) {
            return true;
        } else if (this.newRoleObj.name && !this.newRoleObj.isFresh && this.newRoleObj.uniqueName) {
            return true;
        } else {
            return false;
        }
    }
}
