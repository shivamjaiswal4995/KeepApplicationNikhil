import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Group } from '../models/group';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { group } from '@angular/animations';
import { AuthenticationService } from './authentication.service';
import { Note } from '../models/note';

@Injectable()
export class GroupService {

  private _dataStore: {
    groups: Group[]
  };
  private _token: string;
  private _groupsUrl: string;
  private _groups: BehaviorSubject<Group[]>;

  constructor(private _http: HttpClient, private _authService: AuthenticationService) {
    this._groupsUrl = '/api/v1/groups';
    this._dataStore = { groups: [] };
    this._groups = new BehaviorSubject<Group[]>([]);
  }

  get groups(): Observable<Group[]> {
    return this._groups.asObservable();
  }

  addGroup(group: Group): Observable<Group> {
    return this._http.post<Group>(this._groupsUrl, group, {
          headers: new HttpHeaders()
          .set('Authorization', `Bearer ${this._token}`)
        }).do(addedGroup => {
          this._dataStore.groups.push(addedGroup);
          this._groups.next(Object.assign({}, this._dataStore).groups);
        });
  }

  loadAll() {
    this._token = this._authService.getBearerToken();
    return this._http.get<Group[]>(this._groupsUrl, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this._token}`)
    }).subscribe(data => {
      this._dataStore.groups = data;
       console.log('groups', this._dataStore.groups);
      this._groups.next(Object.assign({}, this._dataStore).groups);
    }, error => console.log(`Error occured while fetching Groups ${error}`)
  );
 }

  groupById(id: string) {
    return this._dataStore.groups.find(group => group.groupId === id);
  }

  deleteGroup(groupId: string): Observable<boolean> {
    return this._http.delete<Group>(`${this._groupsUrl}/${groupId}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this._token}`)
    }).do(deletedGroup => {
      const groupIndex = this._dataStore.groups.findIndex(group => group.groupId === deletedGroup.groupId);
      this._dataStore.groups.splice(groupIndex, 1);
      this._groups.next(Object.assign({}, this._dataStore).groups);
    }).catch(this.handleError);
  }

  addNoteTogroup(groupId: string, note: Note): Observable<Group> {
    const groupToUpdate = this.groupById(groupId);
    note.groupId = groupId;
    groupToUpdate.notes.push(Object.assign({}, note));
    this._groups.next(Object.assign({}, this._dataStore).groups);
    const details = {
      noteId: note.noteId
    };
    return this._http.put<Group>(`${this._groupsUrl}/${groupId}`, details, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this._token}`)
    });
  }

  updateNoteOfGroup(groupId: string, data: Note): void {
    const groupToUpdate = this.groupById(groupId);
    const noteToUpdateOfGroup = groupToUpdate.notes.find(note => note.noteId === data.noteId);
    Object.assign(noteToUpdateOfGroup, data);
    this._groups.next(Object.assign({}, this._dataStore).groups);
  }

  removeNoteFromGroup(groupId: string, noteId: string): Observable<Group> {
    const groupToUpdate = this.groupById(groupId);
    const indexOfNoteToRemove = groupToUpdate.notes.findIndex(note => note.noteId === noteId);
    groupToUpdate.notes.splice(indexOfNoteToRemove, 1);
    this._groups.next(Object.assign({}, this._dataStore).groups);
    const details = {
      noteId: noteId
    };
    return this._http.put<Group>(`${this._groupsUrl}/removeNote/${groupId}`, details, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this._token}`)
    });
  }

  toggleFavStatusOfNoteInsideGroup(groupId: string, noteId: string): void {
    const groupToUpdate = this.groupById(groupId);
    const noteOfGroupToUpdate = groupToUpdate.notes.find(note => note.noteId === noteId);
    if (noteOfGroupToUpdate.favorite) {
      noteOfGroupToUpdate.favorite = false;
    } else {
      noteOfGroupToUpdate.favorite = true;
    }
    Object.assign(groupToUpdate, groupToUpdate);
    this._groups.next(Object.assign({}, this._dataStore).groups);
  }

  cleanRedundantNoteFromGroup(groupId: string, noteId: string): void {
    const groupToUpdate = this.groupById(groupId);
    const indexOfNoteToRemove = groupToUpdate.notes.findIndex(note => note.noteId === noteId);
    groupToUpdate.notes.splice(indexOfNoteToRemove, 1);
    this._groups.next(Object.assign({}, this._dataStore).groups);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }

// tslint:disable-next-line:eofline
}