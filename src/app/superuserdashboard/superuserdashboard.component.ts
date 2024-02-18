import { Component } from '@angular/core';
import { ClientsListComponent } from '../clients-list/clients-list.component';

@Component({
  selector: 'app-superuserdashboard',
  standalone: true,
  imports: [ClientsListComponent],
  template: `
  <app-clients-list></app-clients-list>
  `,
  styles: ``
})
export class SuperuserdashboardComponent {

}
