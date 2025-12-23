import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
type ProgressSpinnerMode = 'determinate' | 'indeterminate';
type ProgressSpinnerColor = 'primary' | 'accent' | 'warn' | false; 

@Component({
  selector: 'giddh-progress-spinner',
  templateUrl: './giddh-progress-spinner.component.html',
  styleUrls: ['./giddh-progress-spinner.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ]
})
export class GiddhProgressSpinnerComponent  {
  /** The diameter of the spinner, in pixels. */
  @Input() public diameter: number = 20;
  /** The color of the spinner, based on the theme's color palette. */
  @Input() public color: ProgressSpinnerColor = 'primary';
  /** The mode of the spinner; can be 'determinate' or 'indeterminate'. */
  @Input() public mode: ProgressSpinnerMode = 'indeterminate';
  /** The value of the spinner, used in 'determinate' mode to indicate progress. */
  @Input() public value: number = 50;

  constructor() { }
}