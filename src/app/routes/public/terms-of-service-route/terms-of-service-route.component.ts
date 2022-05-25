import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-of-service-route',
  templateUrl: './terms-of-service-route.component.html',
  styles: [`
  .terms-and-conditions-content p {
      margin-bottom: 1rem;
  }
  `]
})
export class TermsOfServiceRouteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
