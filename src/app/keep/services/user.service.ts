import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/user';

@Injectable()
export class UserService {
    private _usersUrl: string;
    private _token;
    private users: Array<User>;
    private userSubject: BehaviorSubject<Array<User>>;

    constructor(private _http: HttpClient, private _authService: AuthenticationService) {
        this._usersUrl = '/api/v1/users';
        this.users = [];
        this.userSubject = new BehaviorSubject(this.users);
        this.findAllUser();
    }

    findAllUser() {
        this._token = this._authService.getBearerToken();
        return this._http.get<User[]>(this._usersUrl, {
            headers: new HttpHeaders()
                .set('Authorization', `Bearer ${this._token}`)
        }).subscribe(data => {
            this.users = data;
            console.log('Users ', this.users);
            this.userSubject.next(this.users);
        }, error => console.log(`Error occured while fetching users ${error}`)
        );

    }
   getUsers(): Observable<User[]> {
        return this.userSubject;
    }

// tslint:disable-next-line:eofline
}