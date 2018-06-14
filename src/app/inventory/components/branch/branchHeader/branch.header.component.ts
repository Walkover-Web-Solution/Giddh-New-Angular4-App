import { AppState } from '../store/roots';
import { animate, Component, OnDestroy, OnInit, state, style, transition, trigger } from '@angular/core';

@Component({
  selector: 'branch-header',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ],
  template: `
    <div class="stock-bar inline pull-right">
      <div class="">
        <div class="pull-right">
          <button type="button" class="btn btn-primary" (click)="toggleBranchAsidePane($event)">New</button>
        </div>
      </div>
    </div>
    <div class="aside-overlay" *ngIf="branchAsideMenuState === 'in'"></div>
    <branch-destination *ngIf="branchAsideMenuState === 'in'" [class]="branchAsideMenuState" [@slideInOut]="branchAsideMenuState" (closeAsideEvent)="toggleBranchAsidePane($event)"></branch-destination>
  `
})
export class BranchHeaderComponent implements OnInit, OnDestroy {
  public branchAsideMenuState: string = 'out';
  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public toggleBodyClass() {
    if (this.branchAsideMenuState === 'in' || this.branchAsideMenuState === 'in') {
      document.querySelector('body').classList.add('fixed');
    }else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public toggleBranchAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.branchAsideMenuState = this.branchAsideMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public ngOnDestroy() {
    //
  }
}
