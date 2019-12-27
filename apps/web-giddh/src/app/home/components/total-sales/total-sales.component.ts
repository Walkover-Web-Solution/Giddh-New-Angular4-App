
import { Component, OnInit } from '@angular/core';





@Component({
	selector: 'total-sales',
	templateUrl: 'total-sales.component.html',
	styleUrls: ['total-sales.component.scss', '../../home.component.scss'],

})

export class TotalSalesComponent implements OnInit {
	public options
	constructor() {
		this.options = {

			title: {
				text: ''
			},

			subtitle: {
				text: ''
			},

			yAxis: {
				title: {
					text: ''
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: false
					},
					pointStart: 1
				}
			},

			series: [{
				name: '',
				data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
			},
				// {
				//   name: '',
				//   data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
				// }, {
				//   name: '',
				//   data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
				// }, {
				//   name: '',
				//   data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
				// }, {
				//   name: '',
				//   data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
				// }
			],

			responsive: {
				rules: [{
					condition: {
						maxWidth: 1300
					},
					chartOptions: {
						legend: {
							layout: 'horizontal',
							align: 'center',
							verticalAlign: 'bottom'
						}
					}
				}]
			}

		}
	}
	public ngOnInit() {

	}

}
