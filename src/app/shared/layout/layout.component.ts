import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'layout-main',
  templateUrl: './layout.component.html',
  styles: [`
    `]
})
export class LayoutComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:no-empty
  constructor() { }
  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    // console.log('layout');
  }
  // tslint:disable-next-line:no-empty
  public ngAfterViewInit() { }
}
