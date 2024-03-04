import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
let AppComponent = class AppComponent {
    constructor() {
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [CommonModule, RouterOutlet],
        template: `
    <router-outlet></router-outlet>
  `,
        styles: [],
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map