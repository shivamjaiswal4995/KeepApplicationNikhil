import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../../models/note';
import { RouterService } from '../../services/router.service';
import { NotesService } from '../../services/notes.service';
import { MatDialog, MatSnackBar, SimpleSnackBar, MatSnackBarRef } from '@angular/material';
import { NoteShareDialogComponent } from '../note-share-dialog/note-share-dialog.component';
import { AddToGroupDialogComponent } from '../add-to-group-dialog/add-to-group-dialog.component';
import { GroupService } from '../../services/group.service';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})

export class NoteComponent implements OnInit {

  @Input() note: Note;
  constructor(private _routerService: RouterService,
    private _notesService: NotesService,
    private _groupService: GroupService,
    private _socketService: SocketService,
    private _dialog: MatDialog,
    public snackbar: MatSnackBar) { }

  ngOnInit() {
    
  }

  openEditNoteView(noteId): void {
    // console.log(`Id: is ${id}`);
    this._routerService.routeToEditNoteView(noteId);
  }

  toggleFavStatus(noteId): void {
    this._notesService.toggleFavStatus(noteId)
      .subscribe(res => {
        if (res.groupId) {
          this._groupService.toggleFavStatusOfNoteInsideGroup(res.groupId, noteId);
        }
      }, err => console.log(`Error while toggling the fav staus: ${err}`)
    );
  }

  deleteNote(noteId: string, title: string): void {
    if(confirm(`Really want to delete the note: ${title}?`)) {
        this._notesService.deleteNote(noteId)
        .subscribe(res => {
          if (res.groupId) {
            this._groupService.cleanRedundantNoteFromGroup(res.groupId, noteId);
          }
          this._routerService.routeToDashboard();
        }, err => console.log(`Error: ${err}`)
      );
    }
  }

  shareNote(noteId): void {
    const dialogRef = this._dialog.open(NoteShareDialogComponent, {
      data: { note: this.note},
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log('Note share dialog was closed!');
      if (res) {
        // console.log('message recieved: ', res);
        this._socketService.sendShareEvent(res);
        this.openSnackBar('Note has been shared with user ' + res.receipient.split(',')[0]);
      }
    });
  }

  addToGroup(): void {
    const dialogRef = this._dialog.open(AddToGroupDialogComponent, {
      data: { note: this.note},
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log('Add to group dialog was closed!');
      if (res) {
        console.log('message recived after closing note added dialog ', res);
        this.openSnackBar('Note has been added to the group ' + res.title);
      }
    });
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, '', {
      duration: 2000
    });
  }

// tslint:disable-next-line:eofline
}