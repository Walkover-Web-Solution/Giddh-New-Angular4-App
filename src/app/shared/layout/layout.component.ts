import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'layout-main',
  templateUrl: './layout.component.html',
  styles: [`
  #content_wrapper {
    margin-left: 46px;
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
