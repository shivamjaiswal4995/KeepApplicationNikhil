import { EditNoteViewComponent } from '../edit-note-view/edit-note-view.component';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-edit-note-opener',
  templateUrl: './edit-note-opener.component.html',
  styleUrls: ['./edit-note-opener.component.scss']
})
export class EditNoteOpenerComponent implements OnInit {

  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private _routerService: RouterService) {
    const noteId = this.activatedRoute.snapshot.paramMap.get('noteId');
    this.dialog.open(EditNoteViewComponent, {
      data: {
        noteId: noteId
      }
    }).afterClosed().subscribe(result => {
      this._routerService.routeBack();
    });
  }

  ngOnInit() {
  }

}
