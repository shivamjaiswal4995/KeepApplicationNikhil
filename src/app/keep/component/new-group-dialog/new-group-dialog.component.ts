import { GroupService } from '../../services/group.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Group } from '../../models/group';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-new-group-dialog',
  templateUrl: './new-group-dialog.component.html',
  styleUrls: ['./new-group-dialog.component.scss']
})
export class NewGroupDialogComponent implements OnInit {

  group: Group;

  constructor(private dialogRef: MatDialogRef<NewGroupDialogComponent>,
    private _groupService: GroupService,
    private _toasterService: ToastrService) { }

  title = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.title.hasError('required') ? 'You must enter a title' : '';
  }

  ngOnInit() {
    this.group = new Group();
  }

  save() {
    this._groupService.addGroup(this.group).subscribe(group => {
      this.dialogRef.close(group);
    }, err => {
      console.log(err.error.message);
      let errMsg;
      if (err.error.code === 11000) {
        errMsg = 'Group already Exists!';
      } else {
        errMsg = 'Something went wrong! Please try again later';
      }
      this._toasterService.error(errMsg);
    });
  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
