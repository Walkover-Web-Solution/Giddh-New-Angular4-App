import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TagRequest } from '../../models/api-models/settingsTags';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep, filter, map, orderBy } from '../../lodash-optimized';
import { SettingsTagService } from '../../services/settings.tag.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'setting-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
})
export class SettingsTagsComponent implements OnInit, OnDestroy {
    public newTag: TagRequest = new TagRequest();
    public tags: TagRequest[] = [];
    public tagsBackup: TagRequest[];
    public updateIndex: number = null;
    public confirmationMessage: string = '';
    public searchText: string = '';
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
    /** Holds Create Tag Dialog reference */
    public createTagFormRef: MatDialogRef<any>;

    constructor(
        private settingsTagService: SettingsTagService,
        private toaster: ToasterService,
        public dialog: MatDialog,
    ) {
    }

    public ngOnInit() {
        this.getTags();
    }

    public getTags() {
        this.tags = [];
        this.tagsBackup = null;
        this.isLoading = true;
        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                map(response?.body, (tag) => {
                    tag.uniqueName = tag?.name;
                });
                let tagsData = orderBy(response?.body, 'name');
                this.tags = cloneDeep(tagsData);
                this.tagsBackup = cloneDeep(tagsData);
            }
            this.isLoading = false;
        });
    }

    public createTag(tag: TagRequest) {
        this.settingsTagService.CreateTag(tag).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.createTagFormRef.close();
            this.showToaster(this.commonLocaleData?.app_messages?.tag_created, response);
        });
        this.newTag = new TagRequest();
    }

    public updateTag(tag: TagRequest) {
        this.settingsTagService.UpdateTag(tag).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.showToaster(this.commonLocaleData?.app_messages?.tag_updated, response);
        });
        this.updateIndex = null;
    }

    public setUpdateIndex(indx: number) {
        this.updateIndex = indx;
    }

    public resetUpdateIndex() {
        this.tags = cloneDeep(this.tagsBackup);
        this.updateIndex = null;
    }

    public onUserConfirmation(yesOrNo: boolean) {
        if (yesOrNo) {
            let data = cloneDeep(this.newTag);
            this.settingsTagService.DeleteTag(data).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.showToaster(this.commonLocaleData?.app_messages?.tag_deleted, response);
            });
        }
        this.newTag = new TagRequest();
        this.confirmationMessage = '';
    }

    public filterData(searchTxt: string) {
        let tags;
        if (searchTxt) {
            tags = filter(this.tagsBackup, (tag) => tag.name.includes(searchTxt.toLowerCase()));
        } else {
            tags = cloneDeep(this.tagsBackup);
        }
        this.tags = tags;
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

    /**
    * Open Create Tag Dialog
    *
    * @param {TagRequest} tag
    * @memberof SettingsTagsComponent
    */
    public showCreateTag(): void {
        this.createTagFormRef = this.dialog.open(this.createTagForm, {
            panelClass: 'openform',
            width: '1000px',
            height: '100vh !important',
            position: {
                right: '0',
                top: '0'
            }
        });
    }

    /**
     * Open Delete Tag Confirmation Dialog
     *
     * @param {TagRequest} tag
     * @memberof SettingsTagsComponent
     */
    public deleteTag(tag: TagRequest): void {
        this.newTag = tag;
        let message = this.localeData?.remove_tag;
        message = message?.replace("[TAG_NAME]", tag.name);
        this.confirmationMessage = message;
        this.dialog.open(this.confirmationModal, {
            panelClass: 'modal-dialog',
            width: '1000px',
        });
    }
}
