import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivateDialogComponent } from '../activate-dialog/activate-dialog.component';

export interface PeriodicElement {
  name: string;
  premium: string;
  popular: number;
  starter: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: '1', premium: 'Hydrogen', popular: 1.0079, starter: 'H'},
  {name: '1', premium: 'Hydrogen', popular: 1.0079, starter: 'H'},
  {name: '1', premium: 'Hydrogen', popular: 1.0079, starter: 'H'},
  {name: '1', premium: 'Hydrogen', popular: 1.0079, starter: 'H'},
  {name: '1', premium: 'Hydrogen', popular: 1.0079, starter: 'H'},
  {name: '1', premium: 'Hydrogen', popular: 1.0079, starter: 'H'},
];
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
  displayedColumns = [
    'name',
    'premium',
    'popular',
    'starter',
    'premium',
    'popular',
    'starter',
  ];
  dataSource = ELEMENT_DATA;

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
