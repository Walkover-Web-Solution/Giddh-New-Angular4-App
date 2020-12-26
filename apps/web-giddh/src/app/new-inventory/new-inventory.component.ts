import { Component, OnInit } from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
@Component({
    selector: 'new-inventory',
    templateUrl: './new-inventory.component.html',
    styleUrls: ['./new-inventory.component.scss'],

})

export class NewInventoryComponent implements OnInit {

    /* More button dropdown */
    public moreBtnDropwon: BsDropdownDirective;
    /* show search input field full width */
    public inputFullWidth: boolean = true;


    /* show/hide funcation search input field */
    public searhcGroup(){
        this.inputFullWidth = !this.inputFullWidth
    }

    /* Aside pane state*/
    public asideMenuState: string = 'out';

    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /* Aside pane open function */
    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create group aside pane open function */
    public createGroupToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create item aside pane open function */
    public createItemToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create unit aside pane open function */
    public createUnitToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create combo aside pane open function */
    public createComboToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public ngOnInit() {

    }
}
