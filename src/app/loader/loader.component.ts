import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from './loader.service';
import { LoaderState } from './loader';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'giddh-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoaderComponent implements OnInit, OnDestroy {

  public showLoader: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private loaderService: LoaderService,
    private cdref: ChangeDetectorRef
  ) {
  }

  public ngOnInit() {
    this.loaderService.loaderState.takeUntil(this.destroyed$).subscribe((state: LoaderState) => {
      if (state.show) {
        this.showLoader = true;
      } else {
        this.showLoader = false;
      }
      this.cdref.detectChanges();
    });
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
