import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivateDialogComponent } from '../activate-dialog/activate-dialog.component';

@Component({
  selector: 'app-buy-plan',
  templateUrl: './buy-plan.component.html',
  styleUrls: ['./buy-plan.component.scss']
})
export class BuyPlanComponent implements OnInit {
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  thirdStepForm: FormGroup;

  @ViewChild('stepper') stepperIcon: any;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }
  // for disable stepper icon
  public ngAfterViewInit(): void {
    this.stepperIcon._getIndicatorType = () => 'number';
  }

  public activateDialog():void {
    this.dialog.open(ActivateDialogComponent, {
      width: '600px'
    })
  }
  public onSelectedTab(){

  }
}
