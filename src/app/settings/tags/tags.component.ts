import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { ToasterService } from '../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from 'app/shared/helpers/defaultDateFormat';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import { SettingsTagActions } from '../../actions/settings/tag/settings.tag.actions';
import { TagRequest } from '../../models/api-models/settingsTags';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'setting-tags',
  templateUrl: './tags.component.html'
})
export class SettingsTagsComponent implements OnInit, OnDestroy {

  @ViewChild('confirmationModal') public confirmationModal: ModalDirective;

  public newTag: TagRequest = new TagRequest();
  public tags$: Observable<TagRequest[]>;
  public tagsBackup: TagRequest[];
  public updateIndex: number = null;
  public confirmationMessage: string = '';
  public searchText: string = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private settingsTagsActions: SettingsTagActions,
    private _toasty: ToasterService
  ) {
  }

  public ngOnInit() {
    this.tags$ = this.store.select(createSelector([(state: AppState) => state.settings.tags], (tags) => {
      if (tags && tags.length) {
        _.map(tags, (tag) => {
          tag.uniqueName = tag.name;
        });
        let tagsData = _.orderBy(tags, 'name');
        this.tagsBackup = _.cloneDeep(tagsData);
        return tagsData;
      } else {
        this.tagsBackup = null;
        return null;
      }
    })).takeUntil(this.destroyed$);
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
    this.confirmationMessage = `Are you sure want to delete <b>${tag.name}</b>?`;
    this.confirmationModal.show();
  }

  public setUpdateIndex(indx: number) {
    this.updateIndex  = indx;
  }

  public resetUpdateIndex() {
    this.tags$ = Observable.of(_.cloneDeep(this.tagsBackup));
    this.updateIndex = null;
  }

  public onUserConfirmation(yesOrNo: boolean) {
    this.confirmationModal.hide();
    if (yesOrNo) {
      let data = _.cloneDeep(this.newTag);
      this.store.dispatch(this.settingsTagsActions.DeleteTag(data));
    }
    this.newTag = new TagRequest();
    this.confirmationMessage = '';
  }

  public filterData(searchTxt: string) {
    let tags = _.filter(this.tagsBackup, (tag) => tag.name.includes(searchTxt.toLowerCase()));
    this.tags$ = Observable.of(tags);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
