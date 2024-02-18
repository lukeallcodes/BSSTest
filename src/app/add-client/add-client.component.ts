import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../client'; // Assuming you have a Client model
import { ClientService } from '../client.service'; // And a corresponding ClientService
import { FormGroup, FormsModule } from '@angular/forms';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [ClientFormComponent,FormsModule],
  template: `
    <h2 class="text-center m-5">Add a New Client</h2>
    <app-client-form (formSubmitted)="addClient($event)"></app-client-form>
  `
})
export class AddClientComponent {
  
  constructor(
    private router: Router,
    private clientService: ClientService // Use ClientService
  ) { }

  addClient(client: Client) {
    this.clientService.createClient(client) // Use createClient method
      .subscribe({
        next: () => {
          this.router.navigate(['']); // Update the navigation path
        },
        error: (error) => {
          alert("Failed to create client");
          console.error(error);
        }
      });
  }
}
