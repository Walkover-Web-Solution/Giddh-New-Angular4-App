import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, takeUntil, Subscription } from 'rxjs';

@Component({
  selector: 'master-export-option',
  standalone: false,
  templateUrl: './master-export-option.component.html',
  styleUrls: ['./master-export-option.component.scss']
})
export class MasterExportOptionComponent implements OnInit {
  /** Form Group for export  form */
  public exportForm: FormGroup;
  /** Emits the ecport form master  */
  @Output() public exportFormMaster: EventEmitter<any> = new EventEmitter();
  /** To destroy observers */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
  /* This will hold local JSON data */
  public localeData: any = {};
  /* This will hold common JSON data */
  public commonLocaleData: any = {};
  constructor(
    private formBuilder: FormBuilder
  ) { }

  /**
   * This will use for component initialization
   *
   * @memberof MasterExportOptionComponent
   */
  public ngOnInit(): void {
    this.initExportForm();
    this.exportFormMaster.emit(this.exportForm.value);
    this.exportForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      if (value) {
        this.exportFormMaster.emit(this.exportForm.value);
      }
    });
  }

  /**
 * This will use for initial export form
 *
 * @memberof MasterExportOptionComponent
 */
  public initExportForm(): void {
    this.exportForm = this.formBuilder.group({
      openingBalance: new FormControl(false),
      openingBalanceType: new FormControl(false),
      foreignOpeningBalance: new FormControl(false),
      foreignOpeningBalanceType: new FormControl(false),
      currency: new FormControl(false),
      mobileNumber: new FormControl(false),
      email: new FormControl(false),
      attentionTo: new FormControl(false),
      remark: new FormControl(false),
      address: new FormControl(false),
      pinCode: new FormControl(false),
      taxNumber: new FormControl(false),
      partyType: new FormControl(false),
      bankName: new FormControl(false),
      bankAccountNumber: new FormControl(false),
      ifscCode: new FormControl(false),
      beneficiaryName: new FormControl(false),
      branchName: new FormControl(false),
      swiftCode: new FormControl(false)
    })
  }

  /**
   * This will use for destroy
   *
   * @memberof MasterExportOptionComponent
   */
  public ngOnDestroy(): void {
    this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
  }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
