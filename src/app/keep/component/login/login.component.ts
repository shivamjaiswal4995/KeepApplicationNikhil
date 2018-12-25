import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { RouterService } from '../../services/router.service';
import { User } from '../../models/user';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from '../../services/toastr.service';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private _authService: AuthenticationService,
    private _routerService: RouterService,
    private _socketService: SocketService,
    private _toastrService: ToastrService) { }

  user: User;
  userNameError = new FormControl('', [Validators.required]);
  passwordError = new FormControl('', [Validators.required]);
  userEmailError = new FormControl('', [Validators.email, Validators.required]);

  ngOnInit() {
    this.user = new User();
  }

  signIn() {
    // console.log(this.user);
    if (this.user.userEmail && this.user.password) {
      const userObj = {
        username: this.user.userEmail.toLocaleLowerCase(),
        password: this.user.password
      };

      this._authService.authenticateUser(userObj).subscribe (
        userDetails => {
          if (userDetails) {
            const data = {
              userEmail: userDetails.userEmail
            }
            this._socketService.sendSignInEvent(data);
            this._authService.saveUserDetails(userDetails);
            this._routerService.routeToDashboard();
          }
        }
      , err => {
        // console.log('Error while signing in: ', err)
        this._toastrService.error(err.error.message);
      }
    );
    } else {
      console.log('Invalid username or password');
      const msg = 'Invalid username or password';
      this._toastrService.error(msg);
    }
  }

  signUp() {
    if (this.user.userName && this.user.userEmail && this.user.password) {
      const userObj = {
        name: this.user.userName,
        email: this.user.userEmail.toLocaleLowerCase(),
        password: this.user.password
      };

      this._authService.registerUser(userObj).subscribe(
            userDetails => {
              if (userDetails) {
                const data = {
                  userEmail: userDetails.userEmail
                }
                const title = 'Signed up successfully!';
                const message = 'Enjoy our Note taking service. Have fun!';
                this._toastrService.success(message, title);
                this._authService.saveUserDetails(userDetails);
                this._socketService.sendSignUpEvent(data);
                this._routerService.routeToDashboard();
              }
        }, err => {
            console.log('Error while registering user: ', err);
            let errMsg;
            if (err.error.code === 11000) {
              errMsg = 'Username already Exists! Please choose different username or try signing in.';
            } else {
              errMsg = 'Something went wrong! Please try again later';
            }
            this._toastrService.error(errMsg);
        }
      );
    } else {
      console.log('Please prvide all the details!');
      const msg = 'Please provide all the details';
      this._toastrService.error(msg);
    }
  }

  getErrorMessageForUsername() {
    return this.userNameError.hasError('required') ? 'You must enter a valid username' : '';
  }

  getErrorMessageForUserEmail() {
    return this.userEmailError.hasError('required') ? 'You must enter a value' :
      this.userEmailError.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessageForPassword() {
    return this.passwordError.hasError('required') ? 'You must enter a valid password' : '';
  }

// tslint:disable-next-line:eofline
}