import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError, tap } from 'rxjs';
import { Client } from './client';
import { NewUser } from './newuser';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private url = '/api';
  private clients$ = new BehaviorSubject<Client[]>([]);

  constructor(private httpClient: HttpClient) { }

  private refreshClients() {
    this.httpClient.get<Client[]>(`${this.url}/clients`)
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(clients => {
        this.clients$.next(clients);
      });
  }

  getClients(): Observable<Client[]> {
    this.refreshClients();
    return this.clients$.asObservable();
  }

  getClient(id: string): Observable<Client> {
    return this.httpClient.get<Client>(`${this.url}/clients/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createClient(client: Client): Observable<string> {
    return this.httpClient.post(`${this.url}/clients`, client, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  updateClient(id: string, client: Client): Observable<string> {
    return this.httpClient.put(`${this.url}/clients/${id}`, client, { responseType: 'text' }).pipe(
        catchError(this.handleError)
    );
  }

  deleteClient(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/clients/${id}`, { responseType: 'text' }).pipe(
      tap(() => this.refreshClients()),
      catchError(this.handleError)
    );
  }

  // Generic error handling method
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred; please try again later.'));
  }

  // New method to fetch user info based on userId
  getNewUserInfo(userId: string): Observable<NewUser> {
    return this.httpClient.get<NewUser>(`${this.url}/users/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  checkIn(zoneId: string, userId: string): Observable<any> {
    return this.httpClient.post(`${this.url}/check-in`, { zoneId, userId });
  }

  checkOut(zoneId: string, userId: string): Observable<any> {
    return this.httpClient.post(`${this.url}/check-out`, { zoneId, userId });
  }
}
