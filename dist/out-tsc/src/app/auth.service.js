import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        this.apiUrl = 'http://localhost:5200'; // URL of your backend
    }
    register(user) {
        return this.http.post(`${this.apiUrl}/auth/register`, user);
    }
    login(credentials) {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe();
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map