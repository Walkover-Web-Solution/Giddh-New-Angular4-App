import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: '[account-detail-modal-component]',
  templateUrl: './account-detail-modal.component.html',
  styleUrls: ['./account-detail-modal.component.scss']
})

export class AccountDetailModalComponent implements OnInit, OnChanges {
  @Input() public isModalOpen: boolean = false;
  @Input() public accountUniqueName: string;

  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public flattenAccount: IFlattenAccountsResultItem[] = [];
  public accInfo: IFlattenAccountsResultItem;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.flattenAccountsStream$ = this.store.pipe(select(s => s.general.flattenAccounts), takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    //
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['accountUniqueName'] && changes['accountUniqueName'].currentValue
      && (changes['accountUniqueName'].currentValue !== changes['accountUniqueName'].previousValue)) {
      // this.accInfo = this.flattenAccount.find(f => f.uniqueName === changes['accountUniqueName'].currentValue);
      this.flattenAccountsStream$.pipe(take(1)).subscribe(data => {
        if (data && data.length) {
          this.accInfo = data.find(f => f.uniqueName === changes['accountUniqueName'].currentValue);
        }
      });
    }
  }

  public goToAddAndManage() {
    //
  }
}
