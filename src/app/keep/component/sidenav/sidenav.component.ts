import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MatSidenav, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Group } from '../../models/group';
import { NewGroupDialogComponent } from '../new-group-dialog/new-group-dialog.component';
import { RouterService } from '../../services/router.service';
import { ToastrService } from '../../services/toastr.service';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../services/socket.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  sub: Subscription;
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px`);

  groups: Observable<Group[]>;
  notifications: Observable<Notification[]>

  constructor(zone: NgZone,
    private _groupService: GroupService,
    private _routerService: RouterService,
    private _router: Router,
    private _dialog: MatDialog,
    private _toastrService: ToastrService,
    private _socketService: SocketService,
    public snackBar: MatSnackBar) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => this.mediaMatcher = mql));
   }

  ngOnInit() {
    
    this.sub = this._socketService.getNotifications()
                    .subscribe(data => {
                      console.log('Notify event fired from the backend: ', data);
                      let title = 'New Note added';
                      let message = `Note titled "${data.title}" has been shared to you by user ${data.from}`;
                      this._toastrService.info(message, title);
                    });
    
    this.groups = this._groupService.groups;
    this._groupService.loadAll();

    this._router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  openAddGroupDialog(): void {
    const dialogRef = this._dialog.open(NewGroupDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log('The dialog was closed ', res);

      if (res) {
        this.openSnackBar('Group added', 'Navigate')
          .onAction().subscribe(() => {
            this._router.navigate(['/keep/dashboard/group', res.groupId]);
          });
      }
    });

  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  deleteGroup(groupId: string, title: string): void {
    if(confirm(`Really want to delete the group: ${title}?`)) {
        this._groupService.deleteGroup(groupId)
        .subscribe(res => {
          this._routerService.routeToDashboard();
        }, err => console.log('Error occurred while deleting group ', err)
      );
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
