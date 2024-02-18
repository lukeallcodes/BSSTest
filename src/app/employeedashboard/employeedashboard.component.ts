import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClientService } from '../client.service';
import { UserService } from '../user.service';
import { Client, Location, Zone } from '../client';
import { NewUser } from '../newuser';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Html5Qrcode } from "html5-qrcode";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-employeedashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="container">
  <h1>Welcome, {{ user?.firstname }} {{ user?.lastname }}</h1>
  <div *ngIf="assignedLocations.length > 0">
    <h2>Your Locations</h2>
    <table>
      <thead>
        <tr>
          <th>Location Name</th>
          <th>Zone Name</th>
          <th>Last Check-In</th>
          <th>Last Check-Out</th>
          <th>Time Spent</th>
          <th>Last User</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngFor="let location of assignedLocations">
          <tr *ngFor="let zone of location.zone; let i = index">
            <td *ngIf="i === 0" [attr.rowspan]="location.zone.length">{{ location.locationname }}</td>
            <td>{{ zone.zonename }}</td>
            <td>{{ zone.lastcheckin }}</td>
            <td>{{ zone.lastcheckout }}</td>
            <td>{{ zone.timespent }}</td>
            <td>{{ zone.lastuser }}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
  <div *ngIf="scanMessage" class="scan-message">{{ scanMessage }}</div>
  <div #qrReader id="qr-reader" style="width: 500px; height: 500px;"></div>
  <button (click)="startScan()" class="scan-btn">Scan QR Code</button>
</div>


  `,
  styles: `/* General styles */
  div {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  h1, h2 {
    color: #2c3e50;
    text-align: center;
  }
  
  h1 {
    font-size: 1.8em;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 1.4em;
    margin-bottom: 15px;
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
  
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  /* Zone details styling */
  td > div {
    margin-bottom: 5px; /* Space between each zone detail */
  }
  
  /* Scan message styling */
  .scan-message {
    background-color: #3498db;
    color: #ffffff;
    padding: 15px;
    margin: 20px 0;
    border-radius: 5px;
    text-align: center;
    font-size: 1em;
  }
  
  /* QR reader and button styling */
  #qr-reader {
    width: 100%;
    height: auto;
    max-width: 300px;
    margin: 20px 0;
  }
  
  button {
    background-color: #e74c3c;
    color: #ffffff;
    padding: 15px 30px;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #c0392b;
  }
  /* Ensure the main container div takes up the full height of the viewport */
div.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between; /* Space content and button */
}

/* Fix the scan button at the bottom and center */
button.scan-btn {
  position: fixed; /* Fix position relative to the viewport */
  left: 50%; /* Center the button horizontally */
  bottom: 20px; /* Distance from the bottom of the viewport */
  transform: translateX(-50%); /* Offset the button by half its width to center it */
  padding: 15px 30px;
  font-size: 1em;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button.scan-btn:hover {
  background-color: #c0392b;
}


  `
})
export class EmployeedashboardComponent implements OnInit, OnDestroy {
  user: NewUser | undefined;
  client: Client | undefined;
  assignedLocations: Location[] = [];
  scanMessage: string = '';
  @ViewChild('qrReader') qrReaderElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const userId = this.route.snapshot.paramMap.get('id');
        return this.userService.getNewUserInfo(userId!);
      }),
      switchMap(user => {
        this.user = user;
        return this.clientService.getClient(user.clientid!);
      })
    ).subscribe(client => {
      this.client = client;
      this.assignedLocations = client.location.filter(location => 
        this.user?.assignedlocations.includes(location._id) || location.zone.some(zone => this.user?.assignedzones.includes(zone._id))
      );
      this.assignedLocations.forEach(location => {
        location.zone = location.zone.filter(zone => this.user?.assignedzones.includes(zone._id));
      });
    });
  }

  ngOnDestroy(): void {
    // Implement if needed to stop the QR scanner
  }

  startScan(): void {
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 60, qrbox: 250 },
      async (decodedText: string) => {
        const zoneId = decodedText;
        if (!this.client || !this.client.location) return;
        
        for (const location of this.client.location) {
          const zone = location.zone.find(z => z._id === zoneId);
          if (!zone) continue;

          const currentTime = new Date();
          const currentIsoTime = currentTime.toISOString();
          const fullName = `${this.user?.firstname} ${this.user?.lastname}`;

          // Determine the operation to perform based on zone state
          this.determineZoneOperation(zone, currentIsoTime, fullName, currentTime);
          this.stopScanner(html5QrCode);
          try {
            const updateResponse = await firstValueFrom(this.clientService.updateClient(this.client._id, this.client));
            console.log("Client update successful", updateResponse);
          } catch (error) {
            console.error("Error updating client", error);
          }

          break; // Exit the loop once the relevant zone is processed
        }

        
      },
      (error: any) => {
        // Handle scan error
      }
    ).catch((err: any) => {
      console.error(`Unable to start QR Code scanner: ${err}`);
    });
  }

  private determineZoneOperation(zone: Zone, currentIsoTime: string, fullName: string, currentTime: Date): void {
    const lastCheckInTime = zone.lastcheckin ? new Date(zone.lastcheckin) : null;
    const lastCheckOutTime = zone.lastcheckout ? new Date(zone.lastcheckout) : null;
  
    // Scenario where a previous session has been completed
    if (lastCheckInTime && lastCheckOutTime && lastCheckInTime < lastCheckOutTime) {
      // Since both check-in and check-out are populated and it's a completed session, clear and start a new check-in
      this.clearPreviousSession(zone);
      this.performCheckIn(zone, currentIsoTime, fullName, currentTime);
    } else if (lastCheckInTime && (!lastCheckOutTime || lastCheckInTime > lastCheckOutTime)) {
      // Scenario where the last recorded action was a check-in without a corresponding check-out
      if (zone.lastuser === fullName || !zone.lastuser) {
        this.performCheckOut(zone, currentIsoTime, fullName, currentTime);
      } else {
        console.error("Different user trying to check out. Operation not allowed.");
        // Consider adding logic to notify the user of the error or handle it appropriately
      }
    } else if (!lastCheckInTime && !lastCheckOutTime) {
      // If no records exist, perform a check-in
      this.performCheckIn(zone, currentIsoTime, fullName, currentTime);
    }
  }
  
  

  private performCheckIn(zone: Zone, currentIsoTime: string, fullName: string, currentTime: Date): void {
    this.clearPreviousSession(zone);
    zone.lastcheckin = currentIsoTime;
    zone.lastuser = fullName;
    zone.lastcheckout= '';
    this.updateScanMessage(zone.zonename, 'Checked In', currentTime);
  }

  private clearPreviousSession(zone: Zone): void {
    zone.lastcheckin = '';
    zone.lastcheckout = '';
    zone.timespent = '';
  }

  private performCheckOut(zone: Zone, currentIsoTime: string, fullName: string, currentTime: Date): void {
    zone.lastcheckout = currentIsoTime;
    const checkinTime = new Date(zone.lastcheckin);
    
    const timespent = currentTime.getTime() - checkinTime.getTime();
    zone.timespent = this.formatTimeSpent(timespent);
    zone.lastuser = fullName;
    this.updateScanMessage(zone.zonename, 'Checked Out', currentTime);
  }

  private stopScanner(html5QrCode: Html5Qrcode): void {
    html5QrCode.stop().catch((err: any) => console.error("Error stopping scanner:", err));
   
  }

  formatTimeSpent(milliseconds: number): string {
    let totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  updateScanMessage(zoneName: string, action: 'Checked In' | 'Checked Out', time: Date) {
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(time);
    this.scanMessage = `${zoneName} ${action} at ${formattedTime}`;
  }

}