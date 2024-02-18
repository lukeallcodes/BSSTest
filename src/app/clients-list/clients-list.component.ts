import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
  <h2 class="text-center m-5">Clients List</h2>

  <div class="layout">
    <table class="table">
      <thead>
      <tr>
       <td>Client Name </td> <td> Actions </td></tr>
      </thead>
      <tbody>
      <tr *ngFor="let client of clients$ | async">
      <td>{{ client.clientname }}</td>
      
      <td>
        <button class="btn btn-info me-1" [routerLink]="['/clients', client._id]">View</button>
        <button class="btn btn-primary me-1" [routerLink]="['edit/', client._id]">Edit</button>
        <button class="btn btn-danger" (click)="deleteClient(client._id || '')">Delete</button>
      </td>
    </tr>
    
      </tbody>
    </table>
    <button class="btn btn-primary mt-3" [routerLink]="['new']">Add a New Client</button>
    </div>

    
  `
})


export class ClientsListComponent implements OnInit {
  clients$: Observable<Client[]> = new Observable();

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.fetchClients();
    
  }

  deleteClient(id: string): void {
    this.clientService.deleteClient(id).subscribe({
      next: () => this.fetchClients()
    });
  }

  private fetchClients(): void {
    
    this.clients$ = this.clientService.getClients();
    
  }
  
  
}
