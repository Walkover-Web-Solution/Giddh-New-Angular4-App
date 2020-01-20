import { AfterContentInit, Component, ContentChildren, EventEmitter, Output, QueryList } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';

@Component({
    selector: 'form-wizard',
    template:
        `<div class="card">
    <div class="card-block">
      <ng-content></ng-content>
    </div>
    <div class="card-footer" [hidden]="isCompleted">
      <ul class="nav nav-justified steps-indicator step-{{steps.length}}">
        <li class="nav-item" *ngFor="let step of steps" [ngClass]="{'active': step.isActive, 'enabled': !step.isDisabled, 'disabled': step.isDisabled, 'completed': isCompleted}">
          <a (click)="goToStep(step)">{{step.title}}</a>
        </li>
      </ul>
    </div>
  </div>`
    ,
    styles: [
        '.card { height: 100%; }',
        '.card-header { background-color: #fff; padding: 0; font-size: 1.25rem; }',
        // '.card-block { overflow-y: auto; }',
        '.card-footer { background-color: #fff; border-top: 0 none; }',
        '.nav-item { padding: 1rem 0rem; }',
        '.disabled { color: #ccc; }',
        '.nav-item[_ngcontent-c8] {border-bottom: 0;}',
        '.completed { cursor: default; }',
        '.steps-indicator { pointer-events: none }'
    ]
})
export class WizardComponent implements AfterContentInit {
    @ContentChildren(WizardStepComponent)
    public wizardSteps: QueryList<WizardStepComponent>;

    @Output() public onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();

    // tslint:disable-next-line:no-empty
    constructor() {
    }

    private _steps: WizardStepComponent[] = [];

    get steps(): WizardStepComponent[] {
        return this._steps.filter(step => !step.hidden);
    }

    private _isCompleted: boolean = false;

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    get activeStep(): WizardStepComponent {
        return this.steps.find(step => step.isActive);
    }

    set activeStep(step: WizardStepComponent) {
        if (step !== this.activeStep && !step.isDisabled) {
            this.activeStep.isActive = false;
            step.isActive = true;
            this.onStepChanged.emit(step);
        }
    }

    public get activeStepIndex(): number {
        return this.steps.indexOf(this.activeStep);
    }

    get hasNextStep(): boolean {
        return this.activeStepIndex < this.steps.length - 1;
    }

    get hasPrevStep(): boolean {
        return this.activeStepIndex > 0;
    }

    public ngAfterContentInit() {
        this.wizardSteps.forEach(step => this._steps.push(step));
        this.steps[0].isActive = true;
    }

    public goToStep(step: WizardStepComponent): void {
        if (!this.isCompleted) {
            this.activeStep = step;
        }
    }

    public next(): void {
        if (this.hasNextStep) {
            let nextStep: WizardStepComponent = this.steps[this.activeStepIndex + 1];
            this.activeStep.onNext.emit();
            nextStep.isDisabled = false;
            this.activeStep = nextStep;
        }
    }

    public previous(): void {
        if (this.hasPrevStep) {
            let prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
            this.activeStep.onPrev.emit();
            prevStep.isDisabled = false;
            this.activeStep = prevStep;
        }
    }

    public complete(): void {
        this.activeStep.onComplete.emit();
        this._isCompleted = true;
    }

}
