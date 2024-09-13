import { ReplaySubject } from 'rxjs';
import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { OrgChart } from 'd3-org-chart';
@Component({
    selector: 'd3-tree-chart',
    styleUrls: [`./d3-tree-chart.component.scss`],
    templateUrl: './d3-tree-chart.component.html'
})
export class D3TreeChartComponent implements OnDestroy, OnChanges {
    /** Holds Chart Container Reference */
    @ViewChild('chartContainer', { static: false }) public chartContainer: ElementRef;
    /** Holds branches data response */
    @Input() public data: any[];
    /** Holds local data json */
    @Input() public localeData: any;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds tree chart instance */
    public chart: any;

    /**
     * This will be use for component on change
     *
     * @param {SimpleChanges} changes
     * @memberof D3TreeChartComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.data?.currentValue?.length) {
            this.treeUpdateChart();
        }
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
          <div id="${nodeId}" class="branch-tree-wrapper pd-t3 overflow-visible">
            <div class="tree-content pt-0">
              <div class="tree-inner-content"></div>
              <div class="tree-container pd-t2 text-align-center">
                <span class="d-inline-flex align-items-center">
                  <i class="cursor-pointer icon-branch-icon mr-r05"></i>
                  <div class="tree-name  font-16">${d.data.alias}</div>
                </span>
                <div class="tree-alias font-16">${this.localeData?.parent_entity}: ${d.data.name}</div>
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
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
