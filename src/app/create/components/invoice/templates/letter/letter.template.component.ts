import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'letter-template',
  templateUrl: './letter.template.component.html',
  styleUrls: ['./letter.template.component.scss'],
  encapsulation: ViewEncapsulation.Native
})

export class LetterTemplateComponent implements OnInit, OnDestroy  {
  @Output() public closeAndDestroyComponent: EventEmitter<any> = new EventEmitter();
  public selectedFiles: any;
  public logoPath: any;

  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
    //
  }

  public ngOnDestroy() {
    //
  }

  public doDestroy() {
    this.closeAndDestroyComponent.emit(true);
  }
}
