import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { NotesService } from '../../services/notes.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-note-share-dialog',
  templateUrl: './note-share-dialog.component.html',
 styleUrls: ['./note-share-dialog.component.scss']
})

export class NoteShareDialogComponent implements OnInit {
  users: User[];
  selected: string;
  usersList: any;
  currentUserName: string;

  constructor(private dialogRef: MatDialogRef<NoteShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _userService: UserService,
    private _noteService: NotesService,
    private _authService: AuthenticationService) {
      this.usersList = [];
      this.selected = '';
      this.currentUserName = this._authService.getUserName();
    }

  ngOnInit() {
    this._userService.getUsers()
          .subscribe(data => {
            this.users = data;
            this.createUsersArray();
          }, error => console.log(`Error while getting users from userService: ${error}`)
        );
  }

  createUsersArray() {
    for (const user of this.users) {
      if(user.userName === this.currentUserName)
        continue;
      const userObj = {
        value: user.userId,
        viewValue: `${user.userName}, ${user.userEmail}`
      };
      this.usersList.push(userObj);
      console.log(this.usersList);
    }
  }

  done() {
    const selectedUser = this.users.find(user => user.userName === this.selected.split(',')[0]);
    console.log("this.selected", this.selected);
    console.log("selectedUser", selectedUser);
    const noteObj = {
      sharedUserId: selectedUser.userId,
      sharedToUserName: selectedUser.userName,
      sharedByUserName: this._authService.getUserName(),
      sharedUserEmailId: selectedUser.userEmail,
      title: this.data.note.title,
      content: this.data.note.content,
      remindMe: this.data.note.remindMe
    };

    this._noteService.shareNote(noteObj)
      .subscribe(res => {
        const data = {
          receipient: this.selected,
          sender: this._authService.getUserName(),
          title: this.data.note.title,
          idOfSharedUser: selectedUser.userId
        }
        this.dialogRef.close(data);
      }, error => console.log('Error while sharing note ', error)
    );
  }

  dismiss() {
    this.dialogRef.close(null);
  }

// tslint:disable-next-line:eofline
}