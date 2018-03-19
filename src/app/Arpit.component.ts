import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'Arpit',
  styles: [`
  `],
  template: `
  `
})
export class ArpitComponent {

  public localState: any;

  constructor(public route: ActivatedRoute) {
    console.log('The route in ArpitComponent is :', this.route);
  }

}
