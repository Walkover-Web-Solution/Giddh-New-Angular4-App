import { Component } from '@angular/core';
import moment from 'moment';

const COMPARISON_FILTER = [
  {label: 'Greater Than', value: 'Greater Than'},
  {label: 'Less Than', value: 'Less than'},
  {label: 'Greater Than or Equals', value: 'Greater than or Equals'},
  {label: 'Less Than or Equals', value: 'Less than or Equals'},
  {label: 'Equals', value: 'Equals'}
];

const ENTITY_FILTER = [
  {label: 'Inwards', value: 'inwards'},
  {label: 'Outwards', value: 'outwards'},
  {label: 'Opening Stock', value: 'Opening Stock'},
  {label: 'Closing Stock', value: 'Closing Stock'}
];

const VALUE_FILTER = [
  {label: 'Quantity', value: 'quantity'},
  {label: 'Value', value: 'Value'}
];

@Component({
  selector: 'invetory-in-out-report',  // <home></home>
  templateUrl: './inventory-in-out-report.component.html',
  styles: [`
    .bdrT {
      border-color: #ccc;
    }

    :host ::ng-deep .fb__1-container {
      justify-content: flex-start;
    }

    :host ::ng-deep .fb__1-container .form-group {
      margin-right: 10px;
      margin-bottom: 0;
    }

    :host ::ng-deep .fb__1-container .date-range-picker {
      min-width: 150px;
    }
  `]
})
export class InventoryInOutReportComponent {
  public datePickerOptions: any = {
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'Last 1 Day': [
        moment().subtract(1, 'days'),
        moment()
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days'),
        moment()
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days'),
        moment()
      ],
      'Last 6 Months': [
        moment().subtract(6, 'months'),
        moment()
      ],
      'Last 1 Year': [
        moment().subtract(12, 'months'),
        moment()
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };
}
