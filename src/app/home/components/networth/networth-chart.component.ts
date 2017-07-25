import { Component, OnInit } from '@angular/core';
import { Options } from 'highcharts';

@Component({
  selector: 'networth-chart',
  templateUrl: 'networth-chart.component.html'
})

export class NetworthChartComponent implements OnInit {
  public options: Options;

  constructor() {
    this.options = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Column chart with negative values'
      },
      xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'John',
        data: [5, 3, 4, 7, 2]
      }, {
        name: 'Jane',
        data: [2, -2, -3, 2, 1]
      }, {
        name: 'Joe',
        data: [3, 4, 4, -2, 5]
      }]
    };
  }

  public ngOnInit() {
    //
  }
}
