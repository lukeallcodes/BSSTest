import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../client'; // Update to Client model
import { ClientService } from '../client.service'; // Update to ClientService
import { ClientFormComponent } from '../client-form/client-form.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [ClientFormComponent,FormsModule],
  template: `
    <h2 class="text-center m-5">Edit a Client</h2>
    <app-client-form [initialState]="client" (formSubmitted)="editClient($event)"></app-client-form>
  `
})
export class EditClientComponent implements OnInit {
  client: BehaviorSubject<Client> = new BehaviorSubject({} as Client);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService, // Use ClientService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
      return;
    }

    this.clientService.getClient(id).subscribe((client) => {
      this.client.next(client);
    });
  }

  editClient(client: Client) {
    this.clientService.updateClient(this.client.value._id || '', client)
      .subscribe({
        next: () => {
          this.router.navigate(['/clients']); // Update the navigation path
        },
        error: (error) => {
          alert('Failed to update client');
          console.error(error);
        }
      });
  }
}
