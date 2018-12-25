import { Component, OnInit, ViewChild } from '@angular/core';
import { Note } from '../../models/note';
import { NotesService } from '../../services/notes.service';
import { RouterService } from '../../services/router.service';
import { MatExpansionPanel } from '@angular/material';


@Component({
  selector: 'app-note-taker',
  templateUrl: './note-taker.component.html',
  styleUrls: ['./note-taker.component.scss']
})
export class NoteTakerComponent implements OnInit {

  @ViewChild(MatExpansionPanel) panel: MatExpansionPanel;
  note: Note;
  selected: string;
  time: number;
  remindMe: Date;
  states = [
    {value: 'not-started-0', viewValue: 'not-started'},
    {value: 'started-1', viewValue: 'started'},
    {value: 'completed-2', viewValue: 'completed'}
  ];
  visible: boolean
  hrs: string;
  mins: string;
  amPm: string;

  constructor(private _notesServics: NotesService,
    private _routerService: RouterService) {
    this.selected = '';
    this.remindMe = new Date();
    this.visible = false;
    this.hrs = '';
    this.mins = '';
    this.amPm = 'AM';
  }

  ngOnInit() {
    this.note = new Note();
  }

  addNote() {
    const datePickerTime = this.remindMe.toJSON();
    const reminderTime = new Date(datePickerTime);
    if (this.time > 0) {
      reminderTime.setHours(this.time);
      reminderTime.setMinutes(0);
      reminderTime.setSeconds(0);
    } else {
      if(this.amPm === 'AM') {
        reminderTime.setHours(parseInt(this.hrs, 10));
      } else {
        reminderTime.setHours(parseInt(this.hrs, 10) + 12);
      }
      reminderTime.setMinutes(parseInt(this.mins, 10));
      reminderTime.setSeconds(0);
    }
    
    this.note.remindMe = reminderTime;
    this.note.state = this.selected;
    //console.log('Final reminder time: ', reminderTime);
    // console.log(this.note);
    this._notesServics.addNote(this.note).subscribe(
      data => {
        this.note = new Note();
        this.selected = '';
        this.time = null;
        this.remindMe = new Date();
        this.hrs = '';
        this.mins = '';
        this.visible = false;
        this.panel.close();
        this._routerService.routeToDashboard();
      },
      err => {
        console.log(err);
      }
    );
  }

  selectChange(args) {
    if(parseInt(args, 10) === 0) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

}
