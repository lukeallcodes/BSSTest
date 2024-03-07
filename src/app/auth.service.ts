import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { RegisterResponse } from './register-response';
import { LoginResponse } from './login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = '/api'; // URL of your backend

  constructor(private http: HttpClient) { }

  register(user: { firstname: string, lastname: string, email: string, password: string, role: string }) {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, user);
  }
  

  login(credentials: { email: string, password: string }) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      
    );
  }
  


}
