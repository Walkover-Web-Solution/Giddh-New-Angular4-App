import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'tb-export-xls',  // <home></home>
  template: `
    <div class="form-group xls-export" (clickOutside)="showTbXls=false;">
      <a href="" (click)="showTbXls = !showTbXls" *ngIf="enableDownload"><img
        src="/assets/images/xls-icon.png"/></a>
      <div class="export-options" *ngIf="showTbXls">
        <span class="arrow"></span>
        <ul class="list-unstyled">
          <li><a href="" (click)="downloadTbXls('main-group',$event)">Main Group Report</a></li>
          <li><a href="" (click)="downloadTbXls('group',$event)">All Group Report</a></li>
          <li><a href="" (click)="downloadTbXls('account',$event)">All Account Report</a></li>
          <li><a href="" (click)="downloadTbXls('all',$event)">Complete Report</a></li>
        </ul>
      </div>
    </div>
    <!--end form-group -->
  `
})
export class TbExportXlsComponent implements OnInit, OnDestroy {

  public enableDownload: boolean = true;
  @Output() public tbExportXLSEvent = new EventEmitter<string>();

  public showTbXls: boolean;
  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder) {

  }

  public downloadTbXls(value: string, e: Event) {
    this.showTbXls = false;
    this.tbExportXLSEvent.emit(value);
    e.preventDefault();
    return false;
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }
}
