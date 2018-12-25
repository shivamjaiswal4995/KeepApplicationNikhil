import { GroupService } from '../../services/group.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../../models/group';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  group: Group;

  constructor(private _route: ActivatedRoute, private _groupService: GroupService) { }

  ngOnInit() {
    this._route.params.subscribe(
      params => {
        const id = params['id'];
        this._groupService.groups
          .subscribe(groups => {
            if (groups.length === 0) {
              return;
            }
            setTimeout(() => {
              this.group = this._groupService.groupById(id);
            }, 1000);
          });
      }
    );
  }

}
