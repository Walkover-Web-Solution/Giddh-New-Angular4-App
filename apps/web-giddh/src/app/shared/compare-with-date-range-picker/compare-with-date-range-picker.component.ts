import { Component, OnInit, ViewChild } from '@angular/core';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'giddh-compare-with-date-range-picker',
  templateUrl: './compare-with-date-range-picker.component.html',
  styleUrls: ['./compare-with-date-range-picker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldsModule,
    MatMenuModule,
    MatListModule
  ]
})
export class CompareWithDateRangePickerComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public compareWith: FormControl = new FormControl<string>('None');
  public compareWithLabel: 'Month' | 'Year' | 'Period' = 'Month';
  
  constructor() { }

  /**
   *
   *
   * @memberof CompareWithDateRangePickerComponent
   */
  public ngOnInit(): void {
  }

  openMenu() {
    this.trigger.openMenu();
  }

  public shouldDisableOption(value: string): boolean {
    switch (value) {
      case 'Month':
        return false; 
      case 'Year':
        return false; 
      case 'Period':
        return false; 
      default:
        return true; 
    }
  } 

}
