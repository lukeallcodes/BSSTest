import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
let ClientsListComponent = class ClientsListComponent {
    constructor(clientService) {
        this.clientService = clientService;
        this.clients$ = new Observable();
    }
    ngOnInit() {
        this.fetchClients();
    }
    deleteClient(id) {
        this.clientService.deleteClient(id).subscribe({
            next: () => this.fetchClients()
        });
    }
    fetchClients() {
        this.clients$ = this.clientService.getClients();
    }
};
ClientsListComponent = __decorate([
    Component({
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
], ClientsListComponent);
export { ClientsListComponent };
//# sourceMappingURL=clients-list.component.js.map