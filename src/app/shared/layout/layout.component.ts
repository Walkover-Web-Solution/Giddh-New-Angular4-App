import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'layout-main',
  templateUrl: './layout.component.html',
  styles: [`
    `]
})
export class LayoutComponent implements OnInit, AfterViewInit {
  public title: Observable<string>;
  public languages: any[] = [{ name: 'ENGLISH', value: 'en' }, { name: 'DUTCH', value: 'nl' }];

  /**
   *
   */
  // tslint:disable-next-line:no-empty
  constructor() { }
  // tslint:disable-next-line:no-empty
  public ngOnInit() { }
  // tslint:disable-next-line:no-empty
  public ngAfterViewInit() { }
}
