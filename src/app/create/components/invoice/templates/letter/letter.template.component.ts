import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { VoucherClass } from '../../../../../models/api-models/Sales';
import { FormControl, Form } from '@angular/forms';

@Component({
  selector: 'letter-template',
  templateUrl: './letter.template.component.html',
  styleUrls: [
    '../template.component.scss',
    './letter.template.component.scss'
  ],
  encapsulation: ViewEncapsulation.Native
})

export class LetterTemplateComponent implements OnInit, OnDestroy  {
  @Output() public closeAndDestroyComponent: EventEmitter<any> = new EventEmitter();
  public selectedFiles: any;
  public logoPath: any;
  public data: VoucherClass;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public name: string = 'August 09, 2017';
  public name1: string = 'GSTIN: 11AAAAAA000A1Z0';
  public name2: string = 'PAN: AAACW9768L';

  constructor() {
    console.log (`hello from LetterTemplateComponent`);
  }

  public readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (item: any) => {
        this.logoPath = item.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  public clearUploadedImg() {
    this.logoPath = null;
  }

  public ngOnInit() {
    this.data = new VoucherClass();
    this.initWithDummyData();
    console.log (this.data);
  }

  public ngOnDestroy() {
    //
  }

  public emitTemplateData(data: Form) {
    console.log ('emitTemplateData', data);
  }

  public doDestroy() {
    this.closeAndDestroyComponent.emit(true);
  }

  private initWithDummyData() {
    //
  }
}
