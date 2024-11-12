import { take } from 'rxjs/operators';
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep, map, orderBy } from '../../lodash-optimized';
import { SettingsTagService } from '../../services/settings.tag.service';
import { ToasterService } from '../../services/toaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { GeneralService } from '../../services/general.service';

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
export class SettingsTagsComponent implements OnInit {
    /** Create Confirmation Dialog template reference */
    @ViewChild('confirmationModal', { static: true }) public confirmationModal: TemplateRef<any>;
    /** Holds tag form group */
    public tagForm: FormGroup;
    /** Holds tags list */
    public tags: any[] = [];
    /** Holds confirmation message */
    public confirmationMessage: string = '';
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds True if want to trigger create tag function in input blur*/
    public addOnBlur: boolean = true;
    /** Holds separator Keys Codes constant */
    public readonly separatorKeysCodes: any = [ENTER, COMMA] as const;
    /** Holds announcer for mat chip */
    public announcer: any = inject(LiveAnnouncer);

    constructor(
        private settingsTagService: SettingsTagService,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private generalService: GeneralService
    ) { }

    /**
     * Initializes the component
     *
     * @memberof SettingsTagsComponent
     */
    public ngOnInit(): void {
        this.tagFormInit();
        if (this.generalService.companyUniqueName?.trim()) {
            this.getTags();
        }
    }

    /**
     * Get all tags
     *
     * @memberof SettingsTagsComponent
     */
    public getTags(): void {
        this.tags = [];
        this.isLoading = true;
        this.settingsTagService.GetAllTags().pipe(take(1)).subscribe(response => {
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

    /**
     * Create new tag
     *
     * @param {MatChipInputEvent} event
     * @memberof SettingsTagsComponent
     */
    public createTag(event: MatChipInputEvent): void {
        if (event?.value?.length) {
            this.tagForm.get('name').patchValue(event.value);
            const formValue = this.tagForm.value;
            this.settingsTagService.CreateTag(formValue).pipe(take(1)).subscribe(response => {
                if (response) {
                    this.tagForm.reset();
                    event.chipInput!.clear();
                    this.showToaster(this.commonLocaleData?.app_messages?.tag_created, response);
                }
            });
        }
    }

    /**
     * Update Tag name
     *
     * @param {TagInterface} tag
     * @param {MatChipEditedEvent} event
     * @memberof SettingsTagsComponent
     */
    public updateTag(tag: TagInterface, event: MatChipEditedEvent): void {
        tag.name = event.value.trim();
        this.setTagValue(tag);
        this.settingsTagService.UpdateTag(tag).pipe(take(1)).subscribe(response => {
            if (response) {
                this.showToaster(this.commonLocaleData?.app_messages?.tag_updated, response);
            }
        });
    }

    /**
     * Delete Tag
     *
     * @param {boolean} deleteTagConfirmation
     * @memberof SettingsTagsComponent
     */
    public onUserConfirmation(deleteTagConfirmation: boolean): void {
        if (deleteTagConfirmation) {
            const model = this.tagForm.value;

            this.settingsTagService.DeleteTag(model).pipe(take(1)).subscribe(response => {
                if (response) {
                    this.showToaster(this.commonLocaleData?.app_messages?.tag_deleted, response);
                    this.announcer.announce(`Removed ${model?.name}`);
                }
            });
        }
        this.confirmationMessage = '';
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
     * Set tag name and uniqueName to formcontrol
     *
     * @private
     * @param {TagInterface} tag
     * @memberof SettingsTagsComponent
     */
    private setTagValue(tag: TagInterface): void {
        if (tag?.name) {
            this.tagForm.get('name').patchValue(tag?.name);
            this.tagForm.get('uniqueName').patchValue(tag?.uniqueName);
        }
    }

    /**
     * Open Delete Tag Confirmation Dialog
     *
     * @param {TagInterface} tag
     * @memberof SettingsTagsComponent
     */
    public deleteTag(tag: TagInterface): void {
        this.setTagValue(tag);
        let message = this.localeData?.remove_tag;
        message = message?.replace("[TAG_NAME]", tag.name);
        this.confirmationMessage = message;
        this.dialog.open(this.confirmationModal, {
            panelClass: 'modal-dialog',
            width: '1000px'
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
            uniqueName: ['']
        });
    }
}
