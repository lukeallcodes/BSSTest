import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../client.service';
import { Client } from '../client';
import { Location } from '../location';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Zone } from '../zone';
import { Observable, catchError, map, of } from 'rxjs';
import * as mongodb from "mongodb";
import { NewUser } from '../newuser';
import { UserService } from '../user.service';
import { User } from '../user';
import QRCode from 'qrcode';
@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="client-detail">
      <h1>{{ client?.clientname }}'s Details</h1>

     
  <h2>Associated Users</h2>
  <ul>
    <li *ngFor="let user of users">
      {{ user.firstname }} {{ user.lastname }} - {{ user.role }} - {{ user.email }} <button class="btn btn-danger btn-sm" (click)="deleteUser(user._id || '')">Delete</button>
    </li>
  </ul>



      <!-- Add below your existing template content -->
      <div class="add-newuser">
      <input type="text" [(ngModel)]="newUserFirstName" placeholder="First Name">
      <input type="text" [(ngModel)]="newUserLastName" placeholder="Last Name">
      <input type="text" [(ngModel)]="newUserRole" placeholder="Role">
      <input type="email" [(ngModel)]="newUserEmail" placeholder="Email">
      <input type="password" [(ngModel)]="newUserPassword" placeholder="Password">
      <button (click)="addUser()">Add User</button>
    </div>


      <ul class="location-list">
        <li *ngFor="let location of client?.location; let i = index" class="location-item">
          <span class="location-name">{{ location.locationname }}</span>
          <div class="location-actions">
            <button class="btn btn-warning btn-sm" (click)="editLocation(i)">Edit</button>
            <button class="btn btn-danger btn-sm" (click)="deleteLocation(i)">Delete</button>
            <button class="btn btn-info btn-sm" (click)="viewZones(location)">View Zones</button>
          </div>
        </li>
      </ul>
      <div class="add-location">
        <input type="text" [(ngModel)]="newLocationName" class="location-input" placeholder="Location Name">
        <button class="btn btn-primary btn-sm" (click)="addLocation()">Add Location</button>
      </div>
      <!-- Display the selected location's zone -->
      <!-- Display the selected location's zone -->
<div class="zone-display" *ngIf="selectedLocation">
  <h2>{{ selectedLocation.locationname }} Zones</h2>
  <ul class="zone-list">
    <li *ngFor="let zone of selectedLocation.zone; let j = index" class="zone-item">
      {{ zone.zonename }}
      <!-- Conditionally display QR code or a missing message -->
      <div *ngIf="zone.qrcode; else noQrCode">
        <img [src]="zone.qrcode" alt="QR Code" style="width: 100px; height: 100px;">
      </div>
      <ng-template #noQrCode>
        <p>Missing QR Code</p>
      </ng-template>
      <button class="btn btn-success btn-sm" (click)="viewSteps(zone)">View Steps</button>
    </li>
  </ul>
  <!-- Input field to add new zone -->
  <div>
    <input type="text" [(ngModel)]="newZoneName" class="zone-input" placeholder="New Zone Name">
    <button class="btn btn-primary btn-sm" (click)="addZone()">Add Zone</button>
  </div>
</div>

      <!-- Display the selected zone's steps -->
      <div class="steps-display" *ngIf="selectedZone">
        <h2>{{ selectedZone.zonename }} Steps</h2>
        <ul class="steps-list">
          <li *ngFor="let step of selectedZone.steps" class="step-item">
            {{ step }}
          </li>
        </ul>
        <!-- Input field to add new steps -->
        <div>
          <input type="text" [(ngModel)]="newStep" class="step-input" placeholder="New Step">
          <button class="btn btn-primary btn-sm" (click)="addStep()">Add Step</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    // Styles remain the same
  ],
})
export class ClientDetailComponent implements OnInit {
  client: Client | undefined;
  newLocationName: string = '';
  selectedLocation: Location | undefined;
  newZoneName: string = '';
  selectedZone: Zone | undefined;
  newStep: string = '';
  newUserFirstName: string = '';
  newUserLastName: string = '';
  newUserRole: string = '';
  newUserEmail: string = '';
  newUserPassword: string = '';
  users: NewUser[] = [];

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private userService: UserService, // Add this
    private router: Router,
    
  ) {}

  ngOnInit(): void {
    this.loadClient();
    // After loading the client, load associated users
    
  }
  
  private loadClient(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.clientService.getClient(clientId).subscribe((client) => {
        this.client = client;
        console.log("Loaded client: ", client);
        console.log("UserRefs: ", this.client.userRefs);
        if (this.client?.userRefs) {
      
          this.userService.fetchUsersByIds(this.client.userRefs).subscribe(users => {
            // Assume you have a users array in your component to hold these users
            this.users = users;
          });
        }
      });
    }
  }

  addUser(): void {
    const newUser: NewUser = {
      firstname: this.newUserFirstName,
      lastname: this.newUserLastName,
      role: this.newUserRole,
      email: this.newUserEmail,
      passwordHash: this.newUserPassword, // In a real app, ensure to handle passwords securely
      assignedlocations: [],
      clientid: this.client?._id,
      _id: '',
      assignedzones: []
    };
  
    this.userService.createNewUser(newUser).subscribe({
      next: (newuser) => {
        console.log("User created successfully", newuser);
  
        if (this.client && this.client.userRefs) {
          if (newuser._id) { // Check if _id is defined
            this.client.userRefs.push(newuser._id);
            console.log(this.client.userRefs[0]);
            this.updateClient(); // Update the client with the new userref
          }
        }
  
        // Optionally clear the form or redirect
      },
      error: (err) => console.error("Error creating newuser:", err),
    });
  }
  

// In ClientDetailComponent

updateUser(user: NewUser): void {
  this.userService.updateUser(user).subscribe({
    next: () => {
      console.log("User updated successfully");
      this.loadClient(); // Refresh the list of users
    },
    error: (err) => console.error("Error updating user:", err),
  });
}

deleteUser(userId: string): void {
  this.userService.deleteUser(userId).subscribe({
    next: () => {
      console.log("User deleted successfully");
      this.loadClient(); // Refresh the list of users
    },
    error: (err) => console.error("Error deleting user:", err),
  });
}


  editLocation(index: number): void {
    // Implement logic to edit a location
    // This might involve a separate component or a modal dialog
  }

  deleteLocation(index: number): void {
    if (this.client) {
      this.client.location.splice(index, 1);
      this.updateClient();
    }
  }

  private updateClient(): void {
    if (this.client && this.client._id) {
      this.clientService.updateClient(this.client._id.toString(), this.client).subscribe({
        next: () => this.loadClient(), // Reload the client
        error: (err) => console.error(err),
      });
    }
  }

  addLocation(): void {
    if (this.client) {
      if (!this.client.location) {
        this.client.location = [];
      }

      if (this.newLocationName) {
        const newLocation: Location = {
          locationname: this.newLocationName,
          zone: [],
          assignedusers: [],
          _id: ''
        };
        this.client.location.push(newLocation);

        this.updateClient();
      }
    }
  }

  viewZones(location: Location): void {
    this.selectedLocation = location;
  }

  addZone(): void {
    if (this.selectedLocation && this.newZoneName.trim()) {
      if (!this.selectedLocation.zone) {
        this.selectedLocation.zone = [];
      }
      const newZone: Zone = {
        zonename: this.newZoneName,
        steps: [],
        assignedusers: [],
        lastcheckin: '',
        lastcheckout: '',
        lastuser: '',
        timespent: '',
        qrcode: '', // This will be filled with the QR code data URL
        _id: '' // Assuming you're removing the assignment here as per the comment
      };
  
      // Generate a QR Code for the zone
      
          if(this.selectedLocation){
          // Now that the QR code is generated, add the zone to the selected location
          this.selectedLocation.zone.push(newZone);
          }
          // Reset the zone name input after adding
          this.newZoneName = '';
  
          // Call the method to persist changes, including adding the new zone
          this.updateClient();
        
    }
  }
  
  
  

  viewSteps(zone: Zone): void {
    this.selectedZone = zone;
  }

  addStep(): void {
    if (this.selectedZone) {
      if (!this.selectedZone.steps) {
        this.selectedZone.steps = [];
      }

      if (this.newStep) {
        this.selectedZone.steps.push(this.newStep);
        this.newStep = ''; // Clear the input field

        this.updateClient();
      }
    }
  }
}
