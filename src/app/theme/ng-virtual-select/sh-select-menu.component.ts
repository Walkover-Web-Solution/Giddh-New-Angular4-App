import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { VirtualScrollComponent } from './virtual-scroll';
import { IOption } from './sh-options.interface';

@Component({
  selector: 'sh-select-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sh-select-menu.component.html',
  styleUrls: [`./sh-select-menu.component.css`]
})
export class ShSelectMenuComponent {
  @Input() public selectedValues: any[];
  @Input() public isOpen: boolean;
  @Input() public optionTemplate: TemplateRef<any>;
  @Input() public notFoundMsg: string;
  @Input() public noResultLinkEnabled: boolean;

  @Output() public noToggleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() public noResultClicked = new EventEmitter<null>();
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
