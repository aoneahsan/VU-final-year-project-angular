import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SystemService } from 'src/app/services/system.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {

  _loadingStatus: boolean = false;
  _loadingStatus_Sub: Subscription;

  private _formSubmited_Sub: Subscription;
  errorOccured: boolean = false;
  errorMessage: string;
  errors: any;

  constructor(private _systemService: SystemService, private _authService: AuthService) { }

  ngOnInit(): void {
    this._systemService.loadingPageDataFalse();
    this._loadingStatus_Sub = this._systemService.getLoadingPageDataStatus().subscribe(
      res => {
        this._loadingStatus = res
      }
    );
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this._systemService.loadingPageDataTrue();
    this._formSubmited_Sub = this._authService.signIn(form.value).subscribe(
      res => {
        this._systemService.loadingPageDataTrue();
        window.location.reload();
        console.log("SignInComponent == onSubmit == response = ", res);
      },
      err => {
        this.errorOccured = true;
        console.log("SignInComponent == onSubmit == error = ", err);
        if (err.status == 404) {
          this.errorMessage = 'User Not Found, Invalid data entered.'
        }
        else {
          this.errorMessage = 'Server Error Occured, Refresh Page Try again.'
        }
        this._systemService.loadingPageDataFalse();
        this.errors = err.errors;
      }
    );
  }

  ngOnDestroy(): void {
    if (this._loadingStatus_Sub) {
      this._loadingStatus_Sub.unsubscribe();
    }
    if (this._formSubmited_Sub) {
      this._formSubmited_Sub.unsubscribe();
    }
  }
}
