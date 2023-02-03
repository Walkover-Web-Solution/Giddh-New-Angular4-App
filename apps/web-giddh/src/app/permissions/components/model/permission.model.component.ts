import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { INewRoleFormObj, IPage, IPageStr, NewRoleFormClass } from '../../permission.utility';
import { INameUniqueName } from '../../../models/api-models/Inventory';
import { PermissionState } from 'apps/web-giddh/src/app/store/Permission/permission.reducer';
import { IRoleCommonResponseAndRequest } from 'apps/web-giddh/src/app/models/api-models/Permission';
import { forEach, omit } from '../../../lodash-optimized';

@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html',
    styleUrls: ['./permission.model.component.scss'],
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class PermissionModelComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeEvent: EventEmitter<string> = new EventEmitter<string>();

    public allRoles: INameUniqueName[] = [];
    public newRoleObj: INewRoleFormObj = new NewRoleFormClass();
    public dropdownHeading: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private permissionActions: PermissionActions) {

    }

    get isFormValid() {
        if (this.newRoleObj?.name && this.newRoleObj?.isFresh && this.makeCount() > 0) {
            return true;
        } else if (this.newRoleObj?.name && !this.newRoleObj?.isFresh && this.newRoleObj?.uniqueName) {
            return true;
        } else {
            return false;
        }
    }

    public ngOnInit() {
        this.store.pipe(select(p => p.permission), takeUntil(this.destroyed$)).subscribe((p: PermissionState) => {
            if (p.roles && p.roles.length) {
                this.allRoles = [];
                forEach(p.roles, (role: IRoleCommonResponseAndRequest) => {
                    this.allRoles.push({ name: role?.name, uniqueName: role?.uniqueName });
                });
            }
            this.newRoleObj.pageList = [];
            if (p.pages && p.pages.length) {
                p.pages.forEach((page: IPageStr) => {
                    this.newRoleObj.pageList.push({ name: page, isSelected: false });
                });
            }
        });

        this.dropdownHeading = this.localeData?.select_pages;

        this.store.dispatch(this.permissionActions.GetAllPages());
        this.newRoleObj.isFresh = true;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public closePopupEvent() {
        this.closeEvent.emit('close');
    }

    public onDDShown() {
        this.dropdownHeading = this.localeData?.close_list;
    }

    public onDDHidden() {
        this.dropdownHeading = this.localeData?.select_pages;
    }

    /**
     * addNewRole
     */
    public addNewRole() {
        if (this.isFormValid) {
            let data;
            if (this.newRoleObj.isFresh) {
                data = omit(this.newRoleObj, 'uniqueName');
            } else {
                data = omit(this.newRoleObj, 'pageList');
            }
            this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
            this.closeEvent.emit('save');
        }
    }

    public selectAllPages(event) {
        if (event.target?.checked) {
            this.newRoleObj.isSelectedAllPages = true;
            this.newRoleObj.pageList.forEach((item: IPage) => item.isSelected = true);
        } else {
            this.newRoleObj.isSelectedAllPages = false;
            this.newRoleObj.pageList.forEach((item: IPage) => item.isSelected = false);
        }
    }

    public makeCount() {
        let count: number = 0;
        this.newRoleObj.pageList.forEach((item: IPage) => {
            if (item.isSelected) {
                count += 1;
            }
        });
        return count;
    }

    public selectPage(event) {
        if (event.target?.checked) {
            if (this.makeCount() === this.newRoleObj.pageList?.length) {
                this.newRoleObj.isSelectedAllPages = true;
            }
        } else {
            if (this.makeCount() === this.newRoleObj.pageList?.length) {
                this.newRoleObj.isSelectedAllPages = false;
            }
        }
    }
}
