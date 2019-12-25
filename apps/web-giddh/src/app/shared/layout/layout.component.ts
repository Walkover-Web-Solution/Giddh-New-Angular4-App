import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
	selector: 'layout-main',
	templateUrl: './layout.component.html',
	styles: [`
  #content_wrapper {
    min-height: calc(100vh - 120px);
    height: 100%;
    padding-bottom: 80px;
  }
    `]
})
export class LayoutComponent implements AfterViewInit {
	@Input() public sideMenu: { isopen: boolean } = { isopen: true };
	// tslint:disable-next-line:no-empty
	constructor() {
	}

	// tslint:disable-next-line:no-empty
	public ngAfterViewInit() {
	}
}
