import { ReplaySubject } from 'rxjs';
import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { OrgChart } from 'd3-org-chart';
/**
 * Handles Component functionality
 */
@Component({
    selector: 'd3-tree-chart',
    styleUrls: [`./d3-tree-chart.component.scss`],
    templateUrl: './d3-tree-chart.component.html',
    standalone: false
})
/**
 * D3TreeChartComponent component
 * Handles d3treechart functionality and user interactions
 */
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
        /**
         * Handles if functionality
         */
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
        /**
         * Handles if functionality
         */
        if (!this.data || !this.chartContainer) {
            return;
        }
        /**
         * Handles if functionality
         */
        if (!this.chart) {
            this.chart = new OrgChart();
        }

        // Get the screen or container size
        const containerWidth = this.chartContainer.nativeElement.offsetWidth;
        const containerHeight = this.chartContainer.nativeElement.offsetHeight;

        const calculatedWidth = containerWidth > 0 ? containerWidth : window.innerWidth;
        const calculatedHeight = containerHeight > 0 ? containerHeight : window.innerHeight;

        this.chart
            .container(this.chartContainer.nativeElement)
            .data(this.data)
            .svgWidth(calculatedWidth) // Set dynamic width
            .svgHeight(calculatedHeight) // Set dynamic height
            .initialZoom(1.1)
            .nodeHeight(() => 120)
            .childrenMargin(() => 40)
            .compactMarginBetween(() => 15)
            .compactMarginPair(() => 80)
            .nodeContent((d) => {
                const nodeId = `node-${d.id}`;
                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    const nodeElement = document.getElementById(nodeId);
                    /**
                     * Handles if functionality
                     */
                    if (nodeElement) {
                        nodeElement.addEventListener('click', () => {
                            // Define click logic here
                        });
                    }
                }, 0);

                return `
          <div id="${nodeId}" class=" branch-tree-wrapper pt-5 overflow-visible">
            <div class="tree-content pt-0">
              <div class="tree-inner-content"></div>
              <div class="tree-container pb-4 pt-4 text-center">
                <span class="d-inline-flex align-items-center">
                  <div class="tree-name text-limit overflow-hidden font-16"> <i class="cursor-pointer icon-branch-icon mr-1"></i>${d.data.name}</div>
                </span>
              </div>
            </div>
          </div>`;
            })
            .render();

        // Expand all nodes
        this.chart.expandAll();
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
