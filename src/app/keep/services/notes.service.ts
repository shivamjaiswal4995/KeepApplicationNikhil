import { AuthenticationService } from './authentication.service';
import { Note } from '../models/note';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import { GroupService } from './group.service';

@Injectable()
export class NotesService {
  private _notesUrl: string;
  private _token: string;
  private notes: Array<Note>;
  notesSubject: BehaviorSubject<Array<Note>>;

  constructor(private _http: HttpClient, private _authService: AuthenticationService, private _groupService: GroupService) {
    // this._notesUrl = 'http://localhost:3100/api/v1/notes';
    this._notesUrl = '/api/v1/notes';
    this.notes = [];
    this.notesSubject = new BehaviorSubject(this.notes);
    this.fetchNotesFromServer();
  }

  fetchNotesFromServer() {
    this._token = this._authService.getBearerToken();
     this._http.get<Note[]>(this._notesUrl, {
      headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this._token}`)
    }).catch(this.handleError)
    .subscribe(notes => {
      this.notes = notes;
      this.notesSubject.next(this.notes);
    });
  }

  getNotes(): Observable<Note[]> {
    return this.notesSubject;
  }

  addNote(data: Note): Observable<Note> {
    return this._http.post<Note>(this._notesUrl, data, {
      headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this._token}`)
    }).do(addednote => {
      this.notes.push(addednote);
      this.notesSubject.next(this.notes);
    }).catch(this.handleError);
  }

  getNoteById(noteId): Note {
    const note =  this.notes.find(note => note.noteId === noteId);
    return Object.assign({}, note);
  }

  changeGroupId(noteId: string): void {
    const note = this.notes.find(note => note.noteId === noteId);
    note.groupId = '';
    this.notesSubject.next(this.notes);
  }

  editNote(data: Note): Observable<Note> {
    const note = this.notes.find(note => note.noteId === data.noteId);
    Object.assign(note, data);
    this.notesSubject.next(this.notes);

    return this._http.put<Note>(`${this._notesUrl}/${data.noteId}`, data, {
      headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this._token}`)
    }).catch(this.handleError);
  }

  toggleFavStatus(id): Observable<Note> {
    const updatedNote = this.notes.find(note => note.noteId === id);
    if (updatedNote.favorite) {
      updatedNote.favorite = false;
    } else {
      updatedNote.favorite = true;
    }

    this.notesSubject.next(this.notes);
    return this._http.put<Note>(`${this._notesUrl}/fav/${id}`, {}, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this._token}`)
    }).catch(this.handleError);
  }

  deleteNote(id): Observable<Note> {
    const note = this.notes.find(note => note.noteId === id);
    const index = this.notes.findIndex(note => note.noteId === id);
    this.notes.splice(index, 1);
    this.notesSubject.next(this.notes);
    return this._http.delete<Note>(`${this._notesUrl}/${id}`, {
      headers: new HttpHeaders()
      .set('Authorization', `Bearer ${this._token}`)
    }).catch(this.handleError);

  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }

  shareNote(noteObj): Observable<Note> {
    return this._http.post<Note>(`${this._notesUrl}/share`, noteObj, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this._token}`)
    });
  }

// tslint:disable-next-line:eofline
}