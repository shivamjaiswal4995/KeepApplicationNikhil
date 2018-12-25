import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeepAppComponent } from './keep-app.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { SidenavComponent } from './component/sidenav/sidenav.component';
import { MainContentComponent } from './component/main-content/main-content.component';

import { MaterialModule } from './../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { GroupService } from './services/group.service';
import { NewGroupDialogComponent } from './component/new-group-dialog/new-group-dialog.component';
import { LoginComponent } from './component/login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { RouterService } from './services/router.service';
import { NoteComponent } from './component/note/note.component';
import { NoteViewComponent } from './component/note-view/note-view.component';
import { ListViewComponent } from './component/list-view/list-view.component';
import { EditNoteOpenerComponent } from './component/edit-note-opener/edit-note-opener.component';
import { EditNoteViewComponent } from './component/edit-note-view/edit-note-view.component';
import { NotesService } from './services/notes.service';
import { NoteTakerComponent } from './component/note-taker/note-taker.component';
import { HoverEffectDirective } from './hover-effect.directive';
import { GroupComponent } from './component/group/group.component';
import { CanActivateRouteGuard } from './can-activate-guard.guard';
import { NoteShareDialogComponent } from './component/note-share-dialog/note-share-dialog.component';
import { AddToGroupDialogComponent } from './component/add-to-group-dialog/add-to-group-dialog.component';
import { UserService } from './services/user.service';
import { NoteFilterPipe } from './note-filter.pipe';
import { ToastrService } from './services/toastr.service';
import { SocketService } from './services/socket.service';
import { NotificationService } from './services/notification.service';


const routes: Routes  = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: KeepAppComponent, canActivate: [CanActivateRouteGuard],
    children: [
      {
        path: '', redirectTo: 'view/notesview', pathMatch: 'full'
      },
      {
        path: 'view/notesview', component: NoteViewComponent
      },
      {
        path: 'view/listview', component: ListViewComponent
      },
      {
        path: 'note/:noteId/edit', component: EditNoteOpenerComponent,
        outlet: 'noteEditOutlet'
      },
      { path: 'group/:id', component: MainContentComponent }
    ]
  },
  { path: '', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    KeepAppComponent,
    ToolbarComponent,
    SidenavComponent,
    MainContentComponent,
    NewGroupDialogComponent,
    NoteShareDialogComponent,
    AddToGroupDialogComponent,
    LoginComponent,
    NoteComponent,
    NoteViewComponent,
    ListViewComponent,
    EditNoteOpenerComponent,
    EditNoteViewComponent,
    NoteTakerComponent,
    HoverEffectDirective,
    GroupComponent,
    NoteFilterPipe
  ],
  entryComponents: [
    NewGroupDialogComponent,
    EditNoteViewComponent,
    NoteShareDialogComponent,
    AddToGroupDialogComponent
  ],
  providers: [
    GroupService,
    AuthenticationService,
    RouterService,
    NotesService,
    CanActivateRouteGuard,
    UserService,
    ToastrService,
    SocketService,
    NotificationService
  ]
})
export class KeepModule { }
