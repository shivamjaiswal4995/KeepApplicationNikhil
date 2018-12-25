import { Injectable } from '@angular/core';
import { Router } from '@angular/router/';
import { Location } from '@angular/common';

@Injectable()
export class RouterService {

  constructor(private _router: Router, private _location: Location) { }

  routeToDashboard() {
    this._router.navigate(['keep/dashboard']);
  }

  routeToLogin() {
    this._router.navigate(['keep/login']);
  }

  routeToEditNoteView(noteId) {
    this._router.navigate(['keep/dashboard', {
      outlets: {
        noteEditOutlet: ['note', noteId, 'edit']
      }
    }]);
  }

  routeBack() {
    this._location.back();
  }

}
