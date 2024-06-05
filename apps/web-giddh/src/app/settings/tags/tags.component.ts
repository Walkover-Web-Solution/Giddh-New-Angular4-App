import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep, map, orderBy } from '../../lodash-optimized';
import { SettingsTagService } from '../../services/settings.tag.service';
import { ToasterService } from '../../services/toaster.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

export interface TagInterface {
    name: string,
    description: string,
    uniqueName: string
}

@Component({
    selector: 'setting-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
})
export class SettingsTagsComponent implements OnInit, OnDestroy {
    public tagForm: FormGroup;
    public tags: any[] = [];
    public updateIndex: number = null;
    public confirmationMessage: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Create Tag Form template reference */
    @ViewChild('createTagForm', { static: true }) public createTagForm: TemplateRef<any>;
    /** Create Confirmation Dialog template reference */
    @ViewChild('confirmationModal', { static: true }) public confirmationModal: TemplateRef<any>;
    /** Holds Table Display Columns */
    public displayedColumns: string[] = ['number', 'name', 'description', 'action'];

    constructor(
        private settingsTagService: SettingsTagService,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private formBuilder: UntypedFormBuilder
    ) {
    }

    public ngOnInit() {
        this.tagFormInit();
        this.getTags();
    }

    public getTags() {
        this.tags = [];
        this.isLoading = true;
        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                map(response?.body, (tag) => {
                    tag.uniqueName = tag?.name;
                });
                let tagsData = orderBy(response?.body, 'name');
                this.tags = cloneDeep(tagsData);
            }
            this.isLoading = false;
        });
    }

    public createTag() {
        const formValue = this.tagForm.value;
        console.log("formValue", formValue);

        this.settingsTagService.CreateTag(formValue).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.showToaster(this.commonLocaleData?.app_messages?.tag_created, response);
        });
    }

    public updateTag(tag: TagInterface) {
        this.settingsTagService.UpdateTag(tag).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.showToaster(this.commonLocaleData?.app_messages?.tag_updated, response);
        });
        this.updateIndex = null;
    }

    public setUpdateIndex(indx: number) {
        this.updateIndex = indx;
    }

    public onUserConfirmation(deleteTagConfirmation: boolean) {
        if (deleteTagConfirmation) {
            let model = this.tagForm.value;
            
            this.settingsTagService.DeleteTag(model).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.showToaster(this.commonLocaleData?.app_messages?.tag_deleted, response);
            });
        }
        this.confirmationMessage = '';
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will show toaster for success/error message and will get all tags if success response received
     *
     * @private
     * @param {string} successMessage
     * @param {*} response
     * @memberof SettingsTagsComponent
     */
    private showToaster(successMessage: string, response: any): void {
        this.toaster.clearAllToaster();
        if (response?.status === "success") {
            this.getTags();
            this.toaster.successToast(successMessage, this.commonLocaleData?.app_success);
        } else {
            this.toaster.errorToast(response?.message, response?.code);
        }
    }

    // /**
    // * Open Create Tag Dialog
    // *
    // * @memberof SettingsTagsComponent
    // */
    // public showCreateTag(): void {
    //     this.createTagFormRef = this.dialog.open(this.createTagForm, {
    //         height: '100vh !important',
    //         width: 'var(--aside-pane-width)',
    //         position: {
    //             right: '0',
    //             top: '0'
    //         }
    //     });
    // }

    /**
     * Open Delete Tag Confirmation Dialog
     *
     * @param {TagInterface} tag
     * @memberof SettingsTagsComponent
     */
    public deleteTag(tag: TagInterface): void {
        this.tagForm.get('name').patchValue(tag?.name);
        this.tagForm.get('uniqueName').patchValue(tag?.uniqueName);
        let message = this.localeData?.remove_tag;
        message = message?.replace("[TAG_NAME]", tag.name);
        this.confirmationMessage = message;
        this.dialog.open(this.confirmationModal, {
            panelClass: 'modal-dialog',
            width: '1000px',
        });
    }

    /**
     * Initialise Tag Form
     *
     * @private
     * @memberof SettingsTagsComponent
     */
    private tagFormInit(): void {
        this.tagForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            uniqueName: ['' ]
        });
    }
}
