import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransferComponent } from '../transfer/transfer.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-subscription',
  templateUrl: './view-subscription.component.html',
  styleUrls: ['./view-subscription.component.scss']
})
export class ViewSubscriptionComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
  }
  public transferSubscription(): void {
    this.dialog.open(TransferComponent, {
      data: 'element',
      panelClass: 'transfer-popup',
      width: "630px"
    });
  }

  public cancelSubscription(): void {
  }
  public moveSubscription(): void {
  }
  public changeBilling(): void {
    this.router.navigate(['/pages/subscription/change-billing']);
  }
  public viewSubscription(): void {
  }
  public buyPlan(): void {
    this.router.navigate(['/pages/subscription/buy-plan']);
  }
  public changePlan(): void {
  }
}
