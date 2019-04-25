import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'submit-gst-modal-component',
  templateUrl: './submit-gst-modal.component.html',
  styleUrls: ['./submit-gst-modal.component.scss']
})

export class SubmitGstModalComponent implements OnInit {
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
