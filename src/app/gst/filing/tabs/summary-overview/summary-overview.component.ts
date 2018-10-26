import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'summary-overview',
  templateUrl: './summary-overview.component.html',
  styleUrls: ['summary-overview.component.css'],
})
export class SummaryOverviewComponent implements OnInit, OnChanges {

  @Input() public currentPeriod: string = null;
  @Input() public activeCompanyGstNumber: string = '';
  @Input() public selectedGst: string = '';

  public showTransaction = false;

  constructor(private activatedRoute: ActivatedRoute) {
    //
  }

  public ngOnInit() {
    //
  }
  /**
   * ngOnChnages
  */
  public ngOnChanges(s: SimpleChanges) {
    //
  }

}
