import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let UserService = class UserService {
    constructor(http) {
        this.http = http;
        this.apiUrl = 'http://localhost:5200/users'; // Adjust based on your actual API endpoint
    }
    // Method to create a new user
    createNewUser(user) {
        return this.http.post(this.apiUrl, user);
    }
    getNewUserInfo(userId) {
        return this.http.get(`${this.apiUrl}/${userId}`);
    }
    // Method to fetch users by an array of IDs
    fetchUsersByIds(ids) {
        // Ensure the backend is expecting a POST request with a body containing { ids: string[] }
        return this.http.post(`${this.apiUrl}/fetchByIds`, { ids });
    }
    // In UserService
    // Method to update a user
    updateUser(user) {
        return this.http.put(`${this.apiUrl}/${user._id}`, user);
    }
    // Method to delete a user by ID
    deleteUser(userId) {
        return this.http.delete(`${this.apiUrl}/${userId}`);
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map