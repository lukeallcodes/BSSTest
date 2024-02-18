import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-datetime',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <p>Current Date and Time: {{ currentDate | date: 'full' }}</p>
    </div>
  `,
  styles: ``
})
export class DatetimeComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  private timerId: any;

  ngOnInit(): void {
    this.updateTime();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId); // Clear the timer when the component is destroyed
    }
  }

  private updateTime(): void {
    this.timerId = setInterval(() => {
      this.currentDate = new Date(); // Update the current date and time every second
    }, 1000);
  }
}
