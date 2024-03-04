import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatetimeComponent } from '../datetime/datetime.component';
let ManagerdashboardComponent = class ManagerdashboardComponent {
    constructor(clientService, userService, route) {
        this.clientService = clientService;
        this.userService = userService;
        this.route = route;
        this.users = [];
        this.assignedUsersForZone = [];
    }
    ngOnInit() {
        this.loadClientAndUsers();
    }
    loadClientAndUsers() {
        const clientId = this.route.snapshot.paramMap.get('id');
        if (clientId) {
            this.clientService.getClient(clientId).subscribe((client) => {
                this.client = client;
                if (client.userRefs && client.userRefs.length > 0) {
                    this.loadUsers(client.userRefs);
                }
            });
        }
    }
    unassignUserFromZone(userId, zone) {
        this.updateZoneUserAssignments([userId], zone, false);
    }
    getUsersForLocation(locationId) {
        return this.users.filter((user) => user.assignedlocations.includes(locationId));
    }
    loadUsers(userIds) {
        this.userService.fetchUsersByIds(userIds).subscribe((users) => {
            this.users = users;
        });
    }
    viewZones(location) {
        // Clear selectedZone when viewing zones for a different location
        this.selectedZone = undefined;
        this.selectedLocation = location;
        this.selectedZoneId = undefined; // Clear the selected zone ID
    }
    toggleSelectedZone(zoneId) {
        if (this.selectedZoneId === zoneId) {
            // If the clicked zone is already selected, clear the selection
            this.selectedZoneId = undefined;
            // Clear the assignedUsersForZone array
            this.assignedUsersForZone = [];
        }
        else {
            // Otherwise, set the clicked zone as the selected zone
            this.selectedZoneId = zoneId;
            // Load the assigned users for the selected zone
            this.loadAssignedUsersForZone(zoneId);
        }
    }
    loadAssignedUsersForZone(zoneId) {
        // Filter users who are assigned to the selected zone
        this.assignedUsersForZone = this.users.filter((user) => user.assignedzones?.includes(zoneId));
    }
    isZoneSelected(zoneId) {
        return this.selectedZoneId === zoneId;
    }
    submitAssignedUsers(selectElement, location) {
        const selectedUserIds = Array.from(selectElement.selectedOptions).map((option) => option.value);
        this.updateUserAssignments(selectedUserIds, location);
    }
    unassignUser(userId, location) {
        this.updateUserAssignments([userId], location, false);
    }
    getUserInfo(userId) {
        const user = this.users.find((user) => user._id === userId);
        return user
            ? `${user.firstname} ${user.lastname} - ${user.role} - ${user.email}`
            : 'User not found';
    }
    assignUsersToZone(selectElement, zone) {
        const selectedUserIds = Array.from(selectElement.selectedOptions).map((option) => option.value);
        this.updateZoneUserAssignments(selectedUserIds, zone);
    }
    // Helper method for updating user assignments to locations and zones
    updateUserAssignments(userIds, location, assign = true) {
        userIds.forEach(userId => {
            const user = this.users.find(user => user._id === userId);
            if (!user) {
                console.error('User not found:', userId);
                return;
            }
            if (assign) {
                if (!user.assignedlocations.includes(location._id)) {
                    user.assignedlocations.push(location._id);
                }
            }
            else {
                if (user.assignedlocations.includes(location._id)) {
                    user.assignedlocations = user.assignedlocations.filter(id => id !== location._id);
                    // Unassign user from all zones within the location
                    user.assignedzones = user.assignedzones.filter(zoneId => !location.zone.some(zone => zone._id === zoneId));
                }
            }
            this.userService.updateUser(user).subscribe();
        });
        // Update location's assigned users
        if (assign) {
            location.assignedusers = Array.from(new Set([...location.assignedusers, ...userIds]));
        }
        else {
            location.assignedusers = location.assignedusers.filter(id => !userIds.includes(id));
        }
        // Update the client if necessary
        if (this.client && this.client._id) {
            this.clientService.updateClient(this.client._id, this.client).subscribe({
                next: () => this.loadClientAndUsers(),
                error: error => console.error('Error updating client:', error),
            });
        }
    }
    // Helper method for updating user assignments to zones
    updateZoneUserAssignments(userIds, zone, assign = true) {
        userIds.forEach((userId) => {
            const user = this.users.find((user) => user._id === userId);
            if (!user) {
                console.error('User not found:', userId);
                return;
            }
            if (assign) {
                // Assign the user to the zone if not already assigned
                if (!user.assignedzones.includes(zone._id)) {
                    user.assignedzones.push(zone._id);
                    this.userService.updateUser(user).subscribe();
                }
            }
            else {
                // Unassign the user from the zone if assigned
                if (user.assignedzones.includes(zone._id)) {
                    user.assignedzones = user.assignedzones.filter((id) => id !== zone._id);
                    this.userService.updateUser(user).subscribe();
                }
            }
        });
        // Update the zone's assigned users after processing all selected users
        zone.assignedusers = assign
            ? [...zone.assignedusers, ...userIds]
            : zone.assignedusers.filter((id) => !userIds.includes(id));
        // Update the client if necessary
        if (this.client && this.client._id) {
            this.clientService.updateClient(this.client._id, this.client).subscribe({
                next: () => {
                    console.log('Client updated successfully.');
                    this.loadClientAndUsers(); // Reload to reflect changes
                },
                error: (error) => console.error('Error updating client:', error),
            });
        }
    }
    // Add these methods to your ManagerdashboardComponent class
    getUnassignedUsersForZone(zoneId) {
        // Get the location of the current zone
        const zoneLocation = this.selectedLocation;
        if (!zoneLocation) {
            return []; // Return an empty array if there's no selected location
        }
        // Filter users who are assigned to the location of the current zone but not assigned to the current zone
        return this.users.filter((user) => user.assignedlocations?.includes(zoneLocation._id) &&
            (!user.assignedzones || !user.assignedzones.includes(zoneId)));
    }
};
ManagerdashboardComponent = __decorate([
    Component({
        selector: 'app-managerdashboard',
        standalone: true,
        imports: [DatetimeComponent, CommonModule, RouterModule],
        template: `
<div>
  <h1>{{ client?.clientname }}'s Dashboard</h1>
  <app-datetime></app-datetime>
  <div *ngIf="users.length > 0">
    <h2>Associated Users</h2>
    <table>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Role</th>
        <th>Email</th>
        <th>Locations</th>
        <th>Zones</th>
      </tr>
      <tr *ngFor="let user of users">
        <td>{{ user.firstname }}</td>
        <td>{{ user.lastname }}</td>
        <td>{{ user.role }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.assignedlocations.length }}</td>
        <td>{{ user.assignedzones.length }}</td>
      </tr>
    </table>
  </div>
  <div *ngIf="client">
    <h2>Locations</h2>
    <div *ngFor="let location of client.location">
      <table>
        <tr>
          <td>{{ location.locationname }}</td>
          <td>
            <select multiple #assignedUsersSelect>
              <option *ngFor="let user of users" [value]="user._id">{{ user.firstname }} {{ user.lastname }} - {{user.role}} - {{user.email}}</option>
            </select>
            <button (click)="submitAssignedUsers(assignedUsersSelect, location)">Assign Users</button>
            <button (click)="viewZones(location)">View Zones</button>
          </td>
        </tr>
      </table>
      <table *ngIf="selectedLocation && selectedLocation._id === location._id">
        <tr *ngFor="let userId of location.assignedusers">
          <td>{{ getUserInfo(userId) }}</td>
          <td><button (click)="unassignUser(userId, location)">Unassign</button></td>
        </tr>
        <tr>
          <td colspan="2">
            <h3>Zones in {{ selectedLocation.locationname }}</h3>
            <div *ngFor="let zone of selectedLocation.zone">
              {{ zone.zonename }}
              Last Checkin: {{ zone.lastcheckin }}
              Last Checkout: {{ zone.lastcheckout }}
              Time Spent: {{ zone.timespent }}
              Last User: {{ zone.lastuser }}
              <div *ngIf="zone.qrcode; else noQrCode">
                <img [src]="zone.qrcode" alt="QR Code for {{ zone.zonename }}" style="width: 100px; height: 100px;">
              </div>
              <ng-template #noQrCode><p>Missing QR Code</p></ng-template>
              <div>
                <button (click)="toggleSelectedZone(zone._id)">Assign Users</button>
                <div *ngIf="isZoneSelected(zone._id)">
                  <select multiple #assignUsersSelect>
                    <option *ngFor="let user of getUnassignedUsersForZone(zone._id)" [value]="user._id">
                      {{ user.firstname }} {{ user.lastname }}
                    </option>
                  </select>
                  <button (click)="assignUsersToZone(assignUsersSelect, zone)">Assign Selected Users</button>
                </div>
                <div *ngIf="isZoneSelected(zone._id)">
                  <table>
                    <tr *ngFor="let user of assignedUsersForZone">
                      <td>{{ user.firstname }} {{ user.lastname }}</td>
                      <td>Role: {{ user.role }}</td>
                      <td>Email: {{ user.email }}</td>
                      <td><button (click)="unassignUserFromZone(user._id, zone)">Unassign</button></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>

`,
        styles: [`
  /* General styles */
  .container {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    margin: auto;
  }

  h1, h2 {
    color: #2c3e50;
    text-align: center;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 20px;
    margin: 20px 0;
  }

  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #4CAF50;
    color: white;
  }

  tr:nth-child(even) {background-color: #f2f2f2;}

  /* Scan message styling */
  .scan-message {
    background-color: #3498db;
    color: white;
    padding: 15px;
    margin: 20px 0;
    border-radius: 5px;
    width: 100%;
    text-align: center;
  }

  /* QR reader and button styling */
  #qr-reader {
    width: 100%;
    max-width: 500px; /* Adjust based on your preference */
    height: auto;
    margin: 20px 0;
  }

  .scan-btn {
    background-color: #e74c3c;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .scan-btn:hover {
    background-color: #c0392b;
  }
`]
    })
], ManagerdashboardComponent);
export { ManagerdashboardComponent };
//# sourceMappingURL=managerdashboard.component.js.map