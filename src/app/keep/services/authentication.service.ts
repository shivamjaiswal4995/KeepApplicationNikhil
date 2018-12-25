import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
  private _authUrl: string;
  private _bearerToken: string;

  constructor(private _http: HttpClient) {
    // this._authUrl = 'http://localhost:3100/auth/v1';
     this._authUrl = '/api/v1/';
     this._bearerToken = null;
   }

   authenticateUser(data): Observable<any> {
     return this._http.post(`${this._authUrl}users/signin`, data);
   }

   saveUserDetails(userDetails) {
     this._bearerToken = userDetails.token;
     localStorage.setItem('bearerToken', this._bearerToken);
     localStorage.setItem('userName', userDetails.userName);
   }

   getUserName() {
     return localStorage.getItem('userName');
   }
   
   getBearerToken() {
     return localStorage.getItem('bearerToken');
   }

   isUserAuthenticated(token): Promise<boolean> {
     return this._http.post(`${this._authUrl}users/isAuthenticated`, {}, {
       headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)}).map((res) => res['isAuthenticated']).toPromise();
   }

   registerUser(data): Observable<any> {
     return this._http.post(`${this._authUrl}users/register`, data);
   }

   logOut() {
     this._bearerToken = null;
     localStorage.setItem('bearerToken', null);
     localStorage.setItem('userName', null);
   }

// tslint:disable-next-line:eofline
}