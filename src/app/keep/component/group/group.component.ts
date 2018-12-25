import { MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../../models/note';
import { RouterService } from '../../services/router.service';
import { NotesService } from '../../services/notes.service';
import { GroupService } from '../../services/group.service';
import { NoteShareDialogComponent } from '../note-share-dialog/note-share-dialog.component';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  @Input() note: Note;
  constructor(private _routerService: RouterService,
    private _notesService: NotesService,
    private _groupService: GroupService,
    private _dialog: MatDialog,
    public snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  openEditNoteView(noteId: string): void {
    // console.log(`Id: is ${id}`);
    this._routerService.routeToEditNoteView(noteId);
  }

  toggleFavStatus(noteId: string): void {
    this._notesService.toggleFavStatus(noteId)
      .subscribe(res => {
        if (res.groupId) {
          this._groupService.toggleFavStatusOfNoteInsideGroup(res.groupId, noteId);
        }
      }, err => console.log(`Error: ${err}`));
  }

  shareNote(noteId: string): void {
    const dialogRef = this._dialog.open(NoteShareDialogComponent, {
      data: { note: this.note },
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.openSnackBar(`Note has been shared with user '${res}'`);
      }
    });
  }

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, '', {
      duration: 2000
    });
  }

  removeNoteFromGroup(groupId: string, noteId: string, title: string): void {
      if(confirm(`Really want to remove note "${title}" from this group?`)) {
        this._groupService.removeNoteFromGroup(groupId, noteId)
        .subscribe(updatedGroup => {
          this._notesService.changeGroupId(noteId);
        }, err => console.log('Error occurred while removing note from group ', err)
      );
    }
  }

}
