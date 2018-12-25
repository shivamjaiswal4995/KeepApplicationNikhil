import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterService } from '../../services/router.service';
import { AuthenticationService } from '../../services/authentication.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();
  private _userName: string;
  private _notification: Notification[];
  private totalNotification: number;

  constructor(private _router: RouterService,
    private _authService: AuthenticationService,
    private _notificationService: NotificationService) {
      this._userName = '';
      this._notification = [];
      this.totalNotification = 0;
    }

  ngOnInit() {
    this._userName = this._authService.getUserName();
    this._notificationService.getNotifications()
              .subscribe(data => {
                this._notification = data;
                this.totalNotification = data.length;
              },
              err => {
                console.log('Error occurred while fetching Notifications from noteification service', err);
              });
  }

  showAllNotes() {
    this._router.routeToDashboard();
  }

  logOut(): void {
    this._authService.logOut();
    this._router.routeToLogin();
  }

  toggleReadFlags(): void {
    this.totalNotification = 0;
    this._notificationService.toggleReadFlags().subscribe(data => {
      console.log('Toggling read flags successfull', data);
    }, err => console.log('Error occurred while toggling read flags', err));
  }


}
