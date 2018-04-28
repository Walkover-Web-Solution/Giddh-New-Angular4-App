import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'transfer-note',
  templateUrl: './transfer-note.component.html',
  styles: [`

  `],
})

export class TransferNoteComponent implements OnInit {
  @Output() public onCancel = new EventEmitter();

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

}
