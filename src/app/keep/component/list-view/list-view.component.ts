import { Note } from '../../models/note';
import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  notes: Array<Note>;

  constructor(private _notesService: NotesService) { }

  ngOnInit() {
    this._notesService.getNotes().subscribe(
      data => {
        this.notes = data;
      },
      err => {
        console.log(err);
      }
    );
  }

}
