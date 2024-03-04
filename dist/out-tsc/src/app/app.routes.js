import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { AddClientComponent } from './add-client/add-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ManagerdashboardComponent } from './managerdashboard/managerdashboard.component';
import { EmployeedashboardComponent } from './employeedashboard/employeedashboard.component';
export const routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingPageComponent },
    { path: 'clients', component: ClientsListComponent },
    { path: 'clients/new', component: AddClientComponent },
    { path: 'clients/edit/:id', component: EditClientComponent },
    { path: 'clients/:id', component: ClientDetailComponent },
    { path: 'superuser-dashboard', redirectTo: 'clients', pathMatch: 'full' },
    { path: 'client/:id', component: ManagerdashboardComponent },
    { path: 'employee/:id', component: EmployeedashboardComponent },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app.routes.js.map