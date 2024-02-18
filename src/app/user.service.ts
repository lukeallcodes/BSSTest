import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewUser } from './newuser'; // Ensure this interface correctly defines the structure of a user

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5200/users'; // Adjust based on your actual API endpoint

  constructor(private http: HttpClient) { }

  // Method to create a new user
  createNewUser(user: NewUser): Observable<NewUser> {
    return this.http.post<NewUser>(this.apiUrl, user);
  }

  getNewUserInfo(userId: string): Observable<NewUser> {
    return this.http.get<NewUser>(`${this.apiUrl}/${userId}`);
  }
  

  // Method to fetch users by an array of IDs
  fetchUsersByIds(ids: string[]): Observable<NewUser[]> {
    // Ensure the backend is expecting a POST request with a body containing { ids: string[] }
    return this.http.post<NewUser[]>(`${this.apiUrl}/fetchByIds`, { ids });
  }

  // In UserService

// Method to update a user
updateUser(user: NewUser): Observable<NewUser> {
  return this.http.put<NewUser>(`${this.apiUrl}/${user._id}`, user);
}

// Method to delete a user by ID
deleteUser(userId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${userId}`);
}


}
