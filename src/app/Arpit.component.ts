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
    console.log('The route in ArpitComponent is :', this.route.snapshot);
    console.log('this.route.snapshot.url.toString() is :', this.route.snapshot.url.toString());
    if (this.route.snapshot.url.toString() === 'create') {
      console.log('Redirected by custom code');
      this.router.navigate(['/create']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
