import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'note-points-gst-modal-component',
  templateUrl: './note-points-gst-modal.component.html',
  styleUrls: [`./note-points-gst-modal.component.scss`]
})

export class NotePointsGstModalComponent implements OnInit {
  @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter(null);
  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public closeModal() {
    this.closeModelEvent.emit(true);
  }
}
