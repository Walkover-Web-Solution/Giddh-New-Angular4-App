import { Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from './loader.service';
import { LoaderState } from './loader';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'giddh-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit, AfterContentInit {

  public showLoader: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private loaderService: LoaderService
  ) {
  }

  public ngOnInit() {
    this.loaderService.loaderState.takeUntil(this.destroyed$).subscribe((state: LoaderState) => {
      if (state.show) {
        this.showLoader = true;
      }
    });
  }

  public ngAfterContentInit() {
    this.loaderService.loaderState.takeUntil(this.destroyed$).subscribe((state: LoaderState) => {
      if (!state.show) {
        this.showLoader = false;
      }
    });
  }

}
