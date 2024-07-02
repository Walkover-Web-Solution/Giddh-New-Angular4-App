import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'master-export-option',
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
  /* This will hold local JSON data */
  public localeData: any = {};
  /* This will hold common JSON data */
  public commonLocaleData: any = {};
  constructor(
    private formBuilder: FormBuilder
  ) { }

  /**
   * This will use for master export file
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
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
