import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'import-report',
  templateUrl: './import-report.component.html',
  styleUrls: [`./import-report.component.scss`]
})

export class ImportReportComponent implements OnInit {
  constructor(private _router: Router) {
    //
  }

  public ngOnInit() {
    //
  }

  public importFiles() {
    this._router.navigate(['pages', 'import']);
  }
}
