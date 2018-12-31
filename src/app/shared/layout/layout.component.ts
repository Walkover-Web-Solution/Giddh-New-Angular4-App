import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'layout-main',
  templateUrl: './layout.component.html',
  styles: [`
  #content_wrapper {
    min-height: calc(100vh - 54px);
    height: 100%;
    padding-bottom: 80px;
  }
    `]
})
export class LayoutComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:no-empty
  constructor() {
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    // console.log('layout');
  }

  // tslint:disable-next-line:no-empty
  public ngAfterViewInit() {
  }
}
