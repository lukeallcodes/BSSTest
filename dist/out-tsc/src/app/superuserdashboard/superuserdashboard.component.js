import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ClientsListComponent } from '../clients-list/clients-list.component';
let SuperuserdashboardComponent = class SuperuserdashboardComponent {
};
SuperuserdashboardComponent = __decorate([
    Component({
        selector: 'app-superuserdashboard',
        standalone: true,
        imports: [ClientsListComponent],
        template: `
  <app-clients-list></app-clients-list>
  `,
        styles: ``
    })
], SuperuserdashboardComponent);
export { SuperuserdashboardComponent };
//# sourceMappingURL=superuserdashboard.component.js.map