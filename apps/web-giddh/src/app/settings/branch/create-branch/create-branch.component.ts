import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
@Component({
    selector: 'create-branch',
    templateUrl: './create-branch.component.html',
    styleUrls: ['./create-branch.component.scss'],
})

export class CreateWarehouseComponent implements OnInit {

    public accountAsideMenuState: string = 'out';

    public ngOnInit(): void {

    }

    public openCreateAddressAside() {
        this.toggleAccountAsidePane();
    }

    public toggleAccountAsidePane(event?): void {
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
}
