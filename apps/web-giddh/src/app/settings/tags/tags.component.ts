import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../store/roots';
import { createSelector } from 'reselect';
import { SettingsTagActions } from '../../actions/settings/tag/settings.tag.actions';
import { TagRequest } from '../../models/api-models/settingsTags';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { cloneDeep, filter, map, orderBy } from '../../lodash-optimized';

@Component({
    selector: 'setting-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
})
export class SettingsTagsComponent implements OnInit, OnDestroy {

    @ViewChild('confirmationModal', { static: true }) public confirmationModal: ModalDirective;

    public newTag: TagRequest = new TagRequest();
    public tags$: Observable<TagRequest[]>;
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

    constructor(
        private store: Store<AppState>,
        private settingsTagsActions: SettingsTagActions
    ) {
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.settings.isGetAllTagsInProcess), takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = response;
        });

        this.tags$ = this.store.pipe(select(createSelector([(state: AppState) => state.settings.tags], (tags) => {
            if (tags && tags.length) {
                map(tags, (tag) => {
                    tag.uniqueName = tag.name;
                });
                let tagsData = orderBy(tags, 'name');
                this.tagsBackup = cloneDeep(tagsData);
                return tagsData;
            } else {
                this.tagsBackup = null;
                return null;
            }
        })), takeUntil(this.destroyed$));
    }

    public getTags() {
        this.store.dispatch(this.settingsTagsActions.GetALLTags());
    }

    public createTag(tag: TagRequest) {
        this.store.dispatch(this.settingsTagsActions.CreateTag(tag));
        this.newTag = new TagRequest();
    }

    public updateTag(tag: TagRequest, indx: number) {
        this.store.dispatch(this.settingsTagsActions.UpdateTag(tag));
        this.updateIndex = null;
    }

    public deleteTag(tag: TagRequest) {
        this.newTag = tag;
        let message = this.localeData?.remove_tag;
        message = message?.replace("[TAG_NAME]", tag.name);
        this.confirmationMessage = message;
        this.confirmationModal.show();
    }

    public setUpdateIndex(indx: number) {
        this.updateIndex = indx;
    }

    public resetUpdateIndex() {
        this.tags$ = observableOf(cloneDeep(this.tagsBackup));
        this.updateIndex = null;
    }

    public onUserConfirmation(yesOrNo: boolean) {
        this.confirmationModal.hide();
        if (yesOrNo) {
            let data = cloneDeep(this.newTag);
            this.store.dispatch(this.settingsTagsActions.DeleteTag(data));
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
        this.tags$ = observableOf(tags);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
