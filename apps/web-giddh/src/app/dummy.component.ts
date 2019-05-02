import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dummy',
  styles: [`
  `],
  template: `
  `
})
export class DummyComponent {

  public localState: any;

  constructor(public route: ActivatedRoute) {
  }
}
