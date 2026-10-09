import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'aside-create-new-inventory',
    
    templateUrl: './create-new-inventory-aside.component.html',
    standalone: false,
    styleUrls: ['./create-new-inventory-aside.component.scss']
})
export class CreateNewInventoryAsideComponent implements OnInit {
    /* Close aside menu panel*/
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Holds inventory type module  */
    @Input() public moduleType;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;

    constructor(private router: Router) { }

    /**
     * This hook will use for intialization component
     *
     * @memberof CreateNewInventoryAsideComponent
     */
    public ngOnInit(): void {
    }

    /**
     * This will use for close aside menu panel
     *
     * @param {*} [event]
     * @memberof CreateNewInventoryAsideComponent
     */
    public closeAsidePane(event?: any): void {
        this.closeAsideEvent.emit(event);
    }

    /**
     * Create group aside pane open function
     *
     * @param {*} [event]
     * @memberof CreateNewInventoryAsideComponent
     */
    public createNewByAsidePanel(type?: any): void {
        if (type) {
            this.router.navigate(['/pages', 'inventory', 'v2', type, this.moduleType, 'create']);
        }
        this.closeAsidePane();
    }

    /**
     * This will use for translation complete
     *
     * @param {*} event
     * @memberof CreateNewInventoryAsideComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
        }
    }

    /**
     * This will use for open branch transfer mode
     *
     * @param {string} type
     * @memberof CreateNewInventoryAsideComponent
     */
    public openCreateBranchTransfer(type: string): void {
        if (type) {
            this.router.navigate(['/pages', 'inventory', 'v2', this.moduleType, type, 'create']);
        }
        this.closeAsidePane();
    }
}
