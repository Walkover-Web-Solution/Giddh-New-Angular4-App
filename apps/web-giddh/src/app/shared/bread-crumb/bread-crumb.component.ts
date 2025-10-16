import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter, ReplaySubject, takeUntil } from 'rxjs';
import { BreadCrumbService } from '../../services/bread-crum.service';

@Component({
  selector: 'bread-crumb',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './bread-crumb.component.html'
})
export class BreadCrumbComponent implements OnInit, OnDestroy {
  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(
    public breadCrumbService: BreadCrumbService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Restore on reload or return
    this.breadCrumbService.getBreadCrumbPath();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroyed$)
      )
      .subscribe((event: any) => {
        const url: string = event.urlAfterRedirects || event.url || '';
        const currentPath = url.split('?')[0];
        const isKnown = this.breadCrumbService.hasPath(currentPath);

        // Only clear if this route doesn't exist in breadcrumb
        if (!isKnown) {
          this.breadCrumbService.clear();
        }
      });
  }

  navigateTo(index: number): void {
    const pathList = this.breadCrumbService.getBreadCrumbPath();
    const target = pathList[index];
    this.breadCrumbService.setBreadCrumbPath(pathList.slice(0, index + 1));
    this.router.navigate([target.url], { queryParams: target.queryParams });
  }

  trackByUrl(_: number, item: { url: string }): string {
    return item.url;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

