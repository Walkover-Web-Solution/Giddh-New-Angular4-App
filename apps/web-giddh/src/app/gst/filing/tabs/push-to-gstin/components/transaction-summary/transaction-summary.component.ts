import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['transaction-summary.component.css'],
})
export class TransactionSummaryComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';
  @Input() public isTransactionSummary;

  constructor(private activatedRoute: ActivatedRoute) {
    //
  }

  public ngOnInit() {
    this.isTransactionSummary = true;
    //
  }

  /**
   * ngOnChnages
  */
  public ngOnChanges(s: SimpleChanges) {
    //
  }

}
