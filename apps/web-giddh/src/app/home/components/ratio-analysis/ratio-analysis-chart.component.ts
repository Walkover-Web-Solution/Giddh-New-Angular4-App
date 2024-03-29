import { skipWhile, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
    public rationResponse$: Observable<any>;
    public ratioObj: any = {};
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    public chart:any;

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
                if (this.chart) {
                  this.chart.destroy();
              } 
                this.createChart();
                this.requestInFlight = false;
            });
        }
    }

    public createChart():void{
     
        /* ==================================CURRENT RATIO CHART CONFIG============================== */
        let currentRatioLabels = [this.localeData?.current_assets, this.localeData?.current_liabilities];
        let currentRatioData = [64, 36];
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

          this.chart = new Chart("currentRatioChartCanvas", {
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
                    tooltip: { 
                      callbacks: {
                        label: (context) => {
                                let value  = context.parsed;
                                return `${value}%`;
                        }
                    },
                      padding: 10, 
                      backgroundColor: 'rgba(255, 255, 255,0.8)',
                      borderColor: 'rgb(69, 135, 214)',
                      bodyColor: 'rgb(0, 0, 0)', 
                      titleColor: 'rgb(0, 0, 0)',
                      borderWidth: 0.5,
                      titleFont: {
                          weight: 'normal'
                      },
                      displayColors: false,
                  }
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

          this.chart = new Chart("debitOptionsChartCanvas", {
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
                    tooltip: { 
                      callbacks: {
                        label: (context) => {
                                let value  = context.parsed;
                                return `${value}%`;
                        }
                    }, 
                      padding: 10,
                      backgroundColor: 'rgba(255, 255, 255,0.8)',
                      borderColor: 'rgb(239, 187, 53)',
                      bodyColor: 'rgb(0, 0, 0)', 
                      titleColor: 'rgb(0, 0, 0)',
                      borderWidth: 0.5,
                      titleFont: {
                          weight: 'normal'
                      },
                      displayColors: false,
                  }
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

          this.chart = new Chart("proprietaryOptionsChartCanvas", {
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
                    tooltip: {  
                      callbacks: {
                        label: (context) => {
                                let value  = context.parsed;
                                return `${value}%`;
                        }
                    },
                      padding: 10,
                      backgroundColor: 'rgba(255, 255, 255,0.8)',
                      borderColor: 'rgb(217, 54, 100)',
                      bodyColor: 'rgb(0, 0, 0)', 
                      titleColor: 'rgb(0, 0, 0)',
                      borderWidth: 0.5,
                      titleFont: {
                          weight: 'normal'
                      },
                      displayColors: false,
                  }
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

          this.chart = new Chart("fixedAssetOptionsChartCanvas", {
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
                    tooltip: {  
                      callbacks: {
                        label: (context) => {
                                let value  = context.parsed;
                                return `${value}%`;
                        }
                    },
                      padding: 10,
                      backgroundColor: 'rgba(255, 255, 255,0.8)',
                      borderColor: 'rgb(8, 126, 125)',
                      bodyColor: 'rgb(0, 0, 0)', 
                      titleColor: 'rgb(0, 0, 0)',
                      borderWidth: 0.5,
                      titleFont: {
                          weight: 'normal'
                      },
                      displayColors: false,
                  }
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
