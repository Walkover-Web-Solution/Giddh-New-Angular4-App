import { Component, Inject, OnDestroy, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { PermissionActions } from '../../../../actions/permission/permission.action';
import { SettingsProfileActions } from '../../../../actions/settings/profile/settings.profile.action';
import { ShareRequestForm } from '../../../../models/api-models/Permission';
import { SettingsPermissionService } from '../../../../services/settings.permission.service';
import { GeneralService } from '../../../../services/general.service';
import { AppState } from '../../../../store/roots';
import { NewConfirmationModalComponent } from '../../../../theme/new-confirmation-modal/confirmation-modal.component';

/** Dialog input for sharing branch or warehouse permissions */
export interface ShareEntityModalData {
    entity: 'branch' | 'warehouse';
    entityUniqueName: string;
    entityName?: string;
    commonLocaleData?: any;
}

@Component({
    selector: 'share-entity-modal',
    templateUrl: './share-entity-modal.component.html',
    styleUrls: ['./share-entity-modal.component.scss'],
    standalone: false
})
export class ShareEntityModalComponent implements OnInit, OnDestroy {
    /** Edit user permission dialog template */
    @ViewChild('editUserModal', { static: true }) public editUserModal: TemplateRef<any>;
    /** Users already shared with this entity */
    public sharedWith = signal<ShareRequestForm[]>([]);
    /** True after shared-with API response is received */
    public isSharedWithLoaded = signal<boolean>(false);
    /** Selected user for edit */
    public selectedUser: ShareRequestForm;
    /** Edit dialog reference */
    public editDialogRef: MatDialogRef<any>;
    /** Permission locale loaded in dialog */
    public localeData: any = {};
    /** Common locale data from parent */
    public commonLocaleData: any = {};
    private readonly destroyed$ = new ReplaySubject<boolean>(1);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ShareEntityModalData,
        private dialogRef: MatDialogRef<ShareEntityModalComponent>,
        private dialog: MatDialog,
        private store: Store<AppState>,
        private accountActions: AccountsAction,
        private permissionActions: PermissionActions,
        private settingsProfileActions: SettingsProfileActions,
        private settingsPermissionService: SettingsPermissionService,
        private generalService: GeneralService,
        private actions$: Actions
    ) {
        this.commonLocaleData = data?.commonLocaleData ?? {};
    }

    public ngOnInit(): void {
        this.store.dispatch(this.permissionActions.GetRoles());
        this.loadSharedWith();

        this.store.pipe(
            select(permissionStore => permissionStore.permission.createPermissionSuccess),
            takeUntil(this.destroyed$)
        ).subscribe((permissionSuccess) => {
            if (permissionSuccess) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                this.loadSharedWith();
            }
        });

        this.actions$.pipe(
            ofType(AccountsAction.UN_SHARE_ENTITY_RESPONSE, AccountsAction.UPDATE_ENTITY_PERMISSION_RESPONSE),
            takeUntil(this.destroyed$)
        ).subscribe(() => {
            this.loadSharedWith();
        });
    }

    /**
     * Dialog title based on entity type and name
     *
     * @readonly
     * @type {string}
     * @memberof ShareEntityModalComponent
     */
    public get dialogTitle(): string {
        const entityName = this.data.entityName || '';
        if (this.data.entity === 'warehouse') {
            return (this.localeData?.share_warehouse || 'Share [NAME]')?.replace('[NAME]', entityName);
        }
        return (this.localeData?.share_branch || 'Share [NAME] Branch')?.replace('[NAME]', entityName);
    }

    /**
     * Handles create/update submit from permission form
     *
     * @param {{ action: string; data: ShareRequestForm }} [event]
     * @memberof ShareEntityModalComponent
     */
    public onSubmitForm(event?: { action: string; data: ShareRequestForm }): void {
        if (event?.action === 'update') {
            this.closeEditUserModal();
        }
        this.loadSharedWith();
    }

    /**
     * Opens edit permission dialog for a shared user
     *
     * @param {ShareRequestForm} user
     * @memberof ShareEntityModalComponent
     */
    public showModalForEdit(user: ShareRequestForm): void {
        this.selectedUser = user;
        this.editDialogRef = this.dialog.open(this.editUserModal, {
            width: '1200px'
        });
    }

    /**
     * Closes edit permission dialog
     *
     * @memberof ShareEntityModalComponent
     */
    public closeEditUserModal(): void {
        this.editDialogRef?.close();
        this.selectedUser = null;
    }

    /**
     * Confirms and revokes a shared permission entry
     *
     * @param {string} entryUniqueName Assign-role entry unique name
     * @memberof ShareEntityModalComponent
     */
    public onRevokePermission(entryUniqueName: string): void {
        if (!entryUniqueName) {
            return;
        }
        const confirmDialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: this.generalService.deleteConfiguration(
                    this.localeData?.delete_user_permission,
                    this.commonLocaleData
                )
            }
        });
        confirmDialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response === this.commonLocaleData?.app_yes) {
                this.store.dispatch(
                    this.accountActions.unShareEntity(entryUniqueName, this.data.entity, this.data.entityUniqueName)
                );
                setTimeout(() => {
                    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                }, 500);
            }
        });
    }

    /**
     * Closes the dialog
     *
     * @memberof ShareEntityModalComponent
     */
    public closeModal(): void {
        this.dialogRef.close();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Loads users already shared with this entity
     *
     * @private
     * @memberof ShareEntityModalComponent
     */
    private loadSharedWith(): void {
        this.settingsPermissionService
            .getEntitySharedWith(this.data.entity, this.data.entityUniqueName)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response?.status === 'success' && Array.isArray(response.body)) {
                    this.sharedWith.set(response.body);
                } else {
                    this.sharedWith.set([]);
                }
                this.isSharedWithLoaded.set(true);
            });
    }
}
