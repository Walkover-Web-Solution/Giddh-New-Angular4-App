import { Component, OnDestroy, OnInit } from '@angular/core';
import { VoucherPreviewComponentStore } from '../utility/vouhcers-preview.store';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss'],
  providers: [VoucherComponentStore, VoucherPreviewComponentStore]
})
export class HistoryDialogComponent implements OnInit, OnDestroy {
  /** Observable to unsubscribe all the store listeners to avoid memory leaks */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** */
  public isVoucherVersionsInProgress$: Observable<any> = this.componentStorePreview.isVoucherVersionsInProgress$;

  constructor(
    private componentStoreVoucher: VoucherComponentStore,
    private componentStorePreview: VoucherPreviewComponentStore,
  ) { }

  /**
  * Initializes the component
  *
  * @memberof HistoryDialogComponent
  */
  public ngOnInit(): void {
  /// ========= NEED TO CALL API FROM HERE AND PAYLOAD GET FROM MAT DIALOG DATA ========= ///

    this.componentStorePreview.downloadVoucherResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
      if (response) {
        // this.handleDownloadVoucherPdf(response);
        console.log(response);

      }
    });
  }
  /**
   * Lifecycle hook for destroy
   *
   * @memberof HistoryDialogComponent
   */
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
