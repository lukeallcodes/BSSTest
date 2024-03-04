import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClientFormComponent } from '../client-form/client-form.component';
import { FormsModule } from '@angular/forms';
let EditClientComponent = class EditClientComponent {
    constructor(router, route, clientService) {
        this.router = router;
        this.route = route;
        this.clientService = clientService;
        this.client = new BehaviorSubject({});
    }
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
    editClient(client) {
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
};
EditClientComponent = __decorate([
    Component({
        selector: 'app-edit-client',
        standalone: true,
        imports: [ClientFormComponent, FormsModule],
        template: `
    <h2 class="text-center m-5">Edit a Client</h2>
    <app-client-form [initialState]="client" (formSubmitted)="editClient($event)"></app-client-form>
  `
    })
], EditClientComponent);
export { EditClientComponent };
//# sourceMappingURL=edit-client.component.js.map