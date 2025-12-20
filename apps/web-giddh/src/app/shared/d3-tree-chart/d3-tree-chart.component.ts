import { ReplaySubject, Subscription } from 'rxjs';
import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { OrgChart } from 'd3-org-chart';
@Component({
    selector: 'd3-tree-chart',
    styleUrls: [`./d3-tree-chart.component.scss`],
    templateUrl: './d3-tree-chart.component.html',
    standalone:false
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
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
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
                setTimeout(() => {
                    const nodeElement = document.getElementById(nodeId);
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
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
