import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Component({
    selector: 'confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
    @Input() public title: string = '';
    @Input() public body: string = '';
    @Input() public ok: string = '';
    @Input() public cancel: string = '';

    @Output() public successCallBack: EventEmitter<any> = new EventEmitter();
    @Output() public cancelCallBack: EventEmitter<any> = new EventEmitter();
    /** This will hold the permanently delete message */
    @Input() public permanentlyDeleteMessage: string = "";

    // tslint:disable-next-line:no-empty
    constructor(private store: Store<AppState>) {
    }

    /**
     * Initializes the component
     *
     * @memberof ConfirmModalComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.commonLocaleData), take(1)).subscribe((response) => {
            if (response) {
                if (!this.title) {
                    this.title = response.app_confirmation;
                }
                if (!this.ok) {
                    this.ok = response.app_yes;
                }
                if (!this.cancel) {
                    this.cancel = response.app_no;
                }
                if (!this.permanentlyDeleteMessage) {
                    this.permanentlyDeleteMessage = response.app_permanently_delete_message;
                }
            }
        });
    }

    public onSuccess(e: Event) {
        this.successCallBack.emit(e);
    }

    public onCancel(e: Event) {
        this.cancelCallBack.emit(e);
    }

    /**
     * Removes modal-open class on component destroy
     * 
     * @memberof ConfirmModalComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('modal-open');
    }
}
