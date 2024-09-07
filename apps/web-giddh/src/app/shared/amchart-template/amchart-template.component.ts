import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'amchart-template',
    templateUrl: './amchart-template.component.html',
    styleUrls: ['./amchart-template.component.scss']
})

export class AmChartComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() chartId: string = 'chartdiv';  // Ensure this is dynamically set
    @Input() height: number = 400;
    @Input() data: any[] = [];

    private root!: am5.Root;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private zone: NgZone,
        private changeDetection: ChangeDetectorRef
    ) { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.initializeChart();
            });
        }
    }

   public  initializeChart() {
        var root = am5.Root.new(this.chartId);

        root.setThemes([am5themes_Animated.new(root)]);

        var container = root.container.children.push(
            am5.Container.new(root, {
                width: am5.percent(100),
                height: am5.percent(100),
                layout: root.verticalLayout
            })
        );

        var series = container.children.push(
            am5hierarchy.Tree.new(root, {
                singleBranchOnly: false,
                downDepth: 1,
                initialDepth: 5,
                topDepth: 0,
                valueField: "value",
                categoryField: "name",
                childDataField: "children",
                paddingBottom: 40,
                paddingTop: 60
            })
        );

        series.circles.template.setAll({
            radius: 40,
            forceHidden: false
        });

        series.outerCircles.template.setAll({
            radius: 40,
            forceHidden: false
        });

        series.circles.template.adapters.add(
            "forceHidden",
            (forceHidden: any, target: any) => {
                return target.dataItem.get("depth") == 0 ? false : forceHidden;
            }
        );

        series.labels.template.setAll({
            fill: am5.color(0x000000),
            y: 30,
            oversizedBehavior: "none"
        });

        series.labels.template.adapters.add("y", (y: any, target: any) => {
            return target.dataItem.get("depth") == 0 ? 0 : y;
        });


        // Setup buttons in the nodes
        series.nodes.template.setup = (target) => {
            target.events.on("dataitemchanged", function (event: any) {
                let data = event;
                // Function to recursively add buttons
                const addButtons = () => {
                    console.log(data);
                    if (data?.newDataItem?.dataContext.action || data.action) {
                        let button = target.children.push(
                            am5.Button.new(root, {
                                dx: 30,
                                dy: 20,
                                width: 110,
                                height: 20,
                                label: am5.Label.new(root, {
                                    position: "relative",
                                    text: "Action"
                                })
                            })
                        );
                        button.get("background").setAll({
                            fill: am5.color(0x000000),
                            fillOpacity: 0.7
                        });

                        button.events.on("click", () => {
                            console.log(`Button  clicked`);
                            // Optionally perform actions here
                            // alert(`Button ${node.dataItem.dataContext.action} clicked`);
                        });
                    }

                    // Recurse into children
                    if (data?.newDataItem?.dataContext?.children?.length) {
                        data.newDataItem.dataContext.children.forEach((child) => {
                            data = child;
                            addButtons()
                        } );
                    }
                };

                addButtons();
            });
        };
       series.data.setAll(this.data);
       series.set("selectedDataItem", series.dataItems[0]);
       series.labels.template.setAll({
           text: "{category}",
           fontSize: 14
       });
       series.nodes.template.set("tooltipText", "{category}");
       series.labels.template.setAll({
           fontSize: 20,
           fill: am5.color(0x550000),
           text: "{category}"
       });

        this.root = root;
    }

    ngOnDestroy() {
        if (this.root) {
            this.root.dispose();
        }
    }
}
