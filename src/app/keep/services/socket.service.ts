import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, catchError } from 'rxjs/operators';
import io from 'socket.io-client';

import { Socket } from '../models/socket.interface';

declare let io : {
  connect(url: string): Socket;
};

@Injectable()
export class SocketService {

  private socket: Socket;
  private observer: Observer<any>;

  constructor() {
    this.socket = io.connect('http://localhost:3000');
    console.log('Socket details: ', this.socket);
  }

  sendSignInEvent(data: any): void {
    this.socket.emit('signin', data);
  }

  sendSignUpEvent(data: any): void {
    this.socket.emit('signup', data);
  }

  sendShareEvent(data: any): void {
    this.socket.emit('share', data);
  }

  getNotifications(): Observable<any> {
    this.socket.on('notify', res => {
      this.observer.next(res);
    });

    return this.createObservable();
  }

  private createObservable() : Observable<any> {
      return new Observable<any>(observer => {
        this.observer = observer;
      });
  }

  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
        let errMessage = error.error.message;
        return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }

}
