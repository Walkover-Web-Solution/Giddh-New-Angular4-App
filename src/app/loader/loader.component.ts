import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { LoaderService } from './loader.service';
import { LoaderState } from './loader';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { Router, NavigationStart, NavigationEnd, RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'giddh-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoaderComponent implements OnInit, OnDestroy {

  public showLoader: boolean = false;
  public accountInProgress$: Observable<boolean> = of(false);
  public navigationEnd$: Observable<boolean> = of(false);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private loaderService: LoaderService,
    private cdref: ChangeDetectorRef,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.accountInProgress$ = this.store.select( p => p.ledger.accountInprogress).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.loaderService.loaderState.pipe(takeUntil(this.destroyed$)).subscribe((state: LoaderState) => {
      if (state.show) {
        this.showLoader = true;
      } else {
        this.showLoader = false;
      }
      this.cdref.detectChanges();
    });

    this.router.events.subscribe(a => {
      if (a instanceof NavigationStart) {
        return this.navigationEnd$ = of(false);
      }
      if (a instanceof RouteConfigLoadEnd || a instanceof NavigationEnd) {
        return this.navigationEnd$ = of(true);
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
