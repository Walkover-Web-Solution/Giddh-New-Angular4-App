import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'outward-note',
  templateUrl: './outward-note.component.html',
  styles: [`

  `],
})

export class OutwardNoteComponent implements OnInit {
  @Output() public onCancel = new EventEmitter();

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

}
