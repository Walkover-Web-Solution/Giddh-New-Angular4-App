import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-generate-ewaybill-modal',
  templateUrl: './generateEWayBill.component.html',
  styleUrls: [`./generateEWayBill.component.scss`]
})

export class GenerateEWayBillComponent implements OnInit {
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  constructor(private router: Router) {
    //
  }

  public ngOnInit(): void {
    //
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }

  public createEWayBill() {
    this.router.navigate(['pages', 'invoice', 'ewaybill']);
  }
}
