import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { VirtualScrollComponent } from './virtual-scroll';
import { IOption } from './sh-options.interface';

@Component({
  selector: 'sh-select-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="menu" *ngIf="isOpen && _rows" style="min-height: 35px;background-color: white">
      <!--virtual-->
      <virtual-scroll [items]="_rows" (update)="viewPortItems = $event"
                      [style.height]="math.min(290,38 * _rows.length) + 'px'"
                      style="display: block">
        <div class="item"
             *ngFor="let row of viewPortItems"
             [class.selected]="selectedValues?.indexOf(row) !== -1"
             (click)="toggleSelected(row)">
          {{row.label}}
        </div>
      </virtual-scroll>
    </div>`,
  styles: [`.menu {
    margin: 0;
    padding: 0;
    position: absolute;
    background-color: white;
    width: 100%;
    max-height: 300px;
    overflow: auto;
    box-sizing: border-box;
    z-index: 999;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, .15);
    border-bottom: 1px solid rgba(34, 36, 38, .15);
    border-left: 1px solid rgba(34, 36, 38, .15);
    border-right: 1px solid rgba(34, 36, 38, .15);
    border-radius: 0 0 2px 2px;
    min-width: max-content;
  }

  .item {
    padding: 4px;
    cursor: pointer;
    white-space: nowrap;
  }

  .item:hover {
    background-color: #efefef;
  }

  .item.selected {
    font-weight: 900;
  }`]
})
export class ShSelectMenuComponent {
  @Input() public selectedValues: any[];
  @Input() public isOpen: boolean;
  @Output() public noToggleClick: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(VirtualScrollComponent) public virtualScrollElm: VirtualScrollComponent;
  public math: any = Math;
  public _rows: IOption[];
  public viewPortItems: IOption[];

  @Input() set rows(val: IOption[]) {
    if (this.virtualScrollElm) {
      this.virtualScrollElm.scrollInto(this._rows[0]);
    }

    this._rows = val;

    if (this.virtualScrollElm) {
      this.virtualScrollElm.refresh();
    }
  }

  public toggleSelected(row) {
    this.noToggleClick.emit(row);
  }

}
