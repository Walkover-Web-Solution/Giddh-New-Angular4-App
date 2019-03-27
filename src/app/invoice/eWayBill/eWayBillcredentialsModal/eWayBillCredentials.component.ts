import {Component, EventEmitter, OnInit, Output} from "@angular/core";

@Component({
  selector: 'app-eWayBill-credentials-modal',
  templateUrl: './eWayBillCredentials.component.html',
  styleUrls: [`./eWayBillCredentials.component.scss`]
})

export class EWayBillCredentialsComponent implements OnInit {
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);


  ngOnInit(): void {
  }


  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
