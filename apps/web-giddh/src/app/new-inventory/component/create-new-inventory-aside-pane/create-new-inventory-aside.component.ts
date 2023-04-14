import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'aside-create-new-inventory',
    templateUrl: './create-new-inventory-aside.component.html',
    styleUrls: ['./create-new-inventory-aside.component.scss'],
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
    ]
})

export class CreateNewInventoryAsideComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* Hold module type*/
    @Input() public moduleType;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    constructor(private router: Router) { }

    public ngOnInit() {
    }

    public closeAsidePane(event?: any) {
        this.closeAsideEvent.emit(event);
    }
    /* Create group aside pane open function */
    public createGroupToggleAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.router.navigate(['/pages', 'new-inventory', this.moduleType, 'create']);
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
        this.closeAsidePane();
    }
    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        console.log(this.asideMenuState);
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }
}
