import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss']
})
export class NoteViewComponent implements OnInit {

  notes: Array<Note>;
  listFilter: string;

  constructor(private _notesService: NotesService) { }

  ngOnInit() {
    this.listFilter = '';
    this._notesService.getNotes().subscribe(
      data => {
        this.notes = data;
      },
      err => {
        console.log('Error while fetching all notes from notes service', err);
      }
    );
  }

}
