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

  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    console.log (`hello from LetterTemplateComponent`);
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
