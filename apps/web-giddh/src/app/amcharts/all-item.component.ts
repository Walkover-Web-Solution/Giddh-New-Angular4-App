import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';

// import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
    selector: 'all-giddh-item',
    templateUrl: './all-item.component.html',
    styleUrls: ['./all-item.component.scss']
})

export class ChartComponent implements AfterViewInit, OnDestroy {

    private root!: am5.Root;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object, 
        private zone: NgZone
    ) { }

    // Run the function only in the browser
    browserOnly(f: () => void) {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                f();
            });
        }
    }

    ngAfterViewInit() {
        console.log("am5charts running ...");

        // Chart code goes in here
        this.browserOnly(() => {
            let root = am5.Root.new("chartdiv");

            root.setThemes([am5themes_Animated.new(root)]);


            var data = [{
                name: "Shubhendra",
                children: [{
                  name: "Ravinder",
                  children: [{
                    name: "Dilpreet",
                    value: 23
                  }, {
                    name: "Divyanshu",
                    value: 25
                  }]
                }, {
                  name: "Leena",
                  children: [{
                    name: "Aashish",
                    value: 62
                  }, {
                    name: "Anshika",
                    value: 4
                  }]
                }, {
                  name: "Kriti",
                  children: [{
                    name: "Ankit",
                    value: 11
                  }, {
                    name: "Pradeep",
                    value: 92
                  }, {
                    name: "Nisha",
                    value: 17
                  }]
                }, {
                  name: "Rishi",
                  children: [{
                    name: "Ragini",
                    value: 420
                  }, {
                    name: "Raj",
                    value: 84
                  }, {
                    name: "Shruti",
                    value: 75
                  }]
                }]
              }];
              
              
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
                  orientation: "vertical"
                })
              );
              
              series.data.setAll(data);
              series.circles.template.setAll({
                radius: 40
              });
              series.set("selectedDataItem", series.dataItems[0]);

            this.root = root;
        });
    }

    ngOnDestroy() {
        // Clean up chart when the component is removed
        this.browserOnly(() => {
            if (this.root) {
                this.root.dispose();
            }
        });
    }
}
