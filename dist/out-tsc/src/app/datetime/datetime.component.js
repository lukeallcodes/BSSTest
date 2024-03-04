import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
let DatetimeComponent = class DatetimeComponent {
    constructor() {
        this.currentDate = new Date();
    }
    ngOnInit() {
        this.updateTime();
    }
    ngOnDestroy() {
        if (this.timerId) {
            clearInterval(this.timerId); // Clear the timer when the component is destroyed
        }
    }
    updateTime() {
        this.timerId = setInterval(() => {
            this.currentDate = new Date(); // Update the current date and time every second
        }, 1000);
    }
};
DatetimeComponent = __decorate([
    Component({
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
], DatetimeComponent);
export { DatetimeComponent };
//# sourceMappingURL=datetime.component.js.map