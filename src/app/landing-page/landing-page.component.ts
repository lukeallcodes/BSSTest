import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // Ensure the path is correct
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <h1>Janitorial Management Application</h1>
    
    <div *ngIf="!showLoginForm && !showRegisterForm">
      <button (click)="showLogin()">Login</button>
      <button (click)="showRegister()">Register</button>
    </div>

    <div *ngIf="showLoginForm">
      <input [(ngModel)]="user.email" type="email" placeholder="Email">
      <input [(ngModel)]="user.password" type="password" placeholder="Password">
      <button (click)="login()">Login</button>
    </div>

    <div *ngIf="showRegisterForm">
      <input [(ngModel)]="user.firstname" type="text" placeholder="First Name">
      <input [(ngModel)]="user.lastname" type="text" placeholder="Last Name">
      <input [(ngModel)]="user.email" type="email" placeholder="Email">
      <input [(ngModel)]="user.password" type="password" placeholder="Password">
      <select [(ngModel)]="user.role">
        <option value="" disabled selected>Select your role</option>
        <option value="superuser">Superuser</option>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
      </select>
      <button (click)="register()">Register</button>
    </div>
  `,
  styles: ``
})
export class LandingPageComponent {
  user = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: ''
  };
  showLoginForm = false;
  showRegisterForm = false;

  constructor(private authService: AuthService, private router: Router) {}

  showLogin() {
    this.showLoginForm = true;
    this.showRegisterForm = false;
  }

  showRegister() {
    this.showRegisterForm = true;
    this.showLoginForm = false;
  }

  login() {
    const credentials = { email: this.user.email, password: this.user.password };
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.navigateToDashboard(response.role, response.clientid, response.userID);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  register() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        // Here you might want to automatically log the user in or navigate them to a specific page
        // For demonstration, we'll navigate them to the dashboard based on their role
        // Note: Ensure your backend returns the user's role upon successful registration if you wish to navigate directly
        this.navigateToDashboard(this.user.role, response.clientid, response.userID);
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }

  navigateToDashboard(role: string, clientid: string, userID: string) {
    switch (role) {
      case 'superuser':
        this.router.navigate(['/superuser-dashboard']);
        break;
      case 'manager':
        this.router.navigate(['/client/', clientid]);
        break;
      case 'employee':
        this.router.navigate(['/employee/', userID]);
        break;
      default:
        console.error('Unknown role', role);
        // Optionally handle unknown role or redirect to a default route
        break;
    }
  }
}
