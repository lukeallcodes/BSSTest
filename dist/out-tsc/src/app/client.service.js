import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError, tap } from 'rxjs';
let ClientService = class ClientService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.url = 'http://localhost:5200';
        this.clients$ = new BehaviorSubject([]);
    }
    refreshClients() {
        this.httpClient.get(`${this.url}/clients`)
            .pipe(catchError(this.handleError))
            .subscribe(clients => {
            this.clients$.next(clients);
        });
    }
    getClients() {
        this.refreshClients();
        return this.clients$.asObservable();
    }
    getClient(id) {
        return this.httpClient.get(`${this.url}/clients/${id}`).pipe(catchError(this.handleError));
    }
    createClient(client) {
        return this.httpClient.post(`${this.url}/clients`, client, { responseType: 'text' }).pipe(catchError(this.handleError));
    }
    updateClient(id, client) {
        return this.httpClient.put(`${this.url}/clients/${id}`, client, { responseType: 'text' }).pipe(catchError(this.handleError));
    }
    deleteClient(id) {
        return this.httpClient.delete(`${this.url}/clients/${id}`, { responseType: 'text' }).pipe(tap(() => this.refreshClients()), catchError(this.handleError));
    }
    // Generic error handling method
    handleError(error) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('An error occurred; please try again later.'));
    }
    // New method to fetch user info based on userId
    getNewUserInfo(userId) {
        return this.httpClient.get(`${this.url}/users/${userId}`).pipe(catchError(this.handleError));
    }
    checkIn(zoneId, userId) {
        return this.httpClient.post(`${this.url}/check-in`, { zoneId, userId });
    }
    checkOut(zoneId, userId) {
        return this.httpClient.post(`${this.url}/check-out`, { zoneId, userId });
    }
};
ClientService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ClientService);
export { ClientService };
//# sourceMappingURL=client.service.js.map