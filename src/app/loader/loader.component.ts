import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from './loader.service';
import { LoaderState } from './loader';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'giddh-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit {

  public showLoader: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private loaderService: LoaderService,
    private cdref: ChangeDetectorRef
  ) {
  }

  public ngOnInit() {
    this.loaderService.loaderState.takeUntil(this.destroyed$).debounceTime(100).subscribe((state: LoaderState) => {
      if (state.show) {
        this.showLoader = true;
      }else {
        this.showLoader = false;
      }
      this.cdref.detectChanges();
    });
  }

}
