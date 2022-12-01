import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'aside-create-new-inventory',
    templateUrl: './create-new-inventory-aside.component.html',
    styleUrls: ['./create-new-inventory-aside.component.scss'],

})

export class CreateNewInventoryAsideComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }
    /* Create group aside pane open function */
    public createGroupToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }
    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }
    public ngOnInit() {

    }
}
