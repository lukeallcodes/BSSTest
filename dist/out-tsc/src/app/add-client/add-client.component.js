import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientFormComponent } from '../client-form/client-form.component';
let AddClientComponent = class AddClientComponent {
    constructor(router, clientService // Use ClientService
    ) {
        this.router = router;
        this.clientService = clientService;
    }
    addClient(client) {
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
};
AddClientComponent = __decorate([
    Component({
        selector: 'app-add-client',
        standalone: true,
        imports: [ClientFormComponent, FormsModule],
        template: `
    <h2 class="text-center m-5">Add a New Client</h2>
    <app-client-form (formSubmitted)="addClient($event)"></app-client-form>
  `
    })
], AddClientComponent);
export { AddClientComponent };
//# sourceMappingURL=add-client.component.js.map