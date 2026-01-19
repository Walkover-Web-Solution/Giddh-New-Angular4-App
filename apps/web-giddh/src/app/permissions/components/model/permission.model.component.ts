import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { INewRoleFormObj, IPage, IPageStr, NewRoleFormClass } from '../../permission.utility';
import { INameUniqueName } from '../../../models/api-models/Inventory';
import { PermissionState } from 'apps/web-giddh/src/app/store/permission/permission.reducer';
import { IRoleCommonResponseAndRequest } from 'apps/web-giddh/src/app/models/api-models/Permission';
import { IOption } from '../../../app.constant';
import { filter, find, forEach, omit } from '../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html',
    styleUrls: ['./permission.model.component.scss'],
    standalone: false
})

/**
 * PermissionModelComponent component
 * Handles permissionmodel functionality and user interactions
 */
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
    /** Holds Fresh options list */
    public isFreshOptions = [];
    /** Holds Selected permissions */
    public selectedValues: any;
    /** Role options for reactive-dropdown-field */
    public roleOptions: IOption[] = [];

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>, private permissionActions: PermissionActions) {
    }

    get isFormValid() {
        /**
         * Handles if functionality
         */
        if (this.newRoleObj?.name && this.newRoleObj?.isFresh && this.getSelectedPagesCount() > 0) {
            return true;
        } else if (this.newRoleObj?.name && !this.newRoleObj?.isFresh && this.newRoleObj?.uniqueName) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.localeData) {
                this.isFreshOptions = [{
                    label: this.localeData?.fresh_start,
                    value: true
                },
                {
                    label: this.localeData?.copy_other_role,
                    value: false
                }];
                this.dropdownHeading = this.localeData?.select_pages;
            }
        }, 400);
        this.store.pipe(select(p => p.permission), takeUntil(this.destroyed$)).subscribe((p: PermissionState) => {
            /**
             * Handles if functionality
             */
            if (p.roles && p.roles.length) {
                this.allRoles = [];
                this.roleOptions = [];
                /**
                 * Handles forEach functionality
                 */
                forEach(p.roles, (role: IRoleCommonResponseAndRequest) => {
                    this.allRoles.push({ name: role?.name, uniqueName: role?.uniqueName });
                    this.roleOptions.push({
                        value: role?.uniqueName,
                        label: role?.name
                    });
                });
            }
            this.newRoleObj.isSelectedAllPages = false;
            this.newRoleObj.pageList = [];
            /**
             * Handles if functionality
             */
            if (p.pages && p.pages.length) {
                (Array.isArray(p.pages) ? p.pages : []).forEach((page: IPageStr) => {
                    this.newRoleObj.pageList.push({ name: page, isSelected: false });
                });
            }
        });

        this.store.dispatch(this.permissionActions.GetAllPages());
        this.newRoleObj.isFresh = true;
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Closes popupevent
     */
    public closePopupEvent() {
        this.closeEvent.emit('close');
    }

    /**
     * Handles ddshown event
     */
    public onDDShown() {
        this.dropdownHeading = this.localeData?.close_list;
    }

    /**
     * Handles ddhidden event
     */
    public onDDHidden() {
        this.dropdownHeading = this.localeData?.select_pages;
    }

    /**
     * addNewRole
     */
    public addNewRole() {
        /**
         * Handles if functionality
         */
        if (this.isFormValid) {
            let data;
            /**
             * Handles if functionality
             */
            if (this.newRoleObj.isFresh) {
                data = omit(this.newRoleObj, 'uniqueName');
            } else {
                data = omit(this.newRoleObj, 'pageList');
            }
            this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
            this.closeEvent.emit('save');
        }
    }

    /**
     * Select all pages
     *
     * @param {*} event
     * @memberof PermissionModelComponent
     */
    public selectAllPages(event): void {
        /**
         * Handles if functionality
         */
        if (event.checked) {
            this.selectedValues = [];
            (Array.isArray(this.newRoleObj.pageList) ? this.newRoleObj.pageList : []).forEach((item: IPage) => {
                item.isSelected = true;
                this.selectedValues.push(item);
            });
            this.newRoleObj.isSelectedAllPages = true;
        } else {
            this.selectedValues = [];
            (Array.isArray(this.newRoleObj.pageList) ? this.newRoleObj.pageList : []).forEach((item: IPage) => item.isSelected = false);
            this.newRoleObj.isSelectedAllPages = false;
        }
    }

    /**
     * Count number of pages are selected
     *
     * @returns {number}
     * @memberof PermissionModelComponent
     */
    public getSelectedPagesCount(): number {
        const selectedPages = this.newRoleObj.pageList.filter((item: IPage) => item.isSelected);
        return selectedPages?.length || 0;
    }

    /**
     * Enable/ Disable Select all pages checkbox
     *
     * @memberof PermissionModelComponent
     */
    public enableDisableSelectAll(): void {
        this.newRoleObj.isSelectedAllPages = this.getSelectedPagesCount() === this.newRoleObj.pageList?.length;
    }

    /**
     * Handles role selection from reactive-dropdown-field
     *
     * @param {IOption} selectedRole - The selected role option
     * @memberof PermissionModelComponent
     */
    public onRoleSelect(selectedRole: IOption): void {
        /**
         * Handles if functionality
         */
        if (selectedRole) {
            this.newRoleObj.uniqueName = selectedRole.value;
            // Find the corresponding role and update isSelected property
            const role = this.allRoles.find(r => r.uniqueName === selectedRole.value);
            /**
             * Handles if functionality
             */
            if (role) {
                // Reset all roles selection state
                (Array.isArray(this.allRoles) ? this.allRoles : []).forEach(r => (r as any).isSelected = false);
                // Set selected role
                (role as any).isSelected = true;
                this.enableDisableSelectAll();
            }
        }
    }

    /**
     * Gets the selected role name for display
     *
     * @returns {string} The selected role name
     * @memberof PermissionModelComponent
     */
    public get selectedRoleName(): string {
        const selectedRole = this.roleOptions.find(role => role.value === this.newRoleObj.uniqueName);
        return selectedRole ? selectedRole.label : '';
    }
}
