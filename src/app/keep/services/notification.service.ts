import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Notification } from '../models/notification';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { group } from '@angular/animations';
import { AuthenticationService } from './authentication.service';
import { Note } from '../models/note';

@Injectable()
export class NotificationService {
    
    private notifications: Notification[]
    private _token: string;
    private _notificationUrl: string;
    private notificationSubject: BehaviorSubject<Notification[]>;

    constructor(private _http: HttpClient, private _authService: AuthenticationService) {
        this._notificationUrl = '/api/v1/notifications';
        this.notifications = [];
        this.notificationSubject = new BehaviorSubject(this.notifications);
        this.loadAll();
      }

      getNotifications(): Observable<Notification[]> {
        return this.notificationSubject;
      }

      loadAll() {
        this._token = this._authService.getBearerToken();
        return this._http.get<Notification[]>(this._notificationUrl, {
            headers: new HttpHeaders()
              .set('Authorization', `Bearer ${this._token}`)
          }).subscribe(data => {
            this.notifications = data;
            console.log('notifications', this.notifications);
            this.notificationSubject.next(this.notifications);
          }, error => console.log(`Error occured while fetching Notifications ${error}`)
        );
      }

      toggleReadFlags(): Observable<any> {
        return this._http.put<Note>(`${this._notificationUrl}/toggleReadFlags`, {}, {
            headers: new HttpHeaders()
              .set('Authorization', `Bearer ${this._token}`)
          }).do(data => JSON.stringify(data));
      }

      private handleError(err: HttpErrorResponse) {
        console.log(err.message);
         return Observable.throw(err);
      }
}