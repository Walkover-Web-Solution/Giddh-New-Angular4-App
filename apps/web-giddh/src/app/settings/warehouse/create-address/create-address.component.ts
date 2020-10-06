import { Component, OnInit, EventEmitter} from '@angular/core';

@Component({
    selector: 'create-address',
    templateUrl: './create-address.component.html',
    styleUrls: ['./create-address.component.scss'],
})
export class CreateAddressComponent implements OnInit {
    public accountAsideMenuState: string = 'out';
    public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public ngOnInit(): void {

    }
    public closeAsidePane(event) {
        this.ngOnDestroy();
        this.closeAsideEvent.emit(event);
    }
    public toggleAccountAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }
    public toggleBodyClass(): void {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }
    public ngOnDestroy(): void {
    }
}
