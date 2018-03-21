import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'Arpit',
  styles: [``],
  template: ``
})
export class ArpitComponent {

  public localState: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router) {
    console.log('The route in ArpitComponent is :', this.route);
    this.router.navigate(['/login']);
  }
}
