import { Component, EventEmitter, Output } from '@angular/core';

export interface PeriodicElement {
    name: string;
    transportid: string;
    symbol: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {name: 'aaaaa', transportid: '11AAAAAAAAAAAAA', symbol: 'H'},
    {name: 'AAAAAAAAAA', transportid: '244242424242422', symbol: 'He'},
    {name: 'bbbbb', transportid: '22AAAAAAAAAAAAA', symbol: 'Li'},
    {name: 'ccccc', transportid: '12AAAAAAAAAAAAA', symbol: 'Be'},
    {name: 'ddddd', transportid:'13AAAAAAAAAAAAA', symbol: 'B'},
    {name: 'eeeee', transportid: '11AAAAAABAAAAAA', symbol: 'C'},
    {name: 'fffff', transportid: '11AAASAAAAAAAAA', symbol: 'N'},
    {name: 'ggggg', transportid: '11AACAAAAAAAAAA', symbol: 'O'},
    {name: 'hhhhh', transportid: '11AAAAAAAAADAAA', symbol: 'F'},
    {name: 'iiiii', transportid: '11AAAAAAAAAAAAF', symbol: 'Ne'},
  ];



@Component({
    selector: 'aside-manage-transport',
    templateUrl: './aside-manage-transport.component.html',
    styleUrls: ['./aside-manage-transport.component.scss']
})
export class AsideManageTransportComponent {
    displayedColumns: string[] = ['name', 'transportid', 'symbol'];
    dataSource = ELEMENT_DATA;
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Emits modal close event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    /**
     * Closes aside pane
     *
     * @param {*} event
     * @memberof AsideManageTransportComponent
     */
    public closeAsidePane(event: any) {
        this.closeAsideEvent.emit(event);
    }
        /**
     * This will use for page change
     *
     * @param {*} event
     * @memberof AsideManageTransportComponent
     */
        public pageChanged(event: any): void {
    }
}