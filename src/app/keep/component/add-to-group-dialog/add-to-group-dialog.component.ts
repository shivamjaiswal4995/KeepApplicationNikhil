import { GroupService } from './../../services/group.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Group } from '../../models/group';


@Component({
    selector: 'app-add-to-group-dialog',
    templateUrl: './add-to-group-dialog.component.html',
    styleUrls: ['./add-to-group-dialog.component.scss']
})

export class AddToGroupDialogComponent implements OnInit, OnDestroy {
    groups:  Observable<Group[]>;
    selected: string;
    groupsList: any;
    private _subscription;

    constructor(private dialogRef: MatDialogRef<AddToGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _groupService: GroupService) {
            this.groupsList = [];
            this.selected = '';
        }

    ngOnInit() {
        this.groups = this._groupService.groups;
        this.createGroupsArray();
    }

    createGroupsArray() {
        this._subscription = this.groups.subscribe(groupData => {
            for (const group of groupData) {
                const groupObj = {
                    value: group.groupId,
                    viewValue: group.title
                };
                this.groupsList.push(groupObj);
            }
            console.log('list length: ', this.groupsList.length, this.groupsList);
        });
    }

    done() {
        const selectedGroup = this.groupsList.find(group => group.viewValue === this.selected);
        const groupId = selectedGroup.value;
        this._groupService.addNoteTogroup(groupId, this.data.note)
            .subscribe(res => {
                this.groupsList = [];
                this._groupService.loadAll();
                this.dialogRef.close(res);
            }, err => console.log('Error occurred while adding note to group ', err)
        );
    }

    dismiss() {
        this.groupsList = [];
        this.dialogRef.close(null);
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}

