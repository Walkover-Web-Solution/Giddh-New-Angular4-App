import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'import-report',
  templateUrl: './import-report.component.html',
  styleUrls: [`./import-report.component.scss`]
})

export class ImportReportComponent implements OnInit {
  @Output() public onBack: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }
}
