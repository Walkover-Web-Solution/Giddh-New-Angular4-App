import { ReplaySubject } from 'rxjs';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { OrgChart } from 'd3-org-chart';
@Component({
    selector: 'd3-tree-chart',
    styleUrls: [`./d3-tree-chart.component.scss`],
    templateUrl: './d3-tree-chart.component.html'
})
export class D3TreeChartComponent implements AfterViewInit, OnDestroy {
    /** Holds Chart Container Reference */
    @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef;
    /** Holds branches data response */
    @Input() data: any[];
    /** Holds local data json */
    @Input() localeData: any;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds tree chart instance */
    public chart: any;

    constructor(
    ) { }

    /**
     *  Lifecycle hook for load component after view initialization
     *
     * @memberof D3TreeChartComponent
     */
    public ngAfterViewInit(): void {
        let interval = setInterval(() => {
            if (this.data?.length) {
                setTimeout(() => {
                    this.treeUpdateChart();
                }, 100);
                clearInterval(interval);
            }
        }, 500);
    }

    /**
     * Return tree update chart from data
     *
     * @return {*}  {void}
     * @memberof D3TreeChartComponent
     */
    public treeUpdateChart(): void {
        if (!this.data || !this.chartContainer) {
            return;
        }
        if (!this.chart) {
            this.chart = new OrgChart();
        }

        this.chart
            .container(this.chartContainer.nativeElement)
            .data(this.data)
            .svgWidth(1500)
            .initialZoom(1.1)
            .nodeHeight(() => 120)
            .childrenMargin(() => 40)
            .compactMarginBetween(() => 15)
            .compactMarginPair(() => 80)
            .nodeContent((d) => {
                const nodeId = `node-${d.id}`;
                setTimeout(() => {
                    const nodeElement = document.getElementById(nodeId);
                    if (nodeElement) {
                        nodeElement.addEventListener('click', () => {
                            // Define click logic here
                        });
                    }
                }, 0);

                return `
          <div id="${nodeId}" class="branch-tree-wrapper">
            <div class="tree-content">
              <div class="tree-inner-content"></div>
              <div class="tree-container text-align-center">
                <span class="d-inline-flex align-items-center">
                  <i class="cursor-pointer icon-branch-icon mr-r05"></i>
                  <div class="tree-name">${d.data.alias}</div>
                </span>
                <div class="tree-alias">${this.localeData?.parent_entity}: ${d.data.name}</div>
              </div>
            </div>
          </div>`;
            })
            .render();
    }

    /**
     * Releases the memory
     *
     * @memberof D3TreeChartComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
