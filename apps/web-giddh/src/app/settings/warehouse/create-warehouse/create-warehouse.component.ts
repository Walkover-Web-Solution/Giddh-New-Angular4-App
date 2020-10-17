import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'create-warehouse',
    templateUrl: './create-warehouse.component.html',
    styleUrls: ['./create-warehouse.component.scss'],
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
