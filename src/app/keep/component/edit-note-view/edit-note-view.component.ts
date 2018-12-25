import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-edit-note-view',
  templateUrl: './edit-note-view.component.html',
  styleUrls: ['./edit-note-view.component.scss']
})
export class EditNoteViewComponent implements OnInit {

  note: Note;
  selected: string;
  states = [
    {value: 'not-started-0', viewValue: 'not-started'},
    {value: 'started-1', viewValue: 'started'},
    {value: 'completed-2', viewValue: 'completed'}
  ];

  constructor(private dialogRef: MatDialogRef<EditNoteViewComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any, private _notesService: NotesService,
              private _groupService: GroupService) {
              }

  ngOnInit() {
    this.note = this._notesService.getNoteById(this.data.noteId);
    console.log(`Before Editing: ${this.note.title}, ${this.note.content}, ${this.note.state}`);
    this.selected = this.note.state;
  }

  editNote() {
    this.note.state = this.selected;
    // console.log(`After Editing: ${this.note.title}, ${this.note.text}, ${this.note.state}`);
    this._notesService.editNote(this.note).subscribe(editedNote => {
      if (editedNote.groupId) {
        this._groupService.updateNoteOfGroup(editedNote.groupId, editedNote);
      }
      this.dialogRef.close();
    }, err => {
      console.log(`Error while editing the note: ${err}`);
    });
  }

}
