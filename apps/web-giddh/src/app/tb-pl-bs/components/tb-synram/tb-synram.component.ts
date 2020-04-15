import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { AccountDetails } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { Observable, ReplaySubject } from 'rxjs';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';

@Component({
	selector: 'tb-synram',
	templateUrl: './tb-synram.component.html',
	styleUrls: ['./tb-synram.component.scss']
})
export class TbSynramComponent implements OnInit {

	public showOpening: boolean = true;
	public showTransactions: boolean = true;
	public showClosing: boolean = true;
	public isExpanded: boolean = false;

	public data$: Observable<AccountDetails>;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private store: Store<AppState>,
		private _toaster: ToasterService,
		private cd: ChangeDetectorRef) {
		//
	}
	public ngOnInit() {

		this.data$ = this.store.select(createSelector((p: AppState) => p.tlPl.tb.data, (p: AccountDetails) => {
			let d = _.cloneDeep(p) as AccountDetails;
			if (d) {
				if (d.message) {
					setTimeout(() => {
						this._toaster.clearAllToaster();
						this._toaster.infoToast(d.message);
					}, 100);
				}
				this.InitData(d.groupDetails);
				d.groupDetails.forEach(g => {
					g.isVisible = true;
					g.isCreated = true;
				});
			}
			return d;
		})).pipe(takeUntil(this.destroyed$));
		this.data$.subscribe(p => {
			this.cd.markForCheck();
		});

	}

	public InitData(d: ChildGroup[]) {
		_.each(d, (grp: ChildGroup) => {
			grp.isVisible = false;
			grp.isCreated = false;
			grp.isIncludedInSearch = true;
			_.each(grp.accounts, (acc: Account | any) => {
				acc.isIncludedInSearch = true;
				acc.isCreated = false;
				acc.isVisible = false;
			});
			if (grp.childGroups) {
				this.InitData(grp.childGroups);
			}
		});
	}
}
