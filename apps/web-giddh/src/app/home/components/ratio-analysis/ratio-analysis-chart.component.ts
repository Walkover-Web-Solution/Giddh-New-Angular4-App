import { skipWhile, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable, ReplaySubject } from 'rxjs';
import { HomeActions } from '../../../actions/home/home.actions';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
    selector: 'ratio-analysis-chart',
    templateUrl: 'ratio-analysis-chart.component.html',
    styleUrls: ['ratio-analysis-chart.component.scss', '../../home.component.scss']
})
export class RatioAnalysisChartComponent implements OnInit, OnDestroy {
    @Input() public refresh: boolean = false;
    public requestInFlight = true;
    public currentRatioChart: typeof Highcharts = Highcharts;
    public currentRatioChartOptions: Highcharts.Options;
    public debtChart: typeof Highcharts = Highcharts;
    public debtOptions: Highcharts.Options;
    public proprietaryChart: typeof Highcharts = Highcharts;
    public proprietaryOption: Highcharts.Options;
    public fixedAssetChart: typeof Highcharts = Highcharts;
    public fixedAssetOption: Highcharts.Options;
    public rationResponse$: Observable<any>;
    public ratioObj: any = {};
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};

    constructor(private store: Store<AppState>, private homeActions: HomeActions) {
        this.rationResponse$ = this.store.pipe(select(p => p.home.RatioAnalysis), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.dispatch(this.homeActions.getRatioAnalysis(dayjs().format(GIDDH_DATE_FORMAT), this.refresh));
    }

    public hardRefresh() {
        this.refresh = true;
        this.fetchChartData();
    }

    public fetchChartData() {
        this.requestInFlight = true;
        this.store.dispatch(this.homeActions.getRatioAnalysis(dayjs().format(GIDDH_DATE_FORMAT), this.refresh));
        this.refresh = false;
    }

    // public generateCharts() {
    //     this.currentRatioChartOptions = {
    //         colors: ['#2C6EBD', '#4693F1'],
    //         chart: {
    //             type: 'pie',
    //             polar: false,
    //             width: 170,
    //             height: '180px'
    //         },
    //         title: {
    //             verticalAlign: 'middle',
    //             align: 'center',
    //             text: '<span class="pie-text_center">' +     + '</span>',
    //             style: { color: '#005b77', fontSize: '21px' },
    //             useHTML: true,
    //             y: 8
    //         },
    //         yAxis: {
    //             title: {
    //                 text: ''
    //             },
    //             gridLineWidth: 0,
    //             minorGridLineWidth: 0,
    //         },
    //         xAxis: {
    //             categories: []
    //         },
    //         legend: {
    //             enabled: false
    //         },
    //         credits: {
    //             enabled: false
    //         },
    //         plotOptions: {
    //             pie: {
    //                 showInLegend: true,
    //                 innerSize: '70%',
    //                 allowPointSelect: true,
    //                 dataLabels: {
    //                     enabled: false,
    //                     crop: true,
    //                     defer: true
    //                 },
    //                 shadow: false,
    //                 center: [
    //                     '50%',
    //                     '50%'
    //                 ],
    //             },
    //             series: {
    //                 animation: false,
    //                 dataLabels: {}
    //             }
    //         },
    //         tooltip: {
    //             headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
    //             pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} </td>' +
    //                 '<td style="color:{series.color};padding:0">{point.percentage:.1f} %</td></tr>',
    //             footerFormat: '</table>',
    //             shared: true,
    //             useHTML: true
    //         },
    //         series: [{
    //             name: this.localeData?.current_ratio,
    //             type: undefined,
    //             data: [[this.localeData?.current_assets, this.ratioObj?.currentRatio * 100], [this.localeData?.current_liabilities, 100]],
    //         }],
    //     };

    //     this.debtOptions = {
    //         colors: ['#EFBB35', '#FED46A'],
    //         chart: {
    //             type: 'pie',
    //             polar: false,
    //             width: 170,
    //             height: '180px'
    //         },
    //         title: {
    //             verticalAlign: 'middle',
    //             align: 'center',
    //             text: '<span class="pie-text_center">' + this.ratioObj?.debtEquityRatio + '</span>',
    //             style: { color: '#005b77', fontSize: '21px' },
    //             useHTML: true,
    //             y: 8
    //         },
    //         yAxis: {
    //             title: {
    //                 text: ''
    //             },
    //             gridLineWidth: 0,
    //             minorGridLineWidth: 0,
    //         },
    //         xAxis: {
    //             categories: []
    //         },
    //         legend: {
    //             enabled: false
    //         },
    //         credits: {
    //             enabled: false
    //         },
    //         plotOptions: {
    //             pie: {
    //                 showInLegend: true,
    //                 innerSize: '70%',
    //                 allowPointSelect: true,
    //                 dataLabels: {
    //                     enabled: false,
    //                     crop: true,
    //                     defer: true
    //                 },
    //                 shadow: false,
    //                 center: [
    //                     '50%',
    //                     '50%'
    //                 ],
    //             },
    //             series: {
    //                 animation: false,
    //                 dataLabels: {}
    //             }
    //         },
    //         tooltip: {
    //             headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
    //             pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} </td>' +
    //                 '<td style="color:{series.color};padding:0">{point.percentage:.1f} %</td></tr>',
    //             footerFormat: '</table>',
    //             shared: true,
    //             useHTML: true
    //         },
    //         series: [{
    //             type: 'pie',
    //             data: [[this.localeData?.current_liability + ' + ' + this.localeData?.noncurrent_liability, this.ratioObj?.debtEquityRatio * 100], [this.localeData?.shareholders_fund, 100]],

    //         }]
    //     };

    //     this.proprietaryOption = {
    //         colors: ['#D93664', '#F85C88'],
    //         chart: {
    //             type: 'pie',
    //             polar: false,
    //             width: 170,
    //             height: '180px'
    //         },
    //         title: {
    //             verticalAlign: 'middle',
    //             align: 'center',
    //             text: '<span class="pie-text_center">' + this.ratioObj?.proprietaryRatio + '</span>',
    //             style: { color: '#005b77', fontSize: '21px' },
    //             useHTML: true,
    //             y: 8
    //         },
    //         yAxis: {
    //             title: {
    //                 text: ''
    //             },
    //             gridLineWidth: 0,
    //             minorGridLineWidth: 0,
    //         },
    //         xAxis: {
    //             categories: []
    //         },
    //         legend: {
    //             enabled: false
    //         },
    //         credits: {
    //             enabled: false
    //         },
    //         plotOptions: {
    //             pie: {
    //                 showInLegend: true,
    //                 innerSize: '70%',
    //                 allowPointSelect: true,
    //                 dataLabels: {
    //                     enabled: false,
    //                     crop: true,
    //                     defer: true
    //                 },
    //                 shadow: false,
    //                 center: [
    //                     '50%',
    //                     '50%'
    //                 ],
    //             },
    //             series: {
    //                 animation: false,
    //                 dataLabels: {}
    //             }
    //         },
    //         tooltip: {
    //             headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
    //             pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} </td>' +
    //                 '<td style="color:{series.color};padding:0">{point.percentage:.1f} %</td></tr>',
    //             footerFormat: '</table>',
    //             shared: true,
    //             useHTML: true
    //         },
    //         series: [{
    //             name: this.localeData?.proprietary_ratio,
    //             type: 'pie',
    //             data: [[this.localeData?.shareholders_fund, this.ratioObj?.proprietaryRatio * 100], [this.localeData?.total_assets, 100]],

    //         }]
    //     };

    //     this.fixedAssetOption = {
    //         colors: ['#087E7D', '#0CB1AF'],
    //         chart: {
    //             type: 'pie',
    //             polar: false,
    //             width: 170,
    //             height: '180px'
    //         },
    //         title: {
    //             verticalAlign: 'middle',
    //             align: 'center',
    //             text: '<span class="pie-text_center">' + this.ratioObj?.fixedAssetRatio + '</span>',
    //             style: { color: '#005b77', fontSize: '21px' },
    //             useHTML: true,
    //             y: 8
    //         },
    //         yAxis: {
    //             title: {
    //                 text: ''
    //             },
    //             gridLineWidth: 0,
    //             minorGridLineWidth: 0,
    //         },
    //         xAxis: {
    //             categories: []
    //         },
    //         legend: {
    //             enabled: false
    //         },
    //         credits: {
    //             enabled: false
    //         },
    //         plotOptions: {
    //             pie: {
    //                 showInLegend: true,
    //                 innerSize: '70%',
    //                 allowPointSelect: true,
    //                 dataLabels: {
    //                     enabled: false,
    //                     crop: true,
    //                     defer: true
    //                 },
    //                 shadow: false,
    //                 center: [
    //                     '50%',
    //                     '50%'
    //                 ],
    //             },
    //             series: {
    //                 animation: false,
    //                 dataLabels: {}
    //             }
    //         },
    //         tooltip: {
    //             headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
    //             pointFormat: '<tr><td style="color:{series.color};padding:0">{point.key} </td>' +
    //                 '<td style="color:{series.color};padding:0">{point.percentage:.1f} %</td></tr>',
    //             footerFormat: '</table>',
    //             shared: true,
    //             useHTML: true
    //         },
    //         series: [{
    //             name: this.localeData?.fixed_assets_ratio,
    //             type: 'pie',
    //             data: [[this.localeData?.fixed_assets + ' / ' + this.localeData?.noncurrent_liability, this.ratioObj?.fixedAssetRatio * 100], [this.localeData?.shareholders_fund, 100]],
    //         }]
    //     };
    // }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof RatioAnalysisChartComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.rationResponse$.pipe(skipWhile(response => (response === null || response === undefined))).subscribe(response => {
                this.ratioObj = response;
                // this.generateCharts();
                this.createChart();
                this.requestInFlight = false;
            });
        }
    }

    createChart(){

        /* ==================================CURRENT RATIO CHART CONFIG============================== */
        let currentRatioLabels = [this.localeData?.current_assets, this.localeData?.current_liabilities];
        let currentRatioData = [this.ratioObj?.currentRatio, 14];
        let currentRatioVal = this.ratioObj?.currentRatio;
       
        const currentRatioCenterLabel = {
            id: 'currentRatioCenterLabel',
            beforeDatasetsDraw(chart, args ,pluginOptions) {
              const { ctx, data } = chart;
              ctx.save(); 
              const xCoor = chart.getDatasetMeta(0).data[0].x;
              const yCoor = chart.getDatasetMeta(0).data[0].y;
              ctx.font = '21px sans-serif';
              ctx.fillStyle = '#668cff';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(currentRatioVal, xCoor, yCoor);
            }
          }

        new Chart("currentRatioChartCanvas", {
            type: 'doughnut',     
            plugins: [ currentRatioCenterLabel ],      
            data: {
                labels: currentRatioLabels,
                datasets: [{
                    label: '',
                    data: currentRatioData,
                    backgroundColor: ['#2C6EBD', '#4693F1'],
                    hoverOffset: 18,
                    hoverBorderColor: '#fff',
                    borderWidth: 1,		 
                    offset: 6,   
              }],
            },

            options:{
                plugins: {
                    legend: {
                      display: false
                    },
                },
                
                responsive: true,
                maintainAspectRatio: false,
                spacing:1,
                cutout:50,  
                radius: '90%',    
            } 
            });


         /* ==================================DEBIT OPTIONS CHART CONFIG============================== */
        let debitOptionsLabels = [this.localeData?.current_liability + ' + ' + this.localeData?.noncurrent_liability, this.localeData?.shareholders_fund];
        let debitOptionsData = [this.ratioObj?.currentRatio, 14];
        let debitOptionsVal = this.ratioObj?.debtEquityRatio;
       
        const debitOptionsCenterLabel = {
            id: 'debitOptionsCenterLabel',
            beforeDatasetsDraw(chart, args ,pluginOptions) {
              const { ctx, data } = chart;
              ctx.save(); 
              const xCoor = chart.getDatasetMeta(0).data[0].x;
              const yCoor = chart.getDatasetMeta(0).data[0].y;
              ctx.font = '21px sans-serif';
              ctx.fillStyle = '#e58a00';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(debitOptionsVal, xCoor, yCoor);
            }
          }

        new Chart("debitOptionsChartCanvas", {
            type: 'doughnut',     
            plugins: [ debitOptionsCenterLabel ],      
            data: {
                labels: debitOptionsLabels,
                datasets: [{
                    label: '',
                    data: debitOptionsData,
                    backgroundColor: ['#EFBB35', '#FED46A'],
                    hoverOffset: 18,
                    hoverBorderColor: '#fff',
                    borderWidth: 1,		 
                    offset: 6, 
              }],
            },

            options:{
                plugins: {
                    legend: {
                      display: false
                    },
                },
                
                responsive: true,
                maintainAspectRatio: false,
                spacing:1,
                cutout:50,  
                radius: '90%',    
            } 
            });

        /* ==================================Proprietary OPTIONS CHART CONFIG============================== */
        let proprietaryOptionsLabels = [this.localeData?.shareholders_fund, this.localeData?.total_assets];
        let proprietaryOptionsData = [this.ratioObj?.currentRatio, 14];
        let proprietaryOptionsVal = this.ratioObj?.proprietaryRatio;
       
        const proprietaryOptionsCenterLabel = {
            id: 'proprietaryOptionsCenterLabel',
            beforeDatasetsDraw(chart, args ,pluginOptions) {
              const { ctx, data } = chart;
              ctx.save(); 
              const xCoor = chart.getDatasetMeta(0).data[0].x;
              const yCoor = chart.getDatasetMeta(0).data[0].y;
              ctx.font = '21px sans-serif';
              ctx.fillStyle = '#e54556';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(proprietaryOptionsVal, xCoor, yCoor);
            }
          }

        new Chart("proprietaryOptionsChartCanvas", {
            type: 'doughnut',     
            plugins: [ proprietaryOptionsCenterLabel ],      
            data: {
                labels: proprietaryOptionsLabels,
                datasets: [{
                    label: '',
                    data: proprietaryOptionsData,
                    backgroundColor: ['#D93664', '#F85C88'],
                    hoverOffset: 18,
                    hoverBorderColor: '#fff',
                    borderWidth: 1,		 
                    offset: 6, 
              }],
            },

            options:{
                plugins: {
                    legend: {
                      display: false
                    },
                },
                
                responsive: true,
                maintainAspectRatio: false,
                spacing:1,
                cutout:50,  
                radius: '90%',    
            } 
            });

        /* ==================================FIXED ASSET OPTIONS CHART CONFIG============================== */
        let fixedAssetOptionsLabels = [this.localeData?.fixed_assets + ' / ' + this.localeData?.noncurrent_liability, this.localeData?.shareholders_fund];
        let fixedAssetOptionsData = [this.ratioObj?.currentRatio, 14];
        let fixedAssetOptionsVal = this.ratioObj?.fixedAssetRatio;
       
        const fixedAssetOptionsCenterLabel = {
            id: 'fixedAssetOptionsCenterLabel',
            beforeDatasetsDraw(chart, args ,pluginOptions) {
              const { ctx, data } = chart;
              ctx.save(); 
              const xCoor = chart.getDatasetMeta(0).data[0].x;
              const yCoor = chart.getDatasetMeta(0).data[0].y;
              ctx.font = '21px sans-serif';
              ctx.fillStyle = '#36b283';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(fixedAssetOptionsVal, xCoor, yCoor);
            }
          }

        new Chart("fixedAssetOptionsChartCanvas", {
            type: 'doughnut',     
            plugins: [ fixedAssetOptionsCenterLabel ],      
            data: {
                labels: fixedAssetOptionsLabels,
                datasets: [{
                    label: '',
                    data: fixedAssetOptionsData,
                    backgroundColor: ['#087E7D', '#0CB1AF'],
                    hoverOffset: 18,
                    hoverBorderColor: '#fff',
                    borderWidth: 1,		 
                    offset: 6, 
              }],
            },

            options:{
                plugins: {
                    legend: {
                      display: false
                    },
                },
                
                responsive: true,
                maintainAspectRatio: false,
                spacing:1,
                cutout:50,  
                radius: '90%',    
            } 
            });
     }
}
